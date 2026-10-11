import React from 'react'
import { MessageCircle, ArrowUp, Sparkles } from 'lucide-react'
import { site } from '../data/siteData'

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative z-20 bg-[#0d0d0f] border-t border-white/5 py-16 text-zinc-400 grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-14 border-b border-white/5">
          {/* Brand Info */}
          <div className="md:col-span-5">
            <a
              href="#"
              className="inline-flex items-center gap-2.5 text-2xl font-bold font-display text-white mb-4"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#e8a24a] shadow-[0_0_10px_#e8a24a]" />
              <span>{site.brand}</span>
            </a>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-6">
              Precision-crafted dark luxury eyewear. Polarized lenses and hand-finished Italian bio-acetate frames designed for timeless clarity.
            </p>
            <div className="flex items-center gap-3">
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e8a24a] hover:text-black border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e8a24a] hover:text-black border border-white/10 flex items-center justify-center transition-all duration-300"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-4">
              Explore Collection
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Noir Wayfarer Series
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Aero Mirage Titanium
                </a>
              </li>
              <li>
                <a href="#collection" className="hover:text-white transition-colors">
                  Komorebi Wireframes
                </a>
              </li>
              <li>
                <a href="#technology" className="hover:text-white transition-colors">
                  Polarized Optics Engine
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter / Studio Status */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-4">
              Private Allocation Drop
            </h4>
            <p className="text-xs text-zinc-400 mb-4">
              Subscribe to receive exclusive access codes for limited batch releases.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#e8a24a]"
              />
              <button className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-[#e8a24a] hover:text-black text-xs font-semibold text-white transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div>
            &copy; {new Date().getFullYear()} {site.brand}. All optical designs reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-zinc-400">
              Website by <span className="text-[#e8a24a] font-semibold">SanPuRO</span>
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <span>TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
