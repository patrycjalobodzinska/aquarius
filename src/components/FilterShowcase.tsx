"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useFBX } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import {
  Box3,
  Color,
  Group,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from "three";
import type { ThreeEvent } from "@react-three/fiber";

const FILTER_URL = "/Reverse%20Osmos%20Water%20Filter.FBX";

// Wysokość docelowa modelu w jednostkach świata - wszystko reszta liczone
// względem niej (kamera, dystanse, zakresy podświetlenia).
const TARGET_HEIGHT = 3;
const HIGHLIGHT_COLOR = new Color("#38bdf8");
const DIM_COLOR = new Color("#94a3b8");

type Stage = {
  id: string;
  name: string;
  desc: string;
  // Preferowane: lista nazw meshy do podświetlenia. Meshe FBX z MAX-a mają
  // zwykle nazwy typu "Shape093", "Shape116" - najpewniejszy sposób mapowania.
  meshNames?: string[];
  // Fallback: gdy nie znamy nazw, łapiemy meshe po odległości środka bbox-a od
  // punktu (≤ matchRadius).
  points?: Vector3[];
  matchRadius?: number;
  // Radius używany przez kamerę do obliczenia odległości - większy = dalsza
  // kamera (żeby zmieścić cały klaster targetów w kadrze).
  cameraRadius: number;
  // Offset kamery względem centroidu (przemnożony przez dist). Domyślnie
  // (0.7, 0.35, 0.95) - z prawej, lekko z góry, z przodu (+Z). Dla części
  // które od tej strony widać "od tyłu" odwracamy znak Z.
  cameraOffset?: { x: number; y: number; z: number };
};

// Nazwy w FBX są case-insensitive porównywane (ShapeXXX vs shapeXXX).
const stages: Stage[] = [
  {
    id: "membranes",
    name: "Membrany osmotyczne",
    desc: "Serce systemu - odwrócona osmoza. Pory rzędu 0,0001 µm zatrzymują 99,9% rozpuszczonych soli, metali ciężkich, mikroplastiku, wirusów i bakterii. Trzy moduły pracujące równolegle dają wystarczającą wydajność dla całego gospodarstwa.",
    meshNames: [
      "shape093",
      "shape094",
      "shape095",
      "shape096",
      "shape097",
      "shape098",
      "shape115",
      "shape116",
    ],
    cameraRadius: 0.7,
    // Membrany - patrzymy z przeciwnej strony X (przód membran jest po -X,
    // domyślny kąt z +X +Z pokazywał tył).
    cameraOffset: { x: -0.7, y: 0.35, z: 0.95 },
  },
  {
    id: "mineralizers",
    name: "Mineralizatory",
    desc: "Po odsoleniu woda przechodzi przez złoża mineralne - wracają do niej wapń, magnez, potas i sód. Trzy wkłady pracujące szeregowo podnoszą pH do zdrowych 7,2 – 7,8 i przywracają naturalny smak wody źródlanej.",
    meshNames: ["shape137", "shape147", "shape149", "shape168"],
    cameraRadius: 0.55,
  },
  {
    id: "tank",
    name: "Zbiornik",
    desc: "Magazyn na oczyszczoną i zmineralizowaną wodę pod ciśnieniem. Dzięki niemu z kranu leci natychmiast - bez czekania aż system odfiltruje kolejną porcję.",
    meshNames: ["shape196"],
    cameraRadius: 0.45,
    // Zbiornik - kamera z lekko-lewego frontu (-X), żeby pokazać go bardziej z lewej.
    cameraOffset: { x: -0.5, y: 0.3, z: 1.2 },
  },
];

// Sprawdza czy mesh należy do stage'a (po nazwie albo po pozycji).
function meshMatchesStage(entry: MeshEntry, stage: Stage): boolean {
  if (stage.meshNames && stage.meshNames.length > 0) {
    const n = entry.mesh.name.toLowerCase();
    return stage.meshNames.some((s) => s.toLowerCase() === n);
  }
  if (stage.points && stage.matchRadius !== undefined) {
    const r = stage.matchRadius;
    return stage.points.some((p) => entry.worldCenter.distanceTo(p) <= r);
  }
  return false;
}

// === MODEL ============================================================

type MeshEntry = {
  mesh: Mesh;
  // Środek bbox-a mesha w przestrzeni świata (po wyskalowaniu).
  worldCenter: Vector3;
  // oryginalne wartości materiału - żeby móc cofnąć highlight
  originalColor: Color;
  originalEmissive: Color;
  originalEmissiveIntensity: number;
};

function FilterModel({
  activeIndex,
  onStageCentroidsReady,
}: {
  activeIndex: number | null;
  onStageCentroidsReady: (centroids: (Vector3 | null)[]) => void;
}) {
  const fbx = useFBX(FILTER_URL);
  const groupRef = useRef<Group>(null);
  const meshesRef = useRef<MeshEntry[]>([]);
  const [transform, setTransform] = useState<{
    scale: number;
    offset: Vector3;
  } | null>(null);

  // Po załadowaniu: licz bbox, ustaw scale + offset żeby model był wysoki na
  // TARGET_HEIGHT i wycentrowany w (0,0,0). Zbieramy też wszystkie meshe i ich
  // oryginalne materiały - żeby później móc kolorować/odbarwiać.
  useEffect(() => {
    const box = new Box3().setFromObject(fbx);
    const size = new Vector3();
    box.getSize(size);
    const center = new Vector3();
    box.getCenter(center);
    if (size.y === 0) return;

    const scale = TARGET_HEIGHT / size.y;
    const offset = new Vector3(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale,
    );
    setTransform({ scale, offset });
  }, [fbx]);

  // Po ustawieniu transform - zbieramy meshe i ich pozycje Y w świecie.
  // Klonujemy materiały żeby modyfikacje nie wpływały na cache useFBX.
  useEffect(() => {
    if (!transform || !groupRef.current) return;
    groupRef.current.updateMatrixWorld(true);
    const collected: MeshEntry[] = [];
    groupRef.current.traverse((obj: Object3D) => {
      if (obj instanceof Mesh) {
        // Klonuj materiał (single lub array), żeby nasze zmiany były lokalne.
        if (Array.isArray(obj.material)) {
          obj.material = obj.material.map((m) => m.clone());
        } else {
          obj.material = obj.material.clone();
        }
        const mat = (
          Array.isArray(obj.material) ? obj.material[0] : obj.material
        ) as MeshStandardMaterial;

        const meshBox = new Box3().setFromObject(obj);
        const wc = new Vector3();
        meshBox.getCenter(wc);

        collected.push({
          mesh: obj,
          worldCenter: wc,
          originalColor: mat.color ? mat.color.clone() : new Color("#ffffff"),
          originalEmissive: mat.emissive
            ? mat.emissive.clone()
            : new Color("#000000"),
          originalEmissiveIntensity: mat.emissiveIntensity ?? 0,
        });
      }
    });
    meshesRef.current = collected;

    // === DEBUG: zrzut wszystkich meshy z ich pozycjami i hierarchią ===
    const debugEntries = collected
      .map((e) => {
        const meshBox = new Box3().setFromObject(e.mesh);
        const size = new Vector3();
        meshBox.getSize(size);
        return {
          name: e.mesh.name || "(unnamed)",
          parent: e.mesh.parent?.name || "(no parent)",
          x: +e.worldCenter.x.toFixed(3),
          y: +e.worldCenter.y.toFixed(3),
          z: +e.worldCenter.z.toFixed(3),
          sizeX: +size.x.toFixed(3),
          sizeY: +size.y.toFixed(3),
          sizeZ: +size.z.toFixed(3),
          uuid: e.mesh.uuid.slice(0, 8),
        };
      })
      .sort((a, b) => b.y - a.y);

    console.group(
      `%c[FilterShowcase] Loaded ${collected.length} meshes - sorted top→bottom`,
      "color:#0ea5e9;font-weight:bold",
    );
    console.table(debugEntries);
    console.log(
      "Tip: Click any mesh in the scene to see its info logged here.",
    );
    console.groupEnd();

    // Policz centroid (środek geometryczny) meshy każdego stage'a - kamera
    // poleci dokładnie do tego punktu zamiast do hardcoded targetu.
    const centroids: (Vector3 | null)[] = stages.map((stage) => {
      const matched = collected.filter((e) => meshMatchesStage(e, stage));
      if (matched.length === 0) {
        console.warn(
          `[FilterShowcase] Stage "${stage.id}" - żaden mesh nie pasuje. Sprawdź meshNames lub points.`,
        );
        return null;
      }
      const c = new Vector3();
      matched.forEach((m) => c.add(m.worldCenter));
      c.divideScalar(matched.length);
      console.log(
        `[FilterShowcase] Stage "${stage.id}": ${matched.length} mesh(y), centroid:`,
        { x: +c.x.toFixed(3), y: +c.y.toFixed(3), z: +c.z.toFixed(3) },
      );
      return c;
    });
    onStageCentroidsReady(centroids);
  }, [transform, onStageCentroidsReady]);

  // Highlight active stage - meshe w zakresie zmieniają kolor, reszta zostaje
  // przygaszona. Cel-Y w świecie liczymy ze stages[].relY * TARGET_HEIGHT.
  useEffect(() => {
    const meshes = meshesRef.current;
    if (meshes.length === 0) return;

    if (activeIndex === null) {
      // Cofamy do oryginałów.
      meshes.forEach((e) => {
        const mats = Array.isArray(e.mesh.material)
          ? e.mesh.material
          : [e.mesh.material];
        mats.forEach((m) => {
          const mat = m as MeshStandardMaterial;
          if (mat.color) mat.color.copy(e.originalColor);
          if (mat.emissive) mat.emissive.copy(e.originalEmissive);
          mat.emissiveIntensity = e.originalEmissiveIntensity;
          mat.needsUpdate = true;
        });
      });
      return;
    }

    const stage = stages[activeIndex];
    // Highlight = meshe pasujące do stage'a (po nazwie albo pozycji).
    meshes.forEach((e) => {
      const mats = Array.isArray(e.mesh.material)
        ? e.mesh.material
        : [e.mesh.material];
      const inRange = meshMatchesStage(e, stage);
      mats.forEach((m) => {
        const mat = m as MeshStandardMaterial;
        if (inRange) {
          if (mat.color) mat.color.copy(HIGHLIGHT_COLOR);
          if (mat.emissive) mat.emissive.copy(HIGHLIGHT_COLOR);
          mat.emissiveIntensity = 0.65;
        } else {
          if (mat.color) {
            mat.color.copy(e.originalColor).lerp(DIM_COLOR, 0.55);
          }
          if (mat.emissive) mat.emissive.copy(e.originalEmissive);
          mat.emissiveIntensity = e.originalEmissiveIntensity * 0.4;
        }
        mat.needsUpdate = true;
      });
    });
  }, [activeIndex]);

  // Handler kliku w meshu - loguje wszystko co potrzebne, żeby zidentyfikować
  // część modelu i zmapować na stage.
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as Mesh;
    const worldPos = new Vector3();
    mesh.getWorldPosition(worldPos);
    const meshBox = new Box3().setFromObject(mesh);
    const size = new Vector3();
    meshBox.getSize(size);
    const center = new Vector3();
    meshBox.getCenter(center);
    const halfH = TARGET_HEIGHT / 2;
    const relY = (center.y + halfH) / TARGET_HEIGHT;

    // Ścieżka po hierarchii (najgłębszy → root) - żeby było widać do której
    // części modelu należy.
    const path: string[] = [];
    let node: Object3D | null = mesh;
    while (node) {
      path.unshift(node.name || "(unnamed)");
      node = node.parent;
    }

    console.group(
      `%c[FilterShowcase] CLICK → ${mesh.name || "(unnamed mesh)"}`,
      "color:#22c55e;font-weight:bold",
    );
    console.log("name:        ", mesh.name);
    console.log("uuid:        ", mesh.uuid);
    console.log("parent:      ", mesh.parent?.name);
    console.log("hierarchy:   ", path.join(" › "));
    console.log("world center:", {
      x: +center.x.toFixed(3),
      y: +center.y.toFixed(3),
      z: +center.z.toFixed(3),
    });
    console.log("world Y:     ", +center.y.toFixed(3));
    console.log("relY (0-1):  ", +relY.toFixed(3));
    console.log("size:        ", {
      x: +size.x.toFixed(3),
      y: +size.y.toFixed(3),
      z: +size.z.toFixed(3),
    });
    console.log("intersect pt:", {
      x: +e.point.x.toFixed(3),
      y: +e.point.y.toFixed(3),
      z: +e.point.z.toFixed(3),
    });
    console.groupEnd();
  };

  if (!transform) {
    return (
      <group ref={groupRef} visible={false}>
        <primitive object={fbx} />
      </group>
    );
  }

  return (
    <group
      ref={groupRef}
      scale={transform.scale}
      position={[transform.offset.x, transform.offset.y, transform.offset.z]}
      onClick={handleClick}>
      <primitive object={fbx} />
    </group>
  );
}

// === KAMERA ===========================================================

function CameraRig({
  activeIndex,
  stageCentroids,
}: {
  activeIndex: number | null;
  stageCentroids: (Vector3 | null)[];
}) {
  const { camera } = useThree();
  const desiredPos = useRef(new Vector3(3.4, 0.2, 4.2));
  const desiredTarget = useRef(new Vector3(0.6, -0.7, -0.1));
  const currentTarget = useRef(new Vector3(0.6, -0.7, -0.1));
  const idleAngle = useRef(0);
  const initialized = useRef(false);

  useFrame((_, delta) => {
    const centroid = activeIndex !== null ? stageCentroids[activeIndex] : null;
    if (activeIndex !== null && centroid) {
      const stage = stages[activeIndex];
      const off = stage.cameraOffset ?? { x: 0.7, y: 0.35, z: 0.95 };
      // Kamera odsunięta proporcjonalnie do cameraRadius (im większy klaster
      // tym dalsza kamera, żeby wszystko zmieściło się w kadrze).
      const dist = Math.max(stage.cameraRadius * 3, 1.4);
      desiredPos.current.set(
        centroid.x + dist * off.x,
        centroid.y + dist * off.y,
        centroid.z + dist * off.z,
      );
      desiredTarget.current.copy(centroid);
    } else {
      // Idle - kamera siedzi z PRZODU modelu (+Z) i delikatnie kołysze się
      // w lewo-prawo (sin po X) zamiast latać dookoła. Wolne tempo, mała
      // amplituda - bardziej "oddychający" widok niż pełny orbit.
      idleAngle.current += delta * 0.5;
      const orbitCenter = new Vector3(0.6, -0.7, -0.1);
      const swayX = Math.sin(idleAngle.current) * 0.7;
      desiredPos.current.set(
        orbitCenter.x + swayX,
        orbitCenter.y + 0.8,
        orbitCenter.z + 3.0,
      );
      desiredTarget.current.copy(orbitCenter);
    }

    if (!initialized.current) {
      camera.position.copy(desiredPos.current);
      currentTarget.current.copy(desiredTarget.current);
      initialized.current = true;
    } else {
      camera.position.lerp(desiredPos.current, 0.07);
      currentTarget.current.lerp(desiredTarget.current, 0.09);
    }
    camera.lookAt(currentTarget.current);
  });

  return null;
}

// === SCENE ============================================================

function Scene({ activeIndex }: { activeIndex: number | null }) {
  const [stageCentroids, setStageCentroids] = useState<(Vector3 | null)[]>([]);
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[6, 9, 5]} intensity={1.15} />
      <directionalLight position={[-4, 4, -2]} intensity={0.5} />
      <Suspense fallback={null}>
        {/* Wbudowany preset zamiast 27 MB HDR-a - kilka KB, te same odbicia. */}
        <Environment preset="city" environmentIntensity={0.85} />
        <FilterModel
          activeIndex={activeIndex}
          onStageCentroidsReady={setStageCentroids}
        />
      </Suspense>
      <CameraRig activeIndex={activeIndex} stageCentroids={stageCentroids} />
    </>
  );
}

// === COMPONENT ========================================================

export default function FilterShowcase() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [shouldMount, setShouldMount] = useState(false);

  // Lazy-mount Canvas - model nie pobiera się dopóki sekcja nie zbliży się do
  // viewportu. Większy rootMargin = wcześniejsze tło-pobieranie modelu, więc
  // gdy użytkownik dojedzie wzrokiem, model już jest w pamięci.
  // frameloop="never" gdy poza ekranem - zero kosztu CPU/GPU dla tła.
  useEffect(() => {
    const el = canvasWrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShouldMount(true);
        setInView(entry.isIntersecting);
      },
      { rootMargin: "1500px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-sky-50/60 via-white to-sky-50/60 py-24 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* LEWA - 3D filtra */}
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 50% 55%, rgba(125, 211, 252, 0.55), transparent 65%)",
            }}
          />
          <div
            ref={canvasWrapRef}
            className="relative h-[68vh] min-h-[480px] w-full">
            {shouldMount ? (
              <Canvas
                camera={{ position: [3.4, 0.2, 4.2], fov: 42 }}
                gl={{
                  antialias: false,
                  alpha: true,
                  powerPreference: "high-performance",
                  stencil: false,
                  depth: true,
                }}
                dpr={[1, 1.25]}
                frameloop={inView ? "always" : "never"}
                performance={{ min: 0.5 }}>
                <Scene activeIndex={activeIndex} />
              </Canvas>
            ) : (
              <div className="grid h-full w-full place-items-center text-sm text-blue-900/40">
                Ładowanie modelu 3D…
              </div>
            )}
          </div>
          <div
            aria-hidden
            className="pointer-events-none mx-auto -mt-6 h-10 w-3/4 rounded-full bg-blue-950/15 blur-2xl"
          />
        </div>

        {/* PRAWA - lista etapów */}
        <div>
          <div className="mb-4 inline-block rounded-full bg-blue-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-white">
            Budowa systemu
          </div>
          <h2 className="text-4xl font-semibold leading-[1.05] tracking-tight text-blue-950 md:text-5xl">
            Trzy elementy.
            <br />
            Czysta szklanka.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-slate-600">
            Kliknij element - kamera zbliży się do niego, a podświetlone meshe
            pokażą o którą część systemu chodzi.
          </p>

          <ol className="mt-8 space-y-2">
            {stages.map((s, i) => {
              const open = activeIndex === i;
              return (
                <li
                  key={s.id}
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    open
                      ? "border-blue-300 bg-white shadow-md shadow-blue-100"
                      : "border-sky-100 bg-white/60 hover:border-blue-200 hover:bg-white"
                  }`}>
                  <button
                    type="button"
                    onClick={() => setActiveIndex(open ? null : i)}
                    className="flex w-full items-center gap-4 px-5 py-4 text-left">
                    <span
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-semibold transition-colors ${
                        open
                          ? "bg-blue-700 text-white"
                          : "bg-sky-100 text-blue-900"
                      }`}>
                      {i + 1}
                    </span>
                    <span className="flex-1 text-base font-medium text-blue-950">
                      {s.name}
                    </span>
                    <svg
                      viewBox="0 0 24 24"
                      className={`h-4 w-4 text-blue-700 transition-transform ${
                        open ? "rotate-180" : "rotate-0"
                      }`}
                      fill="currentColor"
                      aria-hidden>
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>
                  <div
                    className="grid transition-[grid-template-rows] duration-300 ease-out"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                    }}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
