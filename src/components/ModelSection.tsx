"use client";

import FbxCanvas from "@/components/FbxCanvas";
import GlbCanvas from "@/components/GlbCanvas";
import ObjSceneCanvas from "@/components/ObjSceneCanvas";

export type SectionKind =
  | "fbx"
  | "glb"
  | "obj"
  | "blend"
  | "maya"
  | "max"
  | "mtl";

export type ModelSectionConfig = {
  id: string;
  title: string;
  filename: string;
  kind: SectionKind;
  /** dla kind === "fbx" | "glb" */
  modelUrl?: string;
  /** nazwy obiektów z GLB do pominięcia (np. płaszczyzna tła) */
  glbRemoveObjectNames?: string[];
  /** nazwy materiałów GLB z efektem szkła (transmission), pozostałe bez zmian */
  glbTransmissionMaterialNames?: string[];
  /** kind === "obj": ścieżka do butelki (.obj w public) */
  objBottleUrl?: string;
  /** kind === "obj": opcjonalnie osobny plik nakrętki */
  objCapUrl?: string;
  /** kind === "obj": opcjonalne tło (obraz w public), za modelem */
  objBackdropUrl?: string;
  /** kind === "obj": usuń obiekty po nazwie (np. Plane) */
  objRemoveObjectNames?: string[];
  /** kind === "obj": materiały z MTL jak w GLB (Material.002 / .003) */
  objTransmissionMaterialNames?: string[];
};

function UnsupportedPanel({
  title,
  filename,
  kind,
}: {
  title: string;
  filename: string;
  kind: Exclude<SectionKind, "fbx" | "glb" | "obj">;
}) {
  const hints: Record<typeof kind, string> = {
    blend:
      "Format .blend nie jest obsługiwany w przeglądarce. W Blenderze: File → Export → glTF 2.0 (.glb), następnie dodaj plik do folderu public.",
    maya: "Pliki .mb (Maya) nie ładują się w sieci. Wyeksportuj do FBX lub GLB i umieść w public.",
    max: "Pliki .max (3ds Max) nie są obsługiwane w przeglądarce. Wyeksportuj do FBX lub GLB.",
    mtl: "Plik .mtl to tylko materiał - potrzebny jest powiązany model .obj (lub użyj GLB z teksturami).",
  };

  return (
    <div className="flex min-h-[clamp(280px,min(50svh,520px),520px)] w-full items-center justify-center rounded-xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-10 text-center">
      <div className="max-w-lg space-y-3">
        <h3 className="text-base font-medium text-zinc-200">{title}</h3>
        <p className="font-mono text-sm text-zinc-500">{filename}</p>
        <p className="text-sm leading-relaxed text-amber-100/85">
          {hints[kind]}
        </p>
      </div>
    </div>
  );
}

export default function ModelSection({
  config,
}: {
  config: ModelSectionConfig;
}) {
  const {
    title,
    filename,
    kind,
    modelUrl,
    glbRemoveObjectNames,
    glbTransmissionMaterialNames,
    objBottleUrl,
    objCapUrl,
    objBackdropUrl,
    objRemoveObjectNames,
    objTransmissionMaterialNames,
  } = config;

  return (
    <section
      id={config.id}
      className="scroll-mt-4 border-b border-zinc-800/80 px-4 py-12 last:border-b-0 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            {title}
          </h2>
          <p className="mt-1 font-mono text-xs text-zinc-500">{filename}</p>
        </div>

        {kind === "fbx" && modelUrl ? (
          <FbxCanvas modelUrl={modelUrl} />
        ) : kind === "glb" && modelUrl ? (
          <GlbCanvas
            modelUrl={modelUrl}
            removeObjectNames={glbRemoveObjectNames}
            transmissionMaterialNames={glbTransmissionMaterialNames}
          />
        ) : kind === "obj" && objBottleUrl ? (
          <ObjSceneCanvas
            bottleObjUrl={objBottleUrl}
            capObjUrl={objCapUrl}
            backdropUrl={objBackdropUrl}
            removeObjectNames={objRemoveObjectNames}
            transmissionMaterialNames={objTransmissionMaterialNames}
          />
        ) : kind !== "fbx" && kind !== "glb" && kind !== "obj" ? (
          <UnsupportedPanel title={title} filename={filename} kind={kind} />
        ) : null}
      </div>
    </section>
  );
}
