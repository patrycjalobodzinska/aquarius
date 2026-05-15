"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function createDropGeometry() {
  const geo = new THREE.SphereGeometry(1, 128, 128);
  const pos = geo.attributes.position;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const t = (y + 1) / 2;
    const taper = 1 - Math.pow(t, 3.5) * 0.35;

    const noise =
      Math.sin(x * 2.2 + 0.7) * Math.cos(z * 1.9) * 0.05 +
      Math.sin(y * 3.1 + 1.2) * 0.04 +
      Math.cos(x * 3.6 + z * 2.8 + 2.1) * 0.03;

    const radial = Math.sqrt(x * x + z * z);
    const nx = radial > 0 ? x / radial : 0;
    const nz = radial > 0 ? z / radial : 0;

    pos.setXYZ(
      i,
      x * taper + nx * noise,
      y * 1.1 + noise * 0.2,
      z * taper + nz * noise,
    );
  }

  geo.computeVertexNormals();
  return geo;
}

function Drop({ scrollProgress }: { scrollProgress: number }) {
  const { viewport, camera, size } = useThree();
  const scrollRef = useRef<THREE.Group>(null);
  const drop = useRef<THREE.Mesh>(null);
  // Typ any bo drei DistortMaterialImpl nie jest eksportowany publicznie.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);

  const dropGeometry = useMemo(() => createDropGeometry(), []);

  // Hover state - canvas ma pointer-events-none, więc czytamy mysz globalnie.
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hoverAmt = useRef(0);
  // Poprzedni progress scroll'a - do wyliczenia prędkości i dodatkowej rotacji X.
  const prevProgress = useRef(scrollProgress);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    const onLeave = () => {
      mouseRef.current.x = -9999;
      mouseRef.current.y = -9999;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  // scroll=0 → dokładnie środek ekranu (nad półkolem kształtu-butelki).
  const targetX = Math.sin(scrollProgress * Math.PI * 2.2) * 0.6;
  const targetY = -scrollProgress * 2.2;

  const projected = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    // Prędkość scrolla (Δprogress / klatkę) daje extra wkład do rotation.x:
    // przy szybkim scrollowaniu kropla bardziej się kręci, w bezruchu - tylko baza.
    const deltaP = scrollProgress - prevProgress.current;
    prevProgress.current = scrollProgress;

    if (drop.current) {
      drop.current.rotation.y += 0.01;
      drop.current.rotation.x += 0.005 + deltaP * 7;
    }

    const g = scrollRef.current;
    if (!g) return;

    g.position.x = THREE.MathUtils.lerp(g.position.x, targetX, 0.06);
    g.position.y = THREE.MathUtils.lerp(g.position.y, targetY, 0.06);

    // Rzut pozycji kropli na piksele viewportu i porównanie z pozycją myszy.
    projected.copy(g.position);
    projected.project(camera);
    const screenX = (projected.x * 0.5 + 0.5) * size.width;
    const screenY = (-projected.y * 0.5 + 0.5) * size.height;
    const dx = mouseRef.current.x - screenX;
    const dy = mouseRef.current.y - screenY;
    const dist = Math.hypot(dx, dy);
    const hoverRadius = size.height * 0.18;
    const isHover = dist < hoverRadius;

    const target = isHover ? 1 : 0;
    hoverAmt.current = THREE.MathUtils.lerp(hoverAmt.current, target, 0.08);

    if (matRef.current) {
      matRef.current.distort = hoverAmt.current * 0.45;
      matRef.current.speed = 2 + hoverAmt.current * 2;
    }
  });

  return (
    <group ref={scrollRef} position={[0, 0, 0]}>
      <group scale={viewport.width / 12}>
        <mesh ref={drop} geometry={dropGeometry} rotation={[0.3, 0.5, 0.1]}>
          <MeshDistortMaterial
            ref={matRef}
            color="#5a9fd8"
            transparent
            opacity={0.78}
            roughness={0}
            metalness={0.25}
            clearcoat={1}
            clearcoatRoughness={0}
            ior={1.6}
            reflectivity={1}
            envMapIntensity={8}
            specularIntensity={2.5}
            specularColor={new THREE.Color(1, 1, 1)}
            depthWrite={false}
            distort={0}
            speed={2}
            radius={1}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function ScrollWaterDrop() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1,
      );
      setProgress(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-30">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.5;
          gl.setClearColor(0x000000, 0);
        }}>
        <Suspense fallback={null}>
          {/* drei Environment z PMREM - splash faktycznie odbija się w Fresnelu kropli. */}
          <Environment files="/hero-spash.jpg" environmentIntensity={2.5} />
          <Drop scrollProgress={progress} />
          {/* Ostre point-light'y dla wyraźnych specular highlight'ów. */}
          <pointLight
            position={[3, 4, 3]}
            intensity={70}
            color="#ffffff"
            distance={14}
            decay={1.3}
          />
          <pointLight
            position={[-3, 3, 2]}
            intensity={55}
            color="#a8d7ff"
            distance={14}
            decay={1.3}
          />
          <pointLight
            position={[0, -3, 3]}
            intensity={40}
            color="#e6f3ff"
            distance={14}
            decay={1.3}
          />
          <directionalLight intensity={2.5} position={[0, 2, 3]} />
        </Suspense>
      </Canvas>
    </div>
  );
}
