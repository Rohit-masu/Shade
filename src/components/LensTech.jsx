import React, { useState, useRef } from 'react'
import { Sparkles, Eye, CheckCircle2, SlidersHorizontal, Sun, Shield } from 'lucide-react'
import { lensTypes } from '../data/siteData'

export default function LensTech() {
  const [sliderPos, setSliderPos] = useState(50)
  const [isDragging, setIsDragging] = useState(false)
  const [activeLens, setActiveLens] = useState(lensTypes[0].id)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percent)
  }

  const handleMouseMove = (e) => {
    if (!isDragging) return
    handleMove(e.clientX)
  }

  const handleTouchMove = (e) => {
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX)
    }
  }

  return (
    <section id="technology" className="relative z-20 py-24 bg-[#121215] border-t border-white/5 grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e8a24a] uppercase tracking-widest mb-4">
            <Eye className="w-3.5 h-3.5" />
            Optometric Innovation
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            See the Glare Vanish.
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-lg">
            Drag the comparison slider below to experience the optical difference of our tri-layer polarized nano-filtration.
          </p>
        </div>

        {/* Interactive Before / After Glare Slider */}
        <div className="max-w-4xl mx-auto mb-20">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onMouseUp={() => setIsDragging(false)}
            onMouseLeave={() => setIsDragging(false)}
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            className="relative h-80 md:h-[440px] rounded-3xl overflow-hidden cursor-ew-resize select-none border border-white/10 shadow-2xl shadow-black/80"
          >
            {/* Layer 1: Polarized View (Clean, vivid, crisp) */}
            <div className="absolute inset-0 bg-[#0d1b2a] flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
                alt="Polarized high contrast coastal view"
                className="w-full h-full object-cover filter saturate-125 contrast-110 brightness-95"
              />
              <div className="absolute top-6 right-6 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-[#e8a24a] flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>VANTA POLARIZED HD</span>
              </div>
            </div>

            {/* Layer 2: Glare View (Clipped by slider position) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80"
                alt="Blinding sunlight glare without polarization"
                className="w-full h-full object-cover filter contrast-75 brightness-150 blur-[0.5px]"
              />
              {/* Simulated blinding glare flare overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 via-white/20 to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6 z-10 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-2">
                <Sun className="w-3.5 h-3.5 text-amber-300" />
                <span>STANDARD UNPOLARIZED GLARE</span>
              </div>
            </div>

            {/* Center Slider Divider Bar & Handle */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-20 shadow-[0_0_15px_rgba(255,255,255,0.8)]"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#101012] border-2 border-white text-white flex items-center justify-center shadow-lg">
                <SlidersHorizontal className="w-4 h-4 text-[#e8a24a]" />
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs font-mono text-zinc-500 mt-3 px-2">
            <span>DRAG LEFT FOR FULL POLARIZATION</span>
            <span>DRAG RIGHT FOR RAW GLARE</span>
          </div>
        </div>

        {/* 4 Interactive Lens Technology Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lensTypes.map((lens) => {
            const isActive = lens.id === activeLens
            return (
              <div
                key={lens.id}
                onClick={() => setActiveLens(lens.id)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                  isActive
                    ? 'bg-zinc-900/90 border-[#e8a24a] shadow-[0_0_25px_rgba(232,162,74,0.15)] scale-[1.02]'
                    : 'glass-card hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider bg-white/5 text-[#e8a24a] border border-white/10">
                    {lens.badge}
                  </span>
                  {isActive && <CheckCircle2 className="w-4 h-4 text-[#e8a24a]" />}
                </div>

                <h3 className="text-lg font-bold font-display text-white mb-1">{lens.title}</h3>
                <p className="text-xs text-zinc-400 font-medium mb-3">{lens.subtitle}</p>
                <p className="text-xs text-zinc-300 leading-relaxed mb-6">{lens.desc}</p>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  {lens.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#e8a24a]" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
