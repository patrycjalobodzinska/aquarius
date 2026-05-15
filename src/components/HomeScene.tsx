"use client";

import ModelSection, {
  type ModelSectionConfig,
} from "@/components/ModelSection";

const MODEL_SECTIONS: ModelSectionConfig[] = [
  {
    id: "reverse-osmosis-filter",
    title: "Filtr odwróconej osmozy",
    filename: "Reverse Osmos Water Filter.FBX",
    kind: "fbx",
    modelUrl: "/Reverse%20Osmos%20Water%20Filter.FBX",
  },
  {
    id: "converted-glb",
    title: "Converted",
    filename: "converted.glb",
    kind: "glb",
    modelUrl: "/converted.glb",
  },
  {
    id: "bottle-set-glb",
    title: "Zestaw butelek (GLB)",
    filename: "uploads_files_3478382_Bottle-set.glb",
    kind: "glb",
    modelUrl: "/uploads_files_3478382_Bottle-set.glb",
    glbRemoveObjectNames: ["Plane"],
    glbTransmissionMaterialNames: ["Material.002", "Material.003"],
  },
  {
    id: "water-glass-obj",
    title: "Szklanka z wodą (OBJ)",
    filename: "uploads_files_830301_water+glass.obj",
    kind: "obj",
    objBottleUrl: "/uploads_files_830301_water%2Bglass.obj",
    objTransmissionMaterialNames: ["Glass Dense White", "Liquid Water Ripples"],
  },
  {
    id: "bottle-set-blend-source",
    title: "Zestaw butelek - plik źródłowy (.blend)",
    filename: "uploads_files_3478382_Bottle-set.blend",
    kind: "blend",
  },
  {
    id: "glass-blend",
    title: "Szkło (Blender)",
    filename: "uploads_files_617402_glass.blend",
    kind: "blend",
  },
  {
    id: "glass-maya",
    title: "Szkło (Maya)",
    filename: "uploads_files_830301_glass4.mb",
    kind: "maya",
  },
  {
    id: "water-glass-mtl",
    title: "Materiały woda + szkło",
    filename: "uploads_files_830301_water+glass.mtl",
    kind: "mtl",
  },
  {
    id: "filter-max",
    title: "Filtr (3ds Max - źródło)",
    filename: "Reverse Osmos Water Filter.max",
    kind: "max",
  },
];

/** Widoczna butelka z pliku OBJ (GLB w tablicy, wyłączony). */
const VISIBLE_SECTION_IDS = new Set<string>(["water-glass-obj"]);

export default function HomeScene() {
  const sections = MODEL_SECTIONS.filter((c) => VISIBLE_SECTION_IDS.has(c.id));

  return (
    <div className="min-h-svh bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-zinc-800/90 bg-zinc-950/90 px-4 py-4 backdrop-blur-md sm:px-8">
        <h1 className="text-lg font-semibold text-zinc-50">Szklanka z wodą</h1>
        <p className="mt-1 max-w-2xl text-sm text-zinc-500">
          <span className="text-zinc-400">
            Plik:{" "}
            <code className="text-zinc-300">
              uploads_files_830301_water+glass.obj
            </code>
          </span>
          {" - "}
          Materiały: <code className="text-zinc-400">
            Glass Dense White
          </code>, <code className="text-zinc-400">Liquid Water Ripples</code>.
          Obrót: przeciąganie myszy.
        </p>
      </header>

      <main>
        {sections.map((cfg) => (
          <ModelSection key={cfg.id} config={cfg} />
        ))}
      </main>
    </div>
  );
}
