import * as THREE from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

/**
 * Procedural sunglasses. Lets the 3D demo run with zero model assets;
 * swap for a real .glb later (see ASSETS.md) and keep the same part names.
 *
 * buildSunglasses(style) returns { parts }, where each part is one piece that
 * flies in / explodes on its own:
 *   { key, meshes: [{ geometry, mat: 'frame'|'lens'|'metal', position?, rotation?, scale? }],
 *     pos, dir, rot, delay, mirror?, temple?: side, labels?: [{ text, pos }] }
 *
 * Styles: 'hero' (glossy classic, gold rivets), 'urban' (trendy rectangle,
 * matches public/hero-sunglasses.png), 'classic' (Wayfarer-type), 'bold', 'aviator', 'round'.
 */

const sgnPow = (v, p) => Math.sign(v) * Math.pow(Math.abs(v), p)

// Smooth shading: weld duplicate vertices so normals average across faces
function smooth(geometry) {
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')
  const merged = mergeVertices(geometry, 1e-4)
  merged.computeVertexNormals()
  geometry.dispose()
  return merged
}

function bend(geometry, fn) {
  const p = geometry.attributes.position
  for (let i = 0; i < p.count; i++) p.setZ(i, p.getZ(i) + fn(p.getX(i), p.getY(i)))
  p.needsUpdate = true
  return geometry
}

/* ================================================================== */
/*  ACETATE — one-piece front, keyhole bridge, face-form wrap          */
/*  'hero'    : glossy classic, flared brow corners, gold rivets        */
/*  'urban'   : trendy rectangle from public/hero-sunglasses.png       */
/*  'classic' : Wayfarer-type with a heavy brow                        */
/* ================================================================== */
const ACETATE = {
  hero: {
    cx: 0.66, a: 0.52, b: 0.39, n: 3.2, // lens centre, half width/height, squareness
    chinTaper: 0.18, chinTaperInner: 0.08, browRise: 0.06,
    rimSide: 0.075, rimBrow: 0.12, wing: 0.12, depth: 0.055, bevel: 0.026, wrap: 0.035,
    bridgeTop: 0.3, bridgeBottom: 0.505, noseArch: 0.22, templeH: 0.095, // low wrap, straight saddle bridge
    trim: 'rivet', trimMat: 'gold', trimY: 0.28, gradient: [0.6, 1], lensLabel: 'Polarized smoke lens',
  },
  urban: {
    cx: 0.72, a: 0.52, b: 0.39, n: 3.8,
    chinTaper: 0.14, chinTaperInner: 0.06, browRise: 0.03,
    rimSide: 0.055, rimBrow: 0.1, wing: 0.09, depth: 0.05, bevel: 0.024, wrap: 0.04,
    bridgeTop: 0.3, bridgeBottom: 0.53, noseArch: 0.3, templeH: 0.105,
    trim: 'bar', trimMat: 'metal', gradient: [0.28, 1], lensLabel: 'Gradient polarized lens',
  },
  classic: {
    cx: 0.7, a: 0.5, b: 0.35, n: 3.4,
    chinTaper: 0.26, chinTaperInner: 0.09, browRise: 0.07,
    rimSide: 0.065, rimBrow: 0.155, wing: 0, depth: 0.05, bevel: 0.026, wrap: 0.07,
    bridgeTop: 0.31, bridgeBottom: 0.545, noseArch: 0.34, templeH: 0.085,
    trim: 'rivet', trimMat: 'metal', trimY: 0.36, gradient: [0.6, 1], lensLabel: 'Polarized G-15 lens',
  },
}
const SEG = 160

// Lens gradient as vertex colours (multiplied with the lens material colour): dark top → light bottom
function addGradient(geometry, [top, bottom], yMin, yMax) {
  const p = geometry.attributes.position
  const colors = new Float32Array(p.count * 3)
  for (let i = 0; i < p.count; i++) {
    const t = Math.min(Math.max((p.getY(i) - yMin) / (yMax - yMin), 0), 1)
    const v = bottom + (top - bottom) * t * t * (3 - 2 * t)
    colors.set([v, v, v], i * 3)
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  return geometry
}

function buildAcetate(cfg) {
  const frontZ = (x) => -cfg.wrap * x * x

  // Right lens outline in local space (outer/temple side = +x), index i ↔ angle 2πi/SEG
  const inner = []
  for (let i = 0; i < SEG; i++) {
    const t = (i / SEG) * Math.PI * 2
    const cx = sgnPow(Math.cos(t), 2 / cfg.n)
    const cy = sgnPow(Math.sin(t), 2 / cfg.n)
    let x = cfg.a * cx
    let y = cfg.b * cy
    if (cy < 0) x *= 1 - -cy * (cx > 0 ? cfg.chinTaper : cfg.chinTaperInner) // chin tapers, mostly on the outer side
    if (cy > 0) y += cfg.browRise * ((cx + 1) / 2) * cy // top edge rises toward the temple
    inner.push(new THREE.Vector2(x, y))
  }
  const rim = (p) => {
    const up = Math.max(p.y / cfg.b, 0)
    // wing: extra width at the upper-outer corner where the hinge and trim sit
    const wing = cfg.wing * Math.pow(Math.max(p.x / cfg.a, 0), 2) * Math.min(Math.max(p.y / cfg.b + 0.3, 0), 1)
    const amount = cfg.rimSide + (cfg.rimBrow - cfg.rimSide) * Math.pow(up, 1.4) + wing
    const len = p.length()
    return p.clone().multiplyScalar((len + amount) / len)
  }
  const outer = inner.map(rim)
  const toGlobal = (p) => new THREE.Vector2(p.x + cfg.cx, p.y)

  // Right outer arc runs clockwise from the upper-inner corner, round the temple side,
  // to the lower-inner corner; the bridge replaces the skipped inner stretch.
  const i1 = Math.round(SEG * cfg.bridgeTop)
  const i2 = Math.round(SEG * cfg.bridgeBottom)
  const arc = []
  for (let i = i1; i >= 0; i--) arc.push(toGlobal(outer[i]))
  for (let i = SEG - 1; i >= i2; i--) arc.push(toGlobal(outer[i]))
  const left = arc.map((p) => new THREE.Vector2(-p.x, p.y)).reverse()

  const shape = new THREE.Shape()
  shape.moveTo(arc[0].x, arc[0].y)
  arc.slice(1).forEach((p) => shape.lineTo(p.x, p.y))
  shape.quadraticCurveTo(0, cfg.noseArch, left[0].x, left[0].y) // keyhole nose arch
  left.slice(1).forEach((p) => shape.lineTo(p.x, p.y))
  shape.quadraticCurveTo(0, arc[0].y + 0.01, arc[0].x, arc[0].y) // brow runs straight across the bridge

  const holeR = inner.map(toGlobal)
  const holeL = holeR.map((p) => new THREE.Vector2(-p.x, p.y)).reverse()
  shape.holes.push(new THREE.Path(holeR), new THREE.Path(holeL))

  let front = new THREE.ExtrudeGeometry(shape, {
    depth: cfg.depth,
    bevelEnabled: true,
    bevelThickness: cfg.bevel,
    bevelSize: cfg.bevel * 0.85,
    bevelSegments: 5,
    curveSegments: 12,
  })
  front.translate(0, 0, -cfg.depth / 2)
  front = smooth(bend(front, frontZ))

  // Lenses: sit in the rim groove, base-curved and following the wrap
  const lensGeo = (side) => {
    const pts = inner.map((p) => {
      const g = toGlobal(rim(p).lerp(p, 0.75)) // tuck ~25% of the rim width into the groove
      return new THREE.Vector2(side * g.x, g.y)
    })
    let g = new THREE.ExtrudeGeometry(new THREE.Shape(side < 0 ? pts.reverse() : pts), {
      depth: 0.012,
      bevelEnabled: true,
      bevelThickness: 0.006,
      bevelSize: 0.006,
      bevelSegments: 2,
      curveSegments: 1,
    })
    g.translate(0, 0, -0.006)
    g = bend(g, (x, y) => {
      const dx = (x - side * cfg.cx) / 0.6
      const dy = y / 0.45
      return frontZ(x) + 0.008 + 0.045 * Math.max(0, 1 - dx * dx - dy * dy)
    })
    return addGradient(smooth(g), cfg.gradient, -cfg.b, cfg.b)
  }

  // Hinge sits behind the widest point of the brow
  const hingeY = 0.2
  const hingeX = Math.max(...arc.filter((p) => p.y > 0.05 && p.y < 0.35).map((p) => p.x)) - 0.07
  const hingeZ = frontZ(hingeX) - cfg.depth / 2 - 0.05

  // Flat acetate temple: side profile (x = length back, y = height), extruded to thickness
  const h = cfg.templeH
  const profile = new THREE.Shape()
  profile.moveTo(0, h)
  profile.lineTo(0.25, h)
  profile.quadraticCurveTo(0.9, h * 0.82, 1.6, h * 0.47)
  profile.quadraticCurveTo(1.95, h * 0.35, 2.2, -0.3) // bends down over the ear
  profile.quadraticCurveTo(2.21, -0.38, 2.13, -0.37) // rounded tip
  profile.quadraticCurveTo(1.88, -h * 0.47, 1.6, -h * 0.4)
  profile.quadraticCurveTo(0.9, -h * 0.45, 0.25, -h * 0.94)
  profile.lineTo(0, -h * 0.94)
  profile.closePath()
  let temple = new THREE.ExtrudeGeometry(profile, {
    depth: 0.045,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.012,
    bevelSegments: 3,
    curveSegments: 16,
  })
  temple.translate(0, 0, -0.0225)
  temple.rotateY(Math.PI / 2) // length now runs along -z
  temple = smooth(temple)

  const endPiece = new RoundedBoxGeometry(0.12, h * 2.2, 0.16, 3, 0.04)
  const screw = new THREE.CylinderGeometry(0.014, 0.014, 0.22, 12)
  const surfaceZ = (x) => frontZ(x) + cfg.depth / 2 + cfg.bevel

  // Front trim: long silver bar (hero) or round rivet (classic), following the wrap
  const isBar = cfg.trim === 'bar'
  const trimX = isBar ? hingeX + 0.005 : hingeX - 0.06
  const trimY = isBar ? hingeY - 0.01 : cfg.trimY
  const trimGeo = isBar
    ? new RoundedBoxGeometry(0.12, 0.024, 0.02, 2, 0.008)
    : new THREE.CylinderGeometry(0.024, 0.024, 0.02, 24)
  const trimRotation = (s) => (isBar ? [0, Math.atan(2 * cfg.wrap * s * trimX), 0] : [Math.PI / 2, 0, 0])

  const parts = [
    {
      key: 'front',
      meshes: [
        { geometry: front, mat: 'frame' },
        { geometry: endPiece, mat: 'frame', position: [hingeX, hingeY, hingeZ + 0.04] },
        { geometry: endPiece, mat: 'frame', position: [-hingeX, hingeY, hingeZ + 0.04] },
      ],
      pos: [0, 0, 0], dir: [0, 0.15, 0.3], rot: [0.3, 0, 0], delay: 0,
      labels: [
        { text: 'Keyhole bridge', pos: [0, 0.42, 0.08] },
        { text: 'Hand-polished acetate', pos: [-1.25, 0.5, -0.1] },
      ],
    },
  ]

  for (const s of [-1, 1]) {
    const templeMeshes = [{ geometry: temple, mat: 'frame' }]
    if (!isBar) {
      templeMeshes.push({ geometry: trimGeo, mat: cfg.trimMat, position: [s * 0.04, 0.01, -0.2], rotation: [0, 0, Math.PI / 2] })
    }
    parts.push(
      {
        key: `lens${s}`, meshes: [{ geometry: lensGeo(s), mat: 'lens' }],
        pos: [0, 0, 0], dir: [s * 0.55, 0.3, 1.6], rot: [-0.4, s * 0.8, 0], delay: 0.3,
        labels: s > 0 ? [{ text: cfg.lensLabel, pos: [cfg.cx + 0.1, -0.1, 0.1] }] : [],
      },
      {
        key: `trim${s}`, meshes: [{ geometry: trimGeo, mat: cfg.trimMat, rotation: trimRotation(s) }],
        pos: [s * trimX, trimY, surfaceZ(trimX) + 0.004], dir: [s * 0.5, 1, 1], rot: [1, 0, 0], delay: 0.6,
      },
      {
        key: `screw${s}`, meshes: [{ geometry: screw, mat: 'metal' }],
        pos: [s * hingeX, hingeY, hingeZ], dir: [s * 0.9, 1.3, 0.2], rot: [0.8, 0, s * 0.6], delay: 0.55,
        labels: s > 0 ? [{ text: '5-barrel steel hinge', pos: [0.05, 0.13, 0] }] : [],
      },
      {
        key: `temple${s}`, temple: s, meshes: templeMeshes,
        pos: [s * hingeX, hingeY, hingeZ], dir: [s * 1.3, -0.2, -0.3], rot: [0.15, 0, s * -0.25], delay: 0.4,
        labels: s > 0 ? [{ text: 'Flex temple arm', pos: [0.06, 0.06, -1.2] }] : [],
      }
    )
  }
  return { parts }
}

/* ================================================================== */
/*  BOLD / AVIATOR / ROUND — separate rims + tube bridge               */
/* ================================================================== */
const STYLES = {
  bold: { a: 0.5, b: 0.38, n: 3.2, cx: 0.67, rim: 0.075, depth: 0.08, bridgeY: 0.2, templeY: 0.24, tube: 0.035, metal: false },
  aviator: { a: 0.5, b: 0.44, n: 2.3, cx: 0.62, rim: 0.04, depth: 0.04, bridgeY: 0.3, templeY: 0.26, tube: 0.018, metal: true },
  round: { a: 0.42, b: 0.42, n: 2, cx: 0.54, rim: 0.045, depth: 0.045, bridgeY: 0.12, templeY: 0.12, tube: 0.018, metal: true },
}

// Right lens outline (outer side = +x), centred on the origin; left side is mirrored
function lensOutline(style, segments = 96) {
  const { a, b, n } = STYLES[style]
  const pts = []
  for (let i = 0; i < segments; i++) {
    const t = (i / segments) * Math.PI * 2
    const cx = sgnPow(Math.cos(t), 2 / n)
    const cy = sgnPow(Math.sin(t), 2 / n)
    let x = a * cx
    let y = b * cy

    if (style === 'bold') {
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

function buildRimmed(style) {
  const s = STYLES[style]
  const inner = lensOutline(style)

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
  addGradient(lens, [0.5, 1], -s.b, s.b)

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
  const hingeX = s.cx + s.a + s.rim * 0.6
  const hingeY = s.templeY

  const parts = []
  for (const side of [-1, 1]) {
    parts.push(
      {
        key: `rim${side}`, mirror: side < 0, meshes: [{ geometry: rim, mat: 'frame' }],
        pos: [side * s.cx, 0, 0], dir: [side * 0.8, 0.1, 0.5], rot: [0.3, side * -0.7, side * 0.25], delay: 0.05,
        labels: side < 0 ? [{ text: 'Hand-cut rim', pos: [0.2, 0.45, 0] }] : [],
      },
      {
        key: `lens${side}`, mirror: side < 0, meshes: [{ geometry: lens, mat: 'lens' }],
        pos: [side * s.cx, 0, 0.005], dir: [side * 0.5, 0.35, 1.6], rot: [-0.4, side * 0.9, 0], delay: 0.3,
        labels: side > 0 ? [{ text: 'Polarized UV400 lens', pos: [0.15, -0.1, 0.05] }] : [],
      },
      {
        key: `screw${side}`, meshes: [{ geometry: screw, mat: 'metal' }],
        pos: [side * hingeX, hingeY, -0.03], dir: [side * 0.9, 1.3, 0.4], rot: [0.8, 0, side * 0.6], delay: 0.55,
        labels: side > 0 ? [{ text: '5-barrel hinge', pos: [0.04, 0.1, 0] }] : [],
      },
      {
        key: `temple${side}`, temple: side,
        meshes: [
          { geometry: temple, mat: 'frame', scale: style === 'bold' ? [0.8, 1.6, 1] : undefined },
          { geometry: hinge, mat: 'metal', position: [side * -0.03, 0, 0.02] },
        ],
        pos: [side * hingeX, hingeY, -0.03], dir: [side * 1.4, -0.25, -0.5], rot: [0.2, 0, side * -0.3], delay: 0.4,
        labels: side > 0 ? [{ text: 'Flex temple arm', pos: [0.05, 0.05, -0.9] }] : [],
      }
    )
  }

  parts.push({
    key: 'bridge', meshes: [{ geometry: bridge, mat: 'frame' }],
    pos: [0, 0, 0], dir: [0, 1, 0.6], rot: [0.6, 0, 0], delay: 0.2,
    labels: [{ text: 'Keyhole bridge', pos: [0, 0.3, 0] }],
  })

  if (style === 'aviator') {
    const browBar = new THREE.TubeGeometry(
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
    parts.push({
      key: 'brow', meshes: [{ geometry: browBar, mat: 'frame' }],
      pos: [0, 0, 0.01], dir: [0, 1.5, 0.2], rot: [-0.5, 0, 0], delay: 0.25,
    })
  }
  return { parts }
}

export function buildSunglasses(style) {
  if (ACETATE[style]) return buildAcetate(ACETATE[style])
  return buildRimmed(STYLES[style] ? style : 'bold')
}
