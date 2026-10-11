import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, Eye, Feather, Award } from 'lucide-react'
import { features } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger)

const iconMap = {
  ShieldCheck: ShieldCheck,
  Eye: Eye,
  Feather: Feather,
  Award: Award,
}

export default function FeatureStrip() {
  const containerRef = useRef(null)
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        }
      )
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative z-20 py-16 border-y border-white/5 bg-[#121215]"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = iconMap[feat.icon] || ShieldCheck
            return (
              <div
                key={feat.title}
                ref={(el) => (cardsRef.current[index] = el)}
                className="group p-6 rounded-2xl glass-card hover:border-[#e8a24a]/30 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#e8a24a] mb-5 group-hover:scale-110 group-hover:bg-[#e8a24a]/10 transition-all duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-display text-white mb-2 group-hover:text-[#e8a24a] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{feat.text}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
