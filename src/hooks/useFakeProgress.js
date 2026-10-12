import { useEffect, useState } from 'react'

/**
 * Drives the Loader while the 3D hero is procedural (nothing to download).
 * Once a real .glb lands, replace with drei's `useProgress()`.
 */
export function useFakeProgress(duration = 1400) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const start = performance.now()
    let raf
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration)
      setProgress(Math.round(p * 100))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [duration])

  return { progress, isLoaded: progress >= 100 }
}
