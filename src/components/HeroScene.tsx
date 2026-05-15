"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
// Zachowane komponenty „podłóg" gotowe do wrzucenia z powrotem:
// import Water from "./Water"; // GPGPU wodna symulacja (Water.tsx + WaterShaders.ts)
// import ReflectorFloor from "./ReflectorFloor"; // proste lustro z drei

function dropGeometry() {
  // 64×64 = ~4k wierzchołków zamiast 128×128 (~16k). Wizualnie identyczne dla
  // tej skali, ale taniej w GPU i szybciej kompiluje shader przy mountcie.
  const g = new THREE.SphereGeometry(1, 64, 64);
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

const REST_Y = 0.3;
// Start poza kadrem u góry — kropla „wypływa z góry" i ląduje na REST_Y.
const START_Y = 4.2;
// Kamera: startowe z=5, na końcu scrolla zatrzymuje się tuż przed kroplą (która siedzi na z=-0.4).
const CAMERA_Z_START = 5;
const CAMERA_Z_END = -0.15;

function Drop() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const matRef = useRef<any>(null);
  const geo = useMemo(() => dropGeometry(), []);

  const { camera, size } = useThree();
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const hoverAmt = useRef(0);
  const entryY = useRef(START_Y);
  const projected = useMemo(() => new THREE.Vector3(), []);

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

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    // Szybszy wjazd - kropla widoczna od pierwszej klatki, ląduje wyraźnie.
    entryY.current = THREE.MathUtils.lerp(entryY.current, REST_Y, 0.06);
    if (groupRef.current) groupRef.current.position.y = entryY.current;

    // 1 = dopiero wystartowała z góry, 0 = wylądowała.
    const fallAmount = THREE.MathUtils.clamp(
      (entryY.current - REST_Y) / (START_Y - REST_Y),
      0,
      1,
    );

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.15;
      meshRef.current.rotation.x = Math.sin(t * 0.35) * 0.08;
      // ROZCIĄGNIĘCIE PODCZAS SPADANIA: Y wydłuża się, XZ ściska → kształt
      // „lejącej się wody". Po wylądowaniu (fallAmount→0) wraca do 0.95 uniform.
      const baseScale = 0.95;
      const stretchY = baseScale * (1 + fallAmount * 1.6);
      const squeezeXZ = baseScale * (1 - fallAmount * 0.45);
      meshRef.current.scale.set(squeezeXZ, stretchY, squeezeXZ);
    }

    projected.set(0, entryY.current, -0.4).project(camera);
    const screenX = (projected.x * 0.5 + 0.5) * size.width;
    const screenY = (-projected.y * 0.5 + 0.5) * size.height;
    const dx = mouseRef.current.x - screenX;
    const dy = mouseRef.current.y - screenY;
    const dist = Math.hypot(dx, dy);
    const hoverRadius = size.height * 0.2;
    const isHover = dist < hoverRadius;
    hoverAmt.current = THREE.MathUtils.lerp(
      hoverAmt.current,
      isHover ? 1 : 0,
      0.08,
    );

    if (matRef.current) {
      matRef.current.distort = 0.12 + hoverAmt.current * 0.5;
      matRef.current.speed = 1.4 + hoverAmt.current * 2.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, START_Y, -0.4]}>
      <Float floatIntensity={0.15} rotationIntensity={0.15} speed={1.1}>
        <mesh
          ref={meshRef}
          geometry={geo}
          scale={0.95}
          rotation={[0.3, 0.5, 0.1]}>
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
            distort={0.12}
            speed={1.4}
            radius={1}
          />
        </mesh>
      </Float>
    </group>
  );
}

function CameraRig({ scrollRef }: { scrollRef: React.RefObject<number> }) {
  const { camera } = useThree();
  useFrame(() => {
    const p = scrollRef.current ?? 0;
    // Ease-out - na początku szybciej, pod koniec zwalnia (mniej agresywne „wbicie" w kroplę).
    const eased = 1 - Math.pow(1 - p, 2);
    const targetZ = THREE.MathUtils.lerp(CAMERA_Z_START, CAMERA_Z_END, eased);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.1);
  });
  return null;
}

export default function HeroScene({ onReady }: { onReady?: () => void } = {}) {
  const scrollRef = useRef(0);

  // Kropla wpływa z góry od pierwszej klatki — nie czekamy już na env-mapę.
  // Scroll odblokowujemy tuż po mount-cie sceny, żeby user nie miał wrażenia
  // zamrożonej strony.
  useEffect(() => {
    const t = window.setTimeout(() => onReady?.(), 200);
    return () => window.clearTimeout(t);
  }, [onReady]);

  useEffect(() => {
    const onScroll = () => {
      const h = Math.max(window.innerHeight, 1);
      scrollRef.current = Math.min(1, Math.max(0, window.scrollY / h));
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
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.25]}
        camera={{ position: [0, 0.4, CAMERA_Z_START], fov: 42 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.4;
          gl.setClearColor(0x000000, 0);
        }}>
        {/* Światła zawsze widoczne. */}
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
        {/* Mocniejszy ambient + niebieski punkt fill zostawia kroplę
            wystarczająco widoczną zanim env-mapa się dociągnie. */}
        <ambientLight intensity={0.55} color="#cfe7ff" />

        {/* Drop renderuje się od pierwszej klatki — wpływa z góry. Env-mapa
            doleci w tle (Suspense) i podmieni odbicia gdy będzie gotowa. */}
        <CameraRig scrollRef={scrollRef} />
        <Drop />

        <Suspense fallback={null}>
          {/* Env-mapa: 46 KB JPG (equirectangular). PMREM 128 daje czytelne
              odbicia na clearcoat. */}
          <Environment
            files="/hero-env-small.jpg"
            environmentIntensity={2.2}
            resolution={128}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
