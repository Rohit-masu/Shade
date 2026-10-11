import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { X, Maximize2, Camera } from 'lucide-react'
import { lookbook } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger)

export default function Lookbook() {
  const [activeModalItem, setActiveModalItem] = useState(null)
  const containerRef = useRef(null)
  const itemsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Parallax effect with alternating scroll speeds
      itemsRef.current.forEach((el, index) => {
        if (!el) return
        const speed = index % 2 === 0 ? 30 : -30
        gsap.to(el.querySelector('.parallax-img'), {
          yPercent: speed,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1,
          },
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="lookbook" ref={containerRef} className="relative z-20 py-24 bg-[#101012] grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e8a24a] uppercase tracking-widest mb-4">
              <Camera className="w-3.5 h-3.5" />
              Campaign Editorial
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
              In The Wild.
            </h2>
          </div>
          <p className="text-zinc-400 text-sm md:text-base max-w-md">
            Capturing the intersection of structural design, natural golden hour luminescence, and modern urban style.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {lookbook.map((item, index) => (
            <div
              key={item.id}
              ref={(el) => (itemsRef.current[index] = el)}
              onClick={() => setActiveModalItem(item)}
              className="group cursor-pointer relative rounded-3xl overflow-hidden glass-card border border-white/10 h-[380px] md:h-[480px]"
            >
              {/* Image with Parallax & Hover Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  loading="lazy"
                  className="parallax-img w-full h-[120%] -top-[10%] object-cover transition-transform duration-700 ease-out group-hover:scale-110 filter brightness-90 group-hover:brightness-100"
                />
              </div>

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 flex items-end justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white/10 backdrop-blur-md text-[#e8a24a] border border-white/10 mb-2 inline-block">
                    {item.category}
                  </span>
                  <h3 className="text-2xl font-bold font-display text-white group-hover:text-[#e8a24a] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1">{item.subtitle}</p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-[#e8a24a] group-hover:text-black transition-all duration-300">
                  <Maximize2 className="w-4 h-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeModalItem && (
        <div
          onClick={() => setActiveModalItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 animate-fadeIn"
        >
          <button
            onClick={() => setActiveModalItem(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl max-h-[85vh] rounded-2xl overflow-hidden glass-panel border border-white/20 shadow-2xl"
          >
            <img
              src={activeModalItem.image}
              alt={activeModalItem.title}
              className="w-full h-full max-h-[75vh] object-contain"
            />
            <div className="p-6 bg-zinc-950 flex justify-between items-center">
              <div>
                <h4 className="text-xl font-bold text-white font-display">
                  {activeModalItem.title}
                </h4>
                <p className="text-xs text-zinc-400">{activeModalItem.subtitle}</p>
              </div>
              <span className="text-xs font-mono text-[#e8a24a] uppercase">
                {activeModalItem.category}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
