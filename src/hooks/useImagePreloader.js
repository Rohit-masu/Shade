import { useState, useEffect } from 'react'

/**
 * Preloads image sequences for smooth 60fps canvas scroll scrubbing.
 * Gracefully detects missing frames to trigger dynamic procedural/video fallback.
 */
export function useImagePreloader({ basePath, frameCount, extension = 'webp', padLength = 4 }) {
  const [images, setImages] = useState([])
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasRealFrames, setHasRealFrames] = useState(true)

  useEffect(() => {
    if (frameCount > 180) {
      console.warn(`[VANTA Optics Preloader] Frame count (${frameCount}) exceeds recommended 180 limit for web performance.`)
    }

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const step = isMobile ? 2 : 1
    const loadedImages = []
    let loadedCount = 0
    let failedCount = 0
    let isCancelled = false

    const totalToLoad = Math.ceil(frameCount / step)

    // Preload image array
    for (let i = 1; i <= frameCount; i += step) {
      const img = new Image()
      const paddedIndex = String(i).padStart(padLength, '0')
      img.src = `${basePath}${paddedIndex}.${extension}`

      img.onload = () => {
        if (isCancelled) return
        loadedCount++
        setProgress(Math.round((loadedCount / totalToLoad) * 100))
        if (loadedCount + failedCount === totalToLoad) {
          if (failedCount > totalToLoad * 0.5) {
            // More than 50% failed => real frames not added yet
            setHasRealFrames(false)
          }
          setIsLoaded(true)
        }
      }

      img.onerror = () => {
        if (isCancelled) return
        failedCount++
        if (loadedCount + failedCount === totalToLoad) {
          if (failedCount > totalToLoad * 0.5) {
            setHasRealFrames(false)
          }
          setProgress(100)
          setIsLoaded(true)
        }
      }

      loadedImages.push(img)
    }

    setImages(loadedImages)

    return () => {
      isCancelled = true
    }
  }, [basePath, frameCount, extension, padLength])

  return { images, progress, isLoaded, hasRealFrames }
}
