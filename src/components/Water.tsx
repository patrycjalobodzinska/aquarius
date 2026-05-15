"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo } from "react";
import {
  Color,
  MeshPhysicalMaterial,
  ShaderLib,
  UniformsUtils,
  Vector2,
} from "three";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore brak typów
import { GPUComputationRenderer } from "three-stdlib";
import CustomShaderMaterialImpl from "three-custom-shader-material/vanilla";
import { heightmapFragmentShader, waterVertexShader } from "./WaterShaders";

// Rozdzielczość siatki symulacji + rozmiar „świata" fal.
const WIDTH = 256;
const BOUNDS = 512;

type WaterProps = {
  position?: [number, number, number];
  scale?: number;
  color?: string;
};

export default function Water({
  position = [0, -1.2, 0],
  scale = 0.03,
  color = "#217d9c",
}: WaterProps) {
  const gl = useThree((s) => s.gl);
  const pointer = useThree((s) => s.pointer);

  // Init materiału + GPU compute raz - useMemo gwarantuje stabilność.
  const { material, compute, heightmapVariable, waterUniforms } =
    useMemo(() => {
      const mat = new CustomShaderMaterialImpl({
        baseMaterial: MeshPhysicalMaterial,
        vertexShader: waterVertexShader,
        uniforms: UniformsUtils.merge([
          ShaderLib.physical.uniforms,
          { heightmap: { value: null } },
        ]),
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const m = mat as any;
      m.transmission = 1;
      m.metalness = 0;
      m.roughness = 0;
      m.color = new Color(color);
      m.defines = { ...(m.defines ?? {}) };
      m.defines.WIDTH = WIDTH.toFixed(1);
      m.defines.BOUNDS = BOUNDS.toFixed(1);

      const gpu = new GPUComputationRenderer(WIDTH, WIDTH, gl);
      const heightmap0 = gpu.createTexture();
      const hv = gpu.addVariable(
        "heightmap",
        heightmapFragmentShader,
        heightmap0,
      );
      gpu.setVariableDependencies(hv, [hv]);
      hv.material.uniforms.mousePos = { value: new Vector2(10000, 10000) };
      hv.material.uniforms.mouseSize = { value: 20 };
      hv.material.uniforms.viscosityConstant = { value: 0.98 };
      hv.material.uniforms.heightCompensation = { value: 0 };
      hv.material.defines.BOUNDS = BOUNDS.toFixed(1);

      const err = gpu.init();
      if (err !== null) console.error(err);

      return {
        material: mat,
        compute: gpu,
        heightmapVariable: hv,
        waterUniforms: m.uniforms,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gl]);

  useFrame(() => {
    const u = heightmapVariable.material.uniforms;
    // pointer.x/y w NDC -1..1 → mapa na układ symulacji.
    u.mousePos.value.set(pointer.x * 200, -pointer.y * 200);
    compute.compute();
    waterUniforms.heightmap.value =
      compute.getCurrentRenderTarget(heightmapVariable).texture;
  });

  return (
    <mesh
      material={material}
      rotation={[-Math.PI / 2, 0, 0]}
      position={position}
      scale={scale}>
      <planeGeometry args={[BOUNDS, BOUNDS, WIDTH, WIDTH]} />
    </mesh>
  );
}
