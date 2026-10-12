import * as THREE from 'three'

/**
 * Procedural sunglasses geometry. Lets the 3D demo run with zero model assets;
 * swap for a real .glb later (see ASSETS.md) and keep the same part names.
 *
 * All lens outlines are built for the RIGHT lens (outer / temple side = +x),
 * centred on the origin. The left side is mirrored with scale.x = -1.
 */

const STYLES = {
  wayfarer: { a: 0.5, b: 0.38, n: 3.2, cx: 0.67, rim: 0.075, depth: 0.08, bridgeY: 0.2, templeY: 0.24, tube: 0.035, metal: false },
  aviator: { a: 0.5, b: 0.44, n: 2.3, cx: 0.62, rim: 0.04, depth: 0.04, bridgeY: 0.3, templeY: 0.26, tube: 0.018, metal: true },
  round: { a: 0.42, b: 0.42, n: 2, cx: 0.54, rim: 0.045, depth: 0.045, bridgeY: 0.12, templeY: 0.12, tube: 0.018, metal: true },
}

export const getStyle = (style) => STYLES[style] ?? STYLES.wayfarer

const sgnPow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p)

function lensOutline(style, segments = 96) {
  const { a, b, n } = getStyle(style)
  const pts = []
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cx = sgnPow(Math.cos(t), 2 / n)
    const cy = sgnPow(Math.sin(t), 2 / n)
    let x = a * cx
    let y = b * cy

    if (style === 'wayfarer') {
      x *= 1 + 0.1 * cy // wider brow, narrower chin
      y += 0.08 * Math.max(cx, 0) * Math.max(cy, 0) // lifted outer brow corner
      if (cy < 0) y *= 0.92
    } else if (style === 'aviator') {
      const low = Math.max(-cy, 0)
      x = x * (1 - 0.12 * low) - 0.07 * low // teardrop drops toward the nose
      y = cy > 0 ? y * 0.82 : y * 1.12
    }
    pts.push(new THREE.Vector2(x, y))
  }
  return pts
}

// Radial offset is fine here: every outline is star-shaped around the origin.
function offsetOutline(pts, amount, browBoost = 0) {
  return pts.map((p) => {
    const len = p.length() || 1
    const extra = amount * (1 + browBoost * Math.max(p.y, 0) / 0.4)
    return p.clone().multiplyScalar((len + extra) / len)
  })
}

export function buildSunglassesGeometry(style) {
  const s = getStyle(style)
  const inner = lensOutline(style)

  // Rim = outer outline with the lens outline punched out
  const rimShape = new THREE.Shape(offsetOutline(inner, s.rim, s.metal ? 0 : 0.7))
  rimShape.holes.push(new THREE.Path(inner))
  const rim = new THREE.ExtrudeGeometry(rimShape, {
    depth: s.depth,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 1,
  })
  rim.translate(0, 0, -s.depth / 2)

  const lens = new THREE.ExtrudeGeometry(new THREE.Shape(offsetOutline(inner, 0.008)), {
    depth: 0.015,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.008,
    bevelSegments: 2,
    curveSegments: 1,
  })
  lens.translate(0, 0, -0.0075)

  // Bridge spans the inner edges of both lenses with a slight arch
  const innerX = s.cx - s.a + 0.02
  const bridge = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(-innerX, s.bridgeY - 0.04, 0),
      new THREE.Vector3(0, s.bridgeY + 0.05, 0.03),
      new THREE.Vector3(innerX, s.bridgeY - 0.04, 0),
    ]),
    32,
    s.metal ? 0.022 : 0.045,
    10,
    false
  )

  // Aviators get the classic double "brow bar"
  const browBar = s.metal && style === 'aviator'
    ? new THREE.TubeGeometry(
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(-s.cx - 0.2, s.b * 0.82 + 0.02, 0),
          new THREE.Vector3(0, s.b * 0.82 + 0.06, 0.02),
          new THREE.Vector3(s.cx + 0.2, s.b * 0.82 + 0.02, 0),
        ]),
        48,
        0.018,
        8,
        false
      )
    : null

  // Temple arm runs from the hinge (origin) backwards along -z and hooks down over the ear
  const temple = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -0.6),
      new THREE.Vector3(0, -0.02, -1.25),
      new THREE.Vector3(0, -0.12, -1.5),
      new THREE.Vector3(0, -0.3, -1.66),
    ]),
    64,
    s.tube,
    10,
    false
  )

  const hinge = new THREE.BoxGeometry(0.09, s.metal ? 0.07 : 0.12, 0.12)
  const screw = new THREE.CylinderGeometry(0.016, 0.016, 0.16, 12)

  return {
    rim,
    lens,
    bridge,
    browBar,
    temple,
    hinge,
    screw,
    lensX: s.cx,
    hingeX: s.cx + s.a + s.rim * 0.6,
    hingeY: s.templeY,
  }
}
