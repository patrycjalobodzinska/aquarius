"use client";

import { MeshReflectorMaterial } from "@react-three/drei";

// Prosta, lustrzana podłoga z drei. Trzymam jako osobny komponent,
// gdyby trzeba było ją szybko wrzucić z powrotem do sceny.
type ReflectorFloorProps = {
  position?: [number, number, number];
  size?: number;
  color?: string;
};

export default function ReflectorFloor({
  position = [0, -1.2, 0],
  size = 30,
  color = "#cfe6f4",
}: ReflectorFloorProps) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={position}>
      <planeGeometry args={[size, size]} />
      <MeshReflectorMaterial
        resolution={1024}
        blur={[200, 50]}
        mixBlur={1.5}
        mixStrength={3}
        mixContrast={1.1}
        mirror={1}
        roughness={0.15}
        depthScale={0.4}
        minDepthThreshold={0.2}
        maxDepthThreshold={1}
        color={color}
        metalness={0}
      />
    </mesh>
  );
}
