import * as THREE from "three";
import { createDewDropInstances } from "./dewDrops";

const GLASS_NAMES = new Set(["Material.002", "Glass Dense White"]);
const WATER_NAMES = new Set(["Liquid Water Ripples"]);

export function buildGlassMaterial(
  prev: THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial,
  materialName: string,
): THREE.MeshPhysicalMaterial {
  const base = {
    map: prev.map ?? null,
    normalMap: prev.normalMap ?? null,
    transparent: false,
    opacity: 1,
    side: THREE.DoubleSide,
    specularIntensity: 1.4,
    specularColor: new THREE.Color(1, 1, 1),
    envMapIntensity: 2.4,
  };

  if (GLASS_NAMES.has(materialName)) {
    return new THREE.MeshPhysicalMaterial({
      ...base,
      color: new THREE.Color(1, 1, 1),
      roughness: 0.02,
      metalness: 0,
      transmission: 1,
      thickness: 0.22,
      ior: 1.52,
      clearcoat: 1,
      clearcoatRoughness: 0,
      attenuationColor: new THREE.Color(0.94, 0.98, 1.0),
      attenuationDistance: 8,
      reflectivity: 0.6,
    });
  }

  if (WATER_NAMES.has(materialName)) {
    // Woda jest „opaque" (transmission-thru-transmission w three nie działa - woda
    // znika z bufora tła szkła). Zamiast tego: delikatny błękit + niski envMap
    // + clearcoat, żeby nie wyglądała na białe mleko.
    return new THREE.MeshPhysicalMaterial({
      map: prev.map ?? null,
      normalMap: prev.normalMap ?? null,
      side: THREE.DoubleSide,
      transparent: false,
      opacity: 1,
      color: new THREE.Color(0.62, 0.8, 0.95),
      roughness: 0.06,
      metalness: 0,
      ior: 1.333,
      clearcoat: 0.6,
      clearcoatRoughness: 0.02,
      envMapIntensity: 0.65,
      specularIntensity: 0.9,
      specularColor: new THREE.Color(0.85, 0.92, 1.0),
    });
  }

  if (materialName === "Material.003") {
    const c = prev.color?.clone() ?? new THREE.Color(0.5, 0.5, 0.5);
    return new THREE.MeshPhysicalMaterial({
      ...base,
      color: c,
      roughness: 0.22,
      metalness: 0.82,
      transmission: 0,
      clearcoat: 0.6,
      clearcoatRoughness: 0.18,
    });
  }

  return new THREE.MeshPhysicalMaterial({
    ...base,
    color: prev.color?.clone() ?? new THREE.Color(1, 1, 1),
    roughness: 0.01,
    metalness: 0,
    transmission: 1,
    thickness: 0.15,
    ior: 1.52,
    clearcoat: 1,
    clearcoatRoughness: 0,
    attenuationColor: new THREE.Color(0.96, 0.99, 1.0),
    attenuationDistance: 10,
    reflectivity: 0.6,
  });
}

function attachDewToGlassMesh(mesh: THREE.Mesh) {
  if (mesh.getObjectByName("DewDrops")) return;
  const drops = createDewDropInstances(mesh);
  if (drops) mesh.add(drops);
}

export function applyGlassTransmission(
  root: THREE.Object3D,
  materialNames: string[],
) {
  if (!materialNames.length) return;
  const pick = new Set(materialNames);

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    let matchedGlass = false;
    const swap = (mat: THREE.Material) => {
      if (!pick.has(mat.name)) return mat;
      const prev = mat as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial;
      const next = buildGlassMaterial(prev, mat.name);
      if (GLASS_NAMES.has(mat.name)) matchedGlass = true;
      prev.dispose();
      return next;
    };

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map(swap);
    } else {
      obj.material = swap(obj.material);
    }

    if (matchedGlass) attachDewToGlassMesh(obj);
  });
}

export function applyGlassPresetToObject(
  root: THREE.Object3D,
  role: "body" | "cap",
) {
  const pseudoName = role === "body" ? "Material.002" : "Material.003";

  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;

    const swap = (mat: THREE.Material) => {
      const prev = mat as
        | THREE.MeshStandardMaterial
        | THREE.MeshPhysicalMaterial;
      const next = buildGlassMaterial(prev, pseudoName);
      prev.dispose();
      return next;
    };

    if (Array.isArray(obj.material)) {
      obj.material = obj.material.map(swap);
    } else {
      obj.material = swap(obj.material);
    }

    if (role === "body") attachDewToGlassMesh(obj);
  });
}
