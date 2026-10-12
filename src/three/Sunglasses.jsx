import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { buildSunglassesGeometry } from './sunglassesGeometry'

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const hardwareMaterial = new THREE.MeshStandardMaterial({ color: '#d9d9de', metalness: 1, roughness: 0.25 })

/**
 * A pair of sunglasses split into individually animatable parts.
 *
 * `anim` (optional ref) drives the motion:
 *   anim.current.intro   0 = parts scattered, 1 = fully assembled (temples unfold last)
 *   anim.current.explode 0 = assembled, 1 = exploded "anatomy" view
 * Without `anim` the pair simply renders assembled.
 */
export default function Sunglasses({ style = 'wayfarer', frameMaterial, lensMaterial, anim, showLabels = false }) {
  const geo = useMemo(() => buildSunglassesGeometry(style), [style])
  const partRefs = useRef({})
  const foldRefs = useRef({})
  const labelRefs = useRef([])

  const parts = useMemo(() => {
    const list = []
    for (const side of [-1, 1]) {
      const s = side
      list.push(
        { key: `rim${s}`, geometry: geo.rim, material: frameMaterial, side: s, pos: [s * geo.lensX, 0, 0], dir: [s * 0.8, 0.1, 0.5], rot: [0.3, s * -0.7, s * 0.25], delay: 0.05 },
        { key: `lens${s}`, geometry: geo.lens, material: lensMaterial, side: s, pos: [s * geo.lensX, 0, 0.005], dir: [s * 0.5, 0.35, 1.6], rot: [-0.4, s * 0.9, 0], delay: 0.3 },
        { key: `screw${s}`, geometry: geo.screw, material: hardwareMaterial, side: s, pos: [s * geo.hingeX, geo.hingeY, -0.03], dir: [s * 0.9, 1.3, 0.4], rot: [0.8, 0, s * 0.6], delay: 0.55 },
        { key: `temple${s}`, side: s, temple: true, pos: [s * geo.hingeX, geo.hingeY, -0.03], dir: [s * 1.4, -0.25, -0.5], rot: [0.2, 0, s * -0.3], delay: 0.4 }
      )
    }
    list.push({ key: 'bridge', geometry: geo.bridge, material: frameMaterial, side: 1, pos: [0, 0, 0], dir: [0, 1, 0.6], rot: [0.6, 0, 0], delay: 0.2 })
    if (geo.browBar) {
      list.push({ key: 'brow', geometry: geo.browBar, material: frameMaterial, side: 1, pos: [0, 0, 0.01], dir: [0, 1.5, 0.2], rot: [-0.5, 0, 0], delay: 0.25 })
    }
    return list
  }, [geo, frameMaterial, lensMaterial])

  useFrame(() => {
    const a = anim?.current
    const intro = a ? a.intro : 1
    const explode = a ? a.explode : 0
    const unfold = easeOut(clamp01((intro - 0.78) / 0.22))

    for (const part of parts) {
      const obj = partRefs.current[part.key]
      if (!obj) continue
      const assembled = easeOut(clamp01(intro * 1.6 - part.delay))
      const e = (1 - assembled) * 2.4 + explode
      obj.position.set(part.pos[0] + part.dir[0] * e, part.pos[1] + part.dir[1] * e, part.pos[2] + part.dir[2] * e)
      obj.rotation.set(part.rot[0] * e, part.rot[1] * e, part.rot[2] * e)

      if (part.temple) {
        // Temples swing open once everything else has clicked into place
        const fold = (1 - unfold) * 1.45 + explode * 0.5
        foldRefs.current[part.key].rotation.y = part.side * fold
      }
    }

    const labelOpacity = smoothstep(0.45, 0.9, explode)
    for (const el of labelRefs.current) {
      if (el) el.style.opacity = labelOpacity
    }
  })

  const label = (text, position, i) =>
    showLabels && (
      <Html position={position} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={(el) => (labelRefs.current[i] = el)} className="anatomy-label" style={{ opacity: 0 }}>
          <span className="anatomy-dot" />
          <span className="anatomy-text">{text}</span>
        </div>
      </Html>
    )

  return (
    <group>
      {parts.map((part) => (
        <group key={part.key} ref={(o) => (partRefs.current[part.key] = o)}>
          {/* Mirror left-side parts; three.js flips face winding for negative scale */}
          <group scale={[part.side < 0 && !part.temple && !part.key.startsWith('screw') ? -1 : 1, 1, 1]}>
            {part.temple ? (
              <group ref={(o) => (foldRefs.current[part.key] = o)}>
                <mesh geometry={geo.temple} material={frameMaterial} castShadow scale={style === 'wayfarer' ? [0.8, 1.6, 1] : 1} />
                <mesh geometry={geo.hinge} material={hardwareMaterial} position={[part.side * -0.03, 0, 0.02]} />
                {part.side > 0 && label('Flex temple arm', [0.05, 0.05, -0.9], 0)}
              </group>
            ) : (
              <mesh geometry={part.geometry} material={part.material} castShadow />
            )}
            {part.key === 'lens1' && label('Polarized UV400 lens', [0.15, -0.1, 0.05], 1)}
            {part.key === 'rim-1' && label('Hand-cut bio-acetate rim', [0.2, 0.45, 0], 2)}
            {part.key === 'bridge' && label('Keyhole bridge', [0, 0.3, 0], 3)}
            {part.key === 'screw1' && label('5-barrel Japanese hinge', [0.04, 0.1, 0], 4)}
          </group>
        </group>
      ))}
    </group>
  )
}
