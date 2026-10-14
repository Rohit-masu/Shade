import * as THREE from 'three'

// Shared materials so frames and lenses read the same in every 3D scene

export function makeFrameMaterial(cfg) {
  return new THREE.MeshPhysicalMaterial({
    color: cfg?.color ?? '#111',
    metalness: cfg?.metalness ?? 0.2,
    roughness: cfg?.roughness ?? 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    envMapIntensity: 1.6,
  })
}

export function makeLensMaterial(cfg) {
  return new THREE.MeshPhysicalMaterial({
    color: cfg?.color ?? '#333',
    metalness: cfg?.metalness ?? 0.7,
    roughness: 0.2, // softens hard softbox reflections on the lens
    transparent: true,
    opacity: cfg?.opacity ?? 0.85,
    clearcoat: 1,
    envMapIntensity: 1.8,
    vertexColors: true, // lens geometry carries a top-dark → bottom-light gradient
  })
}
