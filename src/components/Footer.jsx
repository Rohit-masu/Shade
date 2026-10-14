import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUp, ArrowUpRight } from 'lucide-react'
import { site } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const WORDMARK = 'VANTA'

const explore = [
  { label: 'Collection', href: '#collection' },
  { label: 'Technology', href: '#technology' },
  { label: 'Lookbook', href: '#lookbook' },
  { label: 'Store', href: '#store' },
]

/**
 * Closing CTA, plain-text link columns and a full-width wordmark whose letters
 * rise out of the bottom edge as the footer scrolls into view.
 */
export default function Footer() {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef)
      gsap.from(q('.footer-reveal'), {
        y: 40,
        opacity: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 80%', once: true },
      })
      gsap.fromTo(
        q('.wordmark-letter'),
        { yPercent: 100 },
        {
          yPercent: 0,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: q('.wordmark')[0], start: 'top bottom', end: 'bottom bottom', scrub: 0.6 },
        }
      )
    },
    { scope: rootRef }
  )

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hello ${site.brand}, I would like to inquire about your eyewear collection.`
  )}`
  const linkClass = 'group inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors'

  return (
    <footer ref={rootRef} className="relative z-20 bg-[#0d0d0f] border-t border-white/5 pt-24 md:pt-32 text-zinc-400 overflow-hidden grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Closing CTA */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 md:pb-20 border-b border-white/10">
          <h2 className="footer-reveal text-[clamp(2.4rem,6vw,5.5rem)] font-display font-extrabold text-white leading-[0.95] tracking-tight">
            Find your pair.
            <br />
            <span className="text-[#e8a24a]">We&rsquo;ll fit it.</span>
          </h2>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-reveal group self-start md:self-auto inline-flex items-center gap-3 rounded-full bg-[#e8a24a] text-black font-semibold text-sm pl-7 pr-2 py-2 hover:bg-amber-300 transition-colors"
          >
            Chat on WhatsApp
            <span className="w-9 h-9 rounded-full bg-black text-[#e8a24a] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-10 py-14 md:py-16 text-sm">
          <div className="footer-reveal col-span-2 md:col-span-4">
            <p className="text-white font-display font-bold text-xl">{site.brand}</p>
            <p className="mt-3 max-w-xs leading-relaxed">
              Hand-finished acetate frames and polarized lenses, designed for Indian sun.
            </p>
          </div>

          <div className="footer-reveal md:col-span-2">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-4">Explore</p>
            <ul className="space-y-2.5">
              {explore.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkClass}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-reveal md:col-span-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-4">Studio</p>
            <p className="text-zinc-300 leading-relaxed">{site.address}</p>
            <p className="mt-2">{site.hours}</p>
          </div>

          <div className="footer-reveal md:col-span-3">
            <p className="text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-600 mb-4">Contact</p>
            <ul className="space-y-2.5">
              <li>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  Instagram
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Credits */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 text-xs font-mono text-zinc-500">
          <span>
            &copy; {new Date().getFullYear()} {site.brand}. All optical designs reserved.
          </span>
          <span className="flex items-center gap-6">
            <span>
              Website by <span className="text-[#e8a24a]">SanPuRO</span>
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-white transition-colors"
            >
              Top <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </span>
        </div>
      </div>

      {/* Full-width wordmark rising out of the bottom edge */}
      <div className="wordmark flex justify-center overflow-hidden select-none pointer-events-none" aria-hidden="true">
        {WORDMARK.split('').map((ch, i) => (
          <span
            key={i}
            className="wordmark-letter inline-block font-accent font-black leading-[0.78] text-[21vw] text-transparent bg-clip-text bg-gradient-to-b from-[#e8a24a] via-[#e8a24a]/50 to-transparent"
          >
            {ch}
          </span>
        ))}
      </div>
    </footer>
  )
}
