"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Environment,
  Grid,
  OrbitControls,
  useGLTF,
} from "@react-three/drei";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import { applyGlassTransmission } from "@/lib/glassMaterials";
import { removeNodesByName } from "@/lib/removeNodesByName";

const HDR_URL = "/11.hdr";

function GlbModel({
  url,
  removeObjectNames,
  transmissionMaterialNames,
}: {
  url: string;
  removeObjectNames?: string[];
  transmissionMaterialNames?: string[];
}) {
  const { scene } = useGLTF(url);
  const root = useMemo(() => {
    const cloned = scene.clone(true);
    if (removeObjectNames?.length) removeNodesByName(cloned, removeObjectNames);
    if (transmissionMaterialNames?.length)
      applyGlassTransmission(cloned, transmissionMaterialNames);
    return cloned;
  }, [scene, url, removeObjectNames, transmissionMaterialNames]);

  return (
    <group position={[0, 0.12, 0]} scale={1.14}>
      <primitive object={root} />
    </group>
  );
}

export default function GlbCanvas({
  modelUrl,
  removeObjectNames,
  transmissionMaterialNames,
}: {
  modelUrl: string;
  removeObjectNames?: string[];
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
          gl.toneMappingExposure = 1;
          gl.setClearColor(0x000000, 0);
        }}
      >
        <hemisphereLight args={["#b8c5e8", "#1a1520"]} intensity={0.55} />
        <ambientLight intensity={0.22} />
        <directionalLight position={[6, 10, 4]} intensity={1.15} />
        <directionalLight position={[-4, 6, -2]} intensity={0.35} color="#a8c4ff" />
        <Suspense fallback={null}>
          <Environment
            files={HDR_URL}
            environmentIntensity={1.35}
            background
            blur={0.9}
            backgroundIntensity={0.7}
          />
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
            <GlbModel
              url={modelUrl}
              removeObjectNames={removeObjectNames}
              transmissionMaterialNames={transmissionMaterialNames}
            />
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
