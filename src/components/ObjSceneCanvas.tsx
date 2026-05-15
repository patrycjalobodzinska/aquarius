"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import {
  Bounds,
  Environment,
  Grid,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import {
  applyGlassPresetToObject,
  applyGlassTransmission,
} from "@/lib/glassMaterials";
import { removeNodesByName } from "@/lib/removeNodesByName";

const HDR_URL = "/11.hdr";

/**
 * Bazowy katalog dla `OBJLoader.setPath` (ładowanie MTL).
 * Three.js robi `path + url`: `"/"` + `"/plik.obj"` → `"//plik.obj"` (URL bez hosta → Failed to fetch).
 * Dla plików leżących bezpośrednio w root (`/foo.obj`) zwracamy `""`.
 */
function pathPrefix(url: string) {
  const clean = url.startsWith("/") ? url : `/${url}`;
  const lastSlash = clean.lastIndexOf("/");
  if (lastSlash <= 0) return "";
  return clean.slice(0, lastSlash + 1);
}

function ObjBottleAndCap({
  bottleUrl,
  capUrl,
}: {
  bottleUrl: string;
  capUrl: string;
}) {
  const bottle = useLoader(OBJLoader, bottleUrl, (loader) => {
    loader.setPath(pathPrefix(bottleUrl));
  });
  const cap = useLoader(OBJLoader, capUrl, (loader) => {
    loader.setPath(pathPrefix(capUrl));
  });

  const group = useMemo(() => {
    const g = new THREE.Group();
    const b = bottle.clone(true);
    const c = cap.clone(true);
    applyGlassPresetToObject(b, "body");
    applyGlassPresetToObject(c, "cap");
    g.add(b);
    g.add(c);
    return g;
  }, [bottle, cap]);

  return <primitive object={group} />;
}

/** Jeden plik OBJ z wieloma obiektami (np. butelka + nakrętka + Plane) - jak w GLB. */
function ObjSingleFile({
  url,
  removeObjectNames,
  transmissionMaterialNames,
}: {
  url: string;
  removeObjectNames?: string[];
  transmissionMaterialNames?: string[];
}) {
  const loaded = useLoader(OBJLoader, url, (loader) => {
    loader.setPath(pathPrefix(url));
  });

  const root = useMemo(() => {
    const g = loaded.clone(true);
    if (removeObjectNames?.length) removeNodesByName(g, removeObjectNames);
    if (transmissionMaterialNames?.length)
      applyGlassTransmission(g, transmissionMaterialNames);
    else applyGlassPresetToObject(g, "body");
    return g;
  }, [loaded, removeObjectNames, transmissionMaterialNames]);

  return (
    <group position={[0, 0.12, 0]} scale={1.14}>
      <primitive object={root} />
    </group>
  );
}

function BackdropImage({ src }: { src: string }) {
  const tex = useTexture(src);
  tex.colorSpace = THREE.SRGBColorSpace;
  return (
    <mesh position={[0, 0.15, -5]} renderOrder={-100}>
      <planeGeometry args={[18, 11]} />
      <meshBasicMaterial map={tex} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

export default function ObjSceneCanvas({
  bottleObjUrl,
  capObjUrl,
  backdropUrl,
  removeObjectNames,
  transmissionMaterialNames,
}: {
  bottleObjUrl: string;
  capObjUrl?: string;
  /** obraz z `public` (np. `/tlo.jpg`) - płaszczyzna za modelem */
  backdropUrl?: string;
  /** nazwy obiektów do usunięcia (np. `Plane` - tło z eksportu) */
  removeObjectNames?: string[];
  /** jak w GLB: Material.002 = szkło, Material.003 = nakrętka */
  transmissionMaterialNames?: string[];
}) {
  return (
    <div className="h-[min(85svh,920px)] w-full min-h-[400px] overflow-hidden rounded-xl border border-zinc-800 bg-linear-to-br from-slate-800 via-indigo-950/90 to-zinc-950">
      <Canvas
        camera={{ position: [2.4, 2, 3], fov: 48 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
          gl.setClearColor(0x000000, 0);
        }}>
        <hemisphereLight args={["#b8c5e8", "#1a1520"]} intensity={0.35} />
        <ambientLight intensity={0.12} />
        <directionalLight position={[6, 10, 4]} intensity={0.9} />
        <directionalLight
          position={[-4, 6, -2]}
          intensity={0.4}
          color="#a8c4ff"
        />
        <Suspense fallback={null}>
          <Environment
            files={HDR_URL}
            environmentIntensity={1.4}
            background
            backgroundBlurriness={0.55}
            backgroundIntensity={0.7}
          />
          {backdropUrl ? <BackdropImage src={backdropUrl} /> : null}
          <Grid
            args={[20, 20]}
            position={[0, -0.52, 0]}
            cellSize={0.35}
            cellThickness={0.6}
            cellColor="#64748b"
            sectionSize={3.5}
            sectionThickness={1}
            sectionColor="#94a3b8"
            fadeDistance={28}
            fadeStrength={1}
            infiniteGrid
          />
          <Bounds fit clip observe margin={1.58} maxDuration={0.35}>
            {capObjUrl ? (
              <ObjBottleAndCap bottleUrl={bottleObjUrl} capUrl={capObjUrl} />
            ) : (
              <ObjSingleFile
                url={bottleObjUrl}
                removeObjectNames={removeObjectNames}
                transmissionMaterialNames={transmissionMaterialNames}
              />
            )}
          </Bounds>
        </Suspense>
        <OrbitControls
          makeDefault
          target={[0, 0.14, 0]}
          enableDamping
          dampingFactor={0.06}
          minPolarAngle={0.15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
