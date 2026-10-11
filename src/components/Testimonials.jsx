import React, { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { testimonials } from '../data/siteData'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [isPaused])

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const current = testimonials[currentIndex]

  return (
    <section className="relative z-20 py-24 bg-[#121215] border-t border-white/5 grain-overlay">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e8a24a] uppercase tracking-widest mb-4">
            Client Voices
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-display text-white">
            Worn By Architects & Drivers
          </h2>
        </div>

        {/* Carousel Card */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative glass-panel rounded-3xl p-8 md:p-14 border border-white/10 text-center shadow-2xl"
        >
          <Quote className="w-12 h-12 text-[#e8a24a]/30 mx-auto mb-6" />

          {/* Rating */}
          <div className="flex justify-center gap-1.5 mb-6">
            {[...Array(current.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-[#e8a24a] text-[#e8a24a]" />
            ))}
          </div>

          {/* Comment */}
          <blockquote className="text-xl md:text-2xl text-zinc-200 font-light leading-relaxed mb-8 min-h-[90px] flex items-center justify-center">
            "{current.comment}"
          </blockquote>

          {/* Author */}
          <div className="border-t border-white/5 pt-6">
            <h4 className="text-base font-bold font-display text-white">{current.name}</h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              {current.role} &bull; <span className="text-[#e8a24a]">{current.city}</span>
            </p>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous quote"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e8a24a] hover:text-black border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? 'w-8 bg-[#e8a24a]'
                      : 'bg-zinc-700 hover:bg-zinc-500'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              aria-label="Next quote"
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e8a24a] hover:text-black border border-white/10 flex items-center justify-center text-zinc-400 transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
