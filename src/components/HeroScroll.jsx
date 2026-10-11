import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowDown, Shield, Sparkles } from 'lucide-react'
import { site, hero } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger)

export default function HeroScroll({ images, hasRealFrames }) {
  const containerRef = useRef(null)
  const canvasRef = useRef(null)
  const textRef = useRef(null)
  const midTextRef = useRef(null)
  const heroCtaRef = useRef(null)
  const videoFallbackRef = useRef(null)
  const [activeFrameIndex, setActiveFrameIndex] = useState(0)

  // Fallback single product image if frames sequence is missing
  const fallbackImgRef = useRef(null)
  const [fallbackLoaded, setFallbackLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.src = `${hero.fallbackImage}?v=transparent`
    img.onload = () => {
      fallbackImgRef.current = img
      setFallbackLoaded(true)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let animationFrameId
    const frameState = { frame: 0 }
    const totalFrames = images.length > 0 && hasRealFrames ? images.length : hero.frameCount

    // Setup canvas size with DPI scaling
    const resizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      renderFrame(Math.round(frameState.frame))
    }

    // Render frame to canvas
    const renderFrame = (index) => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const w = rect.width
      const h = rect.height

      ctx.save()
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.restore()

      // Mode A: High-Speed WebP Frame Sequence
      if (hasRealFrames && images.length > 0 && images[index]?.complete) {
        const img = images[index]
        const hRatio = w / img.width
        const vRatio = h / img.height
        const ratio = Math.min(hRatio, vRatio) * 0.8
        const centerShiftX = (w - img.width * ratio) / 2
        const centerShiftY = (h - img.height * ratio) / 2

        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          centerShiftX,
          centerShiftY,
          img.width * ratio,
          img.height * ratio
        )
      } else if (fallbackLoaded && fallbackImgRef.current) {
        // Mode B: Interactive 3D Depth & Glare Engine for isolated transparent eyewear
        const img = fallbackImgRef.current
        const hRatio = w / img.width
        const vRatio = h / img.height
        const ratio = Math.min(hRatio, vRatio) * 0.82
        const drawW = img.width * ratio
        const drawH = img.height * ratio

        // Scroll-driven rotation angle and organic floating wave
        const progressNormalized = frameState.frame / totalFrames
        const angle = Math.sin(progressNormalized * Math.PI * 2) * 0.10
        const floatY = Math.cos(progressNormalized * Math.PI * 4) * 10

        // Soft ground contact reflection shadow
        ctx.save()
        ctx.translate(w / 2, h / 2 + drawH * 0.38 + floatY * 0.2)
        ctx.scale(1, 0.2)
        const shadowGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, drawW * 0.42)
        shadowGrad.addColorStop(0, 'rgba(0, 0, 0, 0.65)')
        shadowGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)')
        shadowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
        ctx.fillStyle = shadowGrad
        ctx.beginPath()
        ctx.arc(0, 0, drawW * 0.42, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw transparent sunglasses
        ctx.save()
        ctx.translate(w / 2, h / 2 + floatY)
        ctx.rotate(angle)
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          - drawW / 2,
          - drawH / 2,
          drawW,
          drawH
        )

        // Clip light reflection glint strictly to sunglasses pixels (source-atop)
        ctx.globalCompositeOperation = 'source-atop'
        const sheenX = - drawW / 2 + (progressNormalized * 1.5) * drawW
        const sheenGrad = ctx.createLinearGradient(sheenX - 90, 0, sheenX + 90, 0)
        sheenGrad.addColorStop(0, 'rgba(255, 255, 255, 0)')
        sheenGrad.addColorStop(0.4, 'rgba(232, 162, 74, 0.25)')
        sheenGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)')
        sheenGrad.addColorStop(0.6, 'rgba(232, 162, 74, 0.25)')
        sheenGrad.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = sheenGrad
        ctx.fillRect(- drawW / 2, - drawH / 2, drawW, drawH)
        ctx.restore()
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // GSAP ScrollTrigger Context
    const ctxGsap = gsap.context(() => {
      // Pin hero and scrub frame sequence over 300vh scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=280%',
          pin: true,
          scrub: 0.8,
          onUpdate: (self) => {
            setActiveFrameIndex(Math.round(self.progress * (totalFrames - 1)))
          },
        },
      })

      // Frame scrubbing animation
      tl.to(
        frameState,
        {
          frame: totalFrames - 1,
          ease: 'none',
          duration: 3,
          onUpdate: () => {
            renderFrame(Math.round(frameState.frame))
          },
        },
        0
      )

      // Initial headline fades out and moves up as user scrolls
      if (textRef.current) {
        tl.to(
          textRef.current,
          {
            opacity: 0,
            y: -80,
            filter: 'blur(8px)',
            ease: 'power2.in',
            duration: 0.9,
          },
          0
        )
      }

      // Mid-scroll badge & headline appears
      if (midTextRef.current) {
        tl.fromTo(
          midTextRef.current,
          { opacity: 0, scale: 0.85, y: 40 },
          { opacity: 1, scale: 1, y: 0, duration: 0.8, ease: 'power2.out' },
          1.1
        ).to(
          midTextRef.current,
          { opacity: 0, scale: 1.1, y: -40, duration: 0.6, ease: 'power2.in' },
          2.0
        )
      }

      // Hero canvas transitions into product stage at the end of pin
      tl.to(
        canvas,
        {
          scale: 0.62,
          y: 70,
          opacity: 0.15,
          duration: 0.8,
          ease: 'power2.inOut',
        },
        2.2
      )
    }, container)

    // Initial entrance animation
    gsap.fromTo(
      textRef.current?.querySelectorAll('.reveal-char') || [],
      { opacity: 0, y: 50, rotateX: 45 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.03,
        duration: 1.1,
        ease: 'power3.out',
        delay: 0.2,
      }
    )

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
      ctxGsap.revert()
    }
  }, [images, hasRealFrames, fallbackLoaded])

  const scrollToCollection = () => {
    const el = document.getElementById('collection')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // Split headline for cinematic letter-by-letter reveal
  const headlineWords = site.tagline.split(' ')

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-[#101012] flex items-center justify-center grain-overlay"
    >
      {/* Background Radial Amber Halo */}
      <div className="absolute w-[600px] h-[600px] md:w-[850px] md:h-[850px] rounded-full bg-gradient-to-tr from-[#e8a24a]/20 via-[#e8a24a]/8 to-transparent blur-[120px] pointer-events-none animate-pulse" />

      {/* Decorative Architecture Grid Line */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      {/* Primary Hero Text (Phase 1) */}
      <div
        ref={textRef}
        className="absolute z-20 text-center max-w-4xl px-6 pointer-events-none flex flex-col items-center"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#e8a24a]" />
          <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 font-mono">
            New 2026 Architectural Drop
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-display tracking-tight text-white mb-6 leading-[1.05]">
          {headlineWords.map((word, wIdx) => (
            <span key={wIdx} className="inline-block mr-3 md:mr-5">
              {word.split('').map((char, cIdx) => (
                <span key={cIdx} className="reveal-char inline-block">
                  {char}
                </span>
              ))}
            </span>
          ))}
        </h1>

        <p className="text-lg md:text-xl text-zinc-400 font-light max-w-xl mx-auto mb-8">
          {site.subtitle}
        </p>

        <div className="pointer-events-auto flex items-center gap-4">
          <button
            onClick={scrollToCollection}
            className="group px-8 py-4 rounded-full bg-[#e8a24a] text-black font-semibold text-sm tracking-wide transition-all duration-300 hover:shadow-[0_0_25px_rgba(232,162,74,0.6)] hover:scale-105 active:scale-95 flex items-center gap-2"
          >
            <span>Explore Collection</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Mid-Scroll Secondary Text (Phase 2) */}
      <div
        ref={midTextRef}
        className="absolute z-20 text-center max-w-2xl px-6 pointer-events-none opacity-0"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e8a24a]/10 border border-[#e8a24a]/30 text-[#e8a24a] text-xs font-mono mb-4 uppercase tracking-widest">
          <Shield className="w-3.5 h-3.5" />
          Optical Grade Precision
        </div>
        <h2 className="text-4xl md:text-6xl font-bold font-display text-white tracking-tight leading-tight">
          100% UV400.
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-zinc-500">
            Zero Compromise.
          </span>
        </h2>
        <p className="text-sm md:text-base text-zinc-400 mt-4 max-w-md mx-auto">
          Every curvature diamond-cut for optical purity and anti-reflective defense.
        </p>
      </div>

      {/* 360 Interactive Canvas */}
      <canvas
        ref={canvasRef}
        className="relative z-10 w-full h-full max-w-[1400px] max-h-[850px] pointer-events-none"
      />

      {/* Scroll Down Hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 text-zinc-500 text-xs tracking-widest font-mono">
        <span className="uppercase">Scroll to Rotate</span>
        <div className="w-5 h-8 rounded-full border border-zinc-700 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-[#e8a24a] animate-bounce" />
        </div>
      </div>
    </section>
  )
}
