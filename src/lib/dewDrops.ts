import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type DewOptions = {
  count?: number;
  seed?: number;
  /** pomnożnik rozmiaru kropli (1 = domyślny ~1% bboxa) */
  sizeScale?: number;
  /** omiń punkty, gdzie |normal.y| > tej wartości (omija denko/pokrywkę) */
  avoidVerticalAbove?: number;
  /** odrzuć dolny X% wysokości (0 = cała szklanka) */
  bottomCutoff?: number;
};

/**
 * Generuje InstancedMesh półkulistych kropli wody na powierzchni szkła.
 * Próbkuje powierzchnię MeshSurfaceSamplerem - nie zależy od UV, więc krople są zawsze OKRĄGŁE.
 * Rozkład nierównomierny (plamy + skip top/bottom) żeby nie wyglądało regularnie.
 */
export function createDewDropInstances(
  glassMesh: THREE.Mesh,
  opts: DewOptions = {},
): THREE.InstancedMesh | null {
  const geom = glassMesh.geometry as THREE.BufferGeometry;
  if (!geom.attributes.position) return null;

  const count = opts.count ?? 650;
  const sizeScale = opts.sizeScale ?? 1;
  const avoidVertical = opts.avoidVerticalAbove ?? 0.55;
  const bottomCut = opts.bottomCutoff ?? 0.08;
  const rand = mulberry32(opts.seed ?? 2027);

  geom.computeBoundingBox();
  const bbox = geom.boundingBox!;
  const size = new THREE.Vector3().subVectors(bbox.max, bbox.min);
  const avg = (size.x + size.y + size.z) / 3;
  const minR = avg * 0.0035 * sizeScale;
  const maxR = avg * 0.013 * sizeScale;

  const sampler = new MeshSurfaceSampler(glassMesh).build();

  // Półkula (kopułka) skierowana w +Y lokalnym (thetaStart=0 = biegun; thetaLength=π/2 = do równika).
  const hemi = new THREE.SphereGeometry(
    1,
    14,
    10,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2,
  );

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(1, 1, 1),
    roughness: 0.015,
    metalness: 0,
    transmission: 1,
    ior: 1.33,
    thickness: 0.05,
    clearcoat: 1,
    clearcoatRoughness: 0,
    envMapIntensity: 2.0,
    reflectivity: 0.55,
    transparent: false,
    attenuationColor: new THREE.Color(0.95, 0.99, 1.0),
    attenuationDistance: 4,
  });

  const inst = new THREE.InstancedMesh(hemi, material, count);
  inst.frustumCulled = false;
  inst.castShadow = false;
  inst.receiveShadow = false;
  inst.name = "DewDrops";

  const pos = new THREE.Vector3();
  const normal = new THREE.Vector3();
  const mat4 = new THREE.Matrix4();
  const quat = new THREE.Quaternion();
  const scl = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  // Plamy: 6×4 hashowana siatka po (kąt, wysokość) - część regionów całkiem bez kropli.
  const patchGrid = Array.from({ length: 6 * 4 }, () => rand());
  const patchAt = (u: number, v: number) => {
    const ui = ((Math.floor(u) % 6) + 6) % 6;
    const vi = Math.max(0, Math.min(3, Math.floor(v)));
    return patchGrid[vi * 6 + ui];
  };

  let placed = 0;
  let attempts = 0;
  const maxAttempts = count * 40;

  while (placed < count && attempts < maxAttempts) {
    attempts++;
    sampler.sample(pos, normal);

    if (Math.abs(normal.y) > avoidVertical) continue;
    if (pos.y < bbox.min.y + size.y * bottomCut) continue;

    const angle = Math.atan2(pos.z, pos.x);
    const u = (angle / (2 * Math.PI) + 0.5) * 6;
    const v = ((pos.y - bbox.min.y) / Math.max(size.y, 1e-5)) * 4;
    if (patchAt(u, v) < 0.42) continue;

    // Bimodalny rozkład - dużo drobnych, rzadziej większych.
    const roll = rand();
    let r: number;
    if (roll < 0.72) r = minR + rand() * (maxR - minR) * 0.35;
    else if (roll < 0.95) r = minR + rand() * (maxR - minR) * 0.7;
    else r = minR + rand() * (maxR - minR);

    // Lekko spłaszczone (sessile drop) - y mniej niż xz.
    const flatten = 0.55 + rand() * 0.25;
    scl.set(r, r * flatten, r);

    quat.setFromUnitVectors(up, normal);
    // Lekko zagłębić w powierzchni (żeby podstawa nie odstawała od szkła)
    pos.addScaledVector(normal, -r * flatten * 0.05);

    mat4.compose(pos, quat, scl);
    inst.setMatrixAt(placed, mat4);
    placed++;
  }

  if (placed === 0) return null;
  inst.count = placed;
  inst.instanceMatrix.needsUpdate = true;
  return inst;
}
