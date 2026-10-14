import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { stats, marqueeWords } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Two giant marquee rows that speed up (and flip direction) with scroll velocity,
 * followed by count-up stats. Replaces the old icon feature cards.
 */
export default function Highlights() {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef)

      // Marquee: each track holds the words twice, so -50% loops seamlessly
      const loops = q('.marquee-track').map((track, i) =>
        gsap.fromTo(
          track,
          { xPercent: i % 2 ? -50 : 0 },
          { xPercent: i % 2 ? 0 : -50, duration: 40, ease: 'none', repeat: -1 }
        )
      )
      // Scroll velocity boosts the speed; scrolling up reverses it; it eases back once scrolling stops
      let direction = 1
      const setSpeed = (timeScale, duration) =>
        loops.forEach((loop) => gsap.to(loop, { timeScale, duration, ease: 'power2.out', overwrite: true }))
      const settle = gsap.delayedCall(0.15, () => setSpeed(direction, 1.2)).pause()
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        onUpdate: (self) => {
          direction = self.direction
          setSpeed((1 + Math.min(Math.abs(self.getVelocity()) / 250, 8)) * direction, 0.25)
          settle.restart(true)
        },
      })

      // Stats: count up and rise in when they enter the viewport
      q('.stat').forEach((el, i) => {
        const numEl = el.querySelector('.stat-num')
        const { value, decimals = 0 } = stats[i]
        const counter = { v: 0 }
        gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          .from(el, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', delay: i * 0.1 })
          .to(counter, {
            v: value,
            duration: 1.8,
            ease: 'power2.out',
            onUpdate: () => (numEl.textContent = counter.v.toFixed(decimals)),
          }, '<0.1')
          .from(el.querySelector('.stat-bar'), { scaleX: 0, duration: 1.4, ease: 'power3.inOut' }, '<')
      })
    },
    { scope: rootRef }
  )

  const row = (filled) =>
    [...marqueeWords, ...marqueeWords].map((word, i) => (
      <span key={i} className="flex items-center gap-8 md:gap-12 pr-8 md:pr-12">
        <span
          className={`font-accent font-black uppercase text-5xl md:text-8xl tracking-tight whitespace-nowrap ${
            filled ? 'text-white' : 'text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.35)]'
          }`}
        >
          {word}
        </span>
        <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-[#e8a24a] shadow-[0_0_20px_#e8a24a]" />
      </span>
    ))

  return (
    <section ref={rootRef} className="relative z-20 bg-[#101012] py-20 md:py-28 overflow-hidden grain-overlay">
      {/* Marquee */}
      <div className="space-y-3 md:space-y-5 -rotate-2 scale-105">
        <div className="flex w-max marquee-track">{row(true)}</div>
        <div className="flex w-max marquee-track">{row(false)}</div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 md:mt-28 grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {stats.map((s) => (
          <div key={s.label} className="stat">
            <div className="flex items-baseline font-accent font-black text-white leading-none">
              <span className="stat-num text-5xl md:text-7xl tabular-nums">0</span>
              <span className="text-2xl md:text-4xl text-[#e8a24a] ml-1">{s.suffix}</span>
            </div>
            <div className="stat-bar origin-left h-px bg-gradient-to-r from-[#e8a24a] to-transparent my-4 md:my-5" />
            <p className="text-sm md:text-base font-semibold text-white">{s.label}</p>
            <p className="text-xs md:text-sm text-zinc-500 mt-1">{s.note}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
