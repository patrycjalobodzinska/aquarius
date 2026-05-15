"use client";

import { Canvas } from "@react-three/fiber";
import {
  Bounds,
  Environment,
  OrbitControls,
  useFBX,
} from "@react-three/drei";
import { Suspense } from "react";

const HDR_URL = "/11.hdr";

function FbxModel({ url }: { url: string }) {
  const fbx = useFBX(url);
  return (
    <group position={[0, 0.12, 0]} scale={1.14}>
      <primitive object={fbx} />
    </group>
  );
}

export default function FbxCanvas({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="h-[min(85svh,920px)] w-full min-h-[400px] rounded-xl border border-zinc-800 bg-zinc-950">
      <Canvas
        camera={{ position: [2.4, 2, 3], fov: 48 }}
        gl={{ antialias: true }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#09090b"]} />
        <ambientLight intensity={0.35} />
        <directionalLight position={[6, 8, 4]} intensity={1.1} />
        <Suspense fallback={null}>
          <Environment files={HDR_URL} environmentIntensity={0.85} />
          <Bounds fit clip observe margin={1.58} maxDuration={0.35}>
            <FbxModel url={modelUrl} />
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
