import * as THREE from "three";

export function removeNodesByName(root: THREE.Object3D, names: string[]) {
  const set = new Set(names);
  const victims: THREE.Object3D[] = [];
  root.traverse((o) => {
    if (o.name && set.has(o.name)) victims.push(o);
  });
  for (const o of victims) {
    o.parent?.remove(o);
    o.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.geometry?.dispose();
        const m = child.material;
        if (Array.isArray(m)) m.forEach((x) => x.dispose());
        else m?.dispose();
      }
    });
  }
}
