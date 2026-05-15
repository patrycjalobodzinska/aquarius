"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// Ta sama geometria co w HeroScene - nieregularna „kropla".
function dropGeometry() {
  const g = new THREE.SphereGeometry(1, 128, 128);
  const pos = g.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const t = (y + 1) / 2;
    const taper = 1 - Math.pow(t, 3.5) * 0.35;
    const n =
      Math.sin(x * 2.2 + 0.7) * Math.cos(z * 1.9) * 0.06 +
      Math.sin(y * 3.1 + 1.2) * 0.05 +
      Math.cos(x * 3.6 + z * 2.8 + 2.1) * 0.04 +
      Math.sin(x * 5.1 + y * 4.3) * 0.025;
    const r = Math.sqrt(x * x + z * z);
    const nx = r > 0 ? x / r : 0;
    const nz = r > 0 ? z / r : 0;
    pos.setXYZ(i, x * taper + nx * n, y * 1.1 + n * 0.25, z * taper + nz * n);
  }
  g.computeVertexNormals();
  return g;
}

function DropMesh() {
  const ref = useRef<THREE.Mesh>(null);
  const geo = useMemo(() => dropGeometry(), []);
  // Rotacja 1:1 jak w HeroScene - Y-spin + subtelna oscylacja X.
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.15;
    ref.current.rotation.x = Math.sin(t * 0.35) * 0.08;
  });
  return (
    <Float floatIntensity={0.15} rotationIntensity={0.15} speed={1.1}>
      {/* Jedna kropla, normalny (uniform) scale 0.95 - identycznie jak w hero. */}
      <mesh ref={ref} geometry={geo} scale={0.95} rotation={[0.3, 0.5, 0.1]}>
        {/* MATERIAŁ + env + światła 1:1 z HeroScene → ta sama struktura i odbicia. */}
        <MeshDistortMaterial
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
          distort={0.12}
          speed={1.4}
          radius={1}
          fog={false}
        />
      </mesh>
    </Float>
  );
}

type Props = {
  size?: number;
};

export default function SmallDrop({ size = 120 }: Props) {
  return (
    <div style={{ width: size, height: size }} className="pointer-events-none">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.4, 5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.4;
          gl.setClearColor(0x000000, 0);
        }}>
        <Suspense fallback={null}>
          {/* 1:1 jak HeroScene - ta sama tekstura środowiskowa + intensity. */}
          <Environment files="/hero-spash.jpg" environmentIntensity={2.2} />

          <DropMesh />

          {/* Światła skopiowane 1:1 z HeroScene. */}
          <pointLight
            position={[3, 4, 3]}
            intensity={60}
            color="#ffffff"
            distance={14}
            decay={1.3}
          />
          <pointLight
            position={[-3, 3, 2]}
            intensity={45}
            color="#a8d7ff"
            distance={14}
            decay={1.3}
          />
          <directionalLight intensity={1.8} position={[0, 2, 3]} />
          <ambientLight intensity={0.3} />
        </Suspense>
      </Canvas>
    </div>
  );
}
