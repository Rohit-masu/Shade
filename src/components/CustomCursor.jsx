import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    // Only enable on desktop with fine pointer
    if (window.matchMedia('(pointer: coarse)').matches) return

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY

      // Dot follows immediately
      gsap.to(dot, {
        x: mouseX,
        y: mouseY,
        duration: 0.1,
        ease: 'power2.out',
      })

      // Ring follows smoothly with slight lag
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.45,
        ease: 'power3.out',
      })
    }

    // Expand cursor on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target.closest('button, a, input, select, textarea, [data-cursor="hover"]')
      if (target) {
        gsap.to(ring, { scale: 1.8, borderColor: '#e8a24a', duration: 0.3 })
        gsap.to(dot, { scale: 0.5, backgroundColor: '#e8a24a', duration: 0.3 })
      } else {
        gsap.to(ring, { scale: 1, borderColor: 'rgba(255, 255, 255, 0.4)', duration: 0.3 })
        gsap.to(dot, { scale: 1, backgroundColor: '#ffffff', duration: 0.3 })
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', handleMouseOver)
    }
  }, [])

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-50">
      {/* Precision center dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 -ml-1 -mt-1 rounded-full bg-white transition-colors duration-200"
      />
      {/* Outer magnetic halo ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-white/40 transition-colors duration-200"
      />
    </div>
  )
}
