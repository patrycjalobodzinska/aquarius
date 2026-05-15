"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  MeshDistortMaterial,
  OrbitControls,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import * as THREE from "three";

function WaterDrop() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    const m = ref.current;
    if (!m) return;
    m.rotation.y = clock.getElapsedTime() * 0.1;
    m.rotation.x = THREE.MathUtils.lerp(m.rotation.x, mouse.y * 0.2, 0.04);
  });
  return (
    <mesh ref={ref} position={[0, 0.3, 0]} castShadow>
      {/* Gęsta siatka → distortion shader daje gładkie fale, bez graniastych artefaktów. */}
      <sphereGeometry args={[1.6, 256, 192]} />
      <MeshDistortMaterial
        color="#ffffff"
        roughness={0}
        metalness={0}
        transmission={1}
        thickness={1.6}
        ior={1.33}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={2.6}
        reflectivity={0.55}
        attenuationColor={new THREE.Color("#cfe7ff")}
        attenuationDistance={2.2}
        specularIntensity={1.2}
        transparent={false}
        // Napięcie powierzchniowe w zerowej grawitacji - powolne, łagodne fale.
        distort={0.32}
        speed={1.1}
        radius={1}
      />
    </mesh>
  );
}

export default function BubbleScene() {
  return (
    <div className="h-svh w-full bg-black">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.8, 5], fov: 42 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
        }}>
        <Suspense fallback={null}>
          <Environment
            files="/11.hdr"
            background
            backgroundBlurriness={0.25}
            backgroundIntensity={0.9}
            environmentIntensity={1.4}
          />
          <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.4}>
            <WaterDrop />
          </Float>
          <ContactShadows
            position={[0, -1.45, 0]}
            opacity={0.45}
            scale={8}
            blur={2.6}
            far={3}
            color="#000814"
          />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI * 0.495}
          target={[0, 0.2, 0]}
        />
      </Canvas>
    </div>
  );
}
