import React, { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'
import { buildSunglasses } from './sunglassesGeometry'

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

const hardwareMaterial = new THREE.MeshStandardMaterial({ color: '#e4e4e8', metalness: 1, roughness: 0.18 })

/**
 * A pair of sunglasses split into individually animatable parts.
 *
 * `anim` (optional ref) drives the motion:
 *   anim.current.intro   0 = parts scattered, 1 = fully assembled (temples unfold last)
 *   anim.current.explode 0 = assembled, 1 = exploded "anatomy" view
 * Without `anim` the pair simply renders assembled.
 */
export default function Sunglasses({ style = 'classic', frameMaterial, lensMaterial, anim, showLabels = false }) {
  const { parts } = useMemo(() => buildSunglasses(style), [style])
  const partRefs = useRef({})
  const foldRefs = useRef({})
  const labelRefs = useRef([])
  const materials = { frame: frameMaterial, lens: lensMaterial, metal: hardwareMaterial }

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
        foldRefs.current[part.key].rotation.y = part.temple * ((1 - unfold) * 1.45 + explode * 0.5)
      }
    }

    const labelOpacity = smoothstep(0.45, 0.9, explode)
    for (const el of labelRefs.current) {
      if (el) el.style.opacity = labelOpacity
    }
  })

  let labelIndex = 0
  const renderLabels = (labels = []) =>
    showLabels &&
    labels.map(({ text, pos }) => {
      const i = labelIndex++
      return (
        <Html key={text} position={pos} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
          <div ref={(el) => (labelRefs.current[i] = el)} className="anatomy-label" style={{ opacity: 0 }}>
            <span className="anatomy-dot" />
            <span className="anatomy-text">{text}</span>
          </div>
        </Html>
      )
    })

  return (
    <group>
      {parts.map((part) => {
        const meshes = part.meshes.map((m, i) => (
          <mesh key={i} geometry={m.geometry} material={materials[m.mat]} position={m.position} rotation={m.rotation} scale={m.scale} castShadow />
        ))
        return (
          <group key={part.key} ref={(o) => (partRefs.current[part.key] = o)}>
            {/* Mirrored left-side parts; three.js flips face winding for negative scale */}
            <group scale={[part.mirror ? -1 : 1, 1, 1]}>
              {part.temple ? (
                <group ref={(o) => (foldRefs.current[part.key] = o)}>
                  {meshes}
                  {renderLabels(part.labels)}
                </group>
              ) : (
                <>
                  {meshes}
                  {renderLabels(part.labels)}
                </>
              )}
            </group>
          </group>
        )
      })}
    </group>
  )
}
