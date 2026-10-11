import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { site } from '../data/siteData'

export default function Loader({ progress, isLoaded, onComplete }) {
  const containerRef = useRef(null)
  const brandRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    // Disable scroll while loading
    if (!isLoaded) {
      document.body.style.overflow = 'hidden'
    } else {
      // Exit animation
      const tl = gsap.timeline({
        onComplete: () => {
          document.body.style.overflow = ''
          if (onComplete) onComplete()
        },
      })

      tl.to([brandRef.current, barRef.current], {
        opacity: 0,
        y: -20,
        duration: 0.6,
        ease: 'power3.in',
      }).to(containerRef.current, {
        opacity: 0,
        pointerEvents: 'none',
        duration: 0.8,
        ease: 'power2.inOut',
      })
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isLoaded, onComplete])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d0d0f] text-white grain-overlay"
    >
      {/* Background Soft Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#e8a24a]/10 blur-3xl pointer-events-none animate-pulse" />

      {/* Brand & Subtitle */}
      <div ref={brandRef} className="relative z-10 text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#e8a24a] shadow-[0_0_12px_#e8a24a]" />
          <span className="text-xs tracking-[0.3em] uppercase text-zinc-400 font-mono">
            Optical Engineering
          </span>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight font-display text-white">
          {site.brand}
        </h1>
        <p className="text-sm text-zinc-400 tracking-wider mt-2 font-mono">
          PREPARING 3D FRAME REVOLUTION
        </p>
      </div>

      {/* Progress Bar */}
      <div ref={barRef} className="relative z-10 w-64 md:w-80 flex flex-col gap-2">
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-600 via-[#e8a24a] to-amber-300 rounded-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(232,162,74,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
          <span>INITIALIZING</span>
          <span className="text-[#e8a24a] font-semibold">{progress}%</span>
        </div>
      </div>
    </div>
  )
}
