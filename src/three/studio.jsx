import React from 'react'
import { Environment, Lightformer } from '@react-three/drei'

/**
 * Shared lighting for every 3D scene on the site (hero experience + collection).
 * Materials live in ./materials.js.
 */

// Lightformers are one-sided planes; aim them at the model
const faceOrigin = (self) => self.lookAt(0, 0, 0)

/** Lights + studio reflections built from light panels — no HDR download needed */
export function StudioLights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow />
      <spotLight position={[-4, 2, 3]} intensity={30} angle={0.5} penumbra={1} color="#ffd8a8" />

      <Environment resolution={512} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[10, 1.5, 1]} />
        {/* Cinematic rim: warm amber from the left, cool blue from the right */}
        <Lightformer form="rect" intensity={3} color="#ff9a3c" position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} color="#4d7dff" position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={4} position={[0, 0, 5]} scale={2} />
        {/* Softbox strips: long white streaks across glossy black acetate */}
        <Lightformer form="rect" intensity={1.8} position={[-2, 2.5, 4]} scale={[5, 0.35, 1]} onUpdate={faceOrigin} />
        <Lightformer form="rect" intensity={1.5} position={[2.5, -1.5, 4]} scale={[4, 0.25, 1]} onUpdate={faceOrigin} />
      </Environment>
    </>
  )
}
