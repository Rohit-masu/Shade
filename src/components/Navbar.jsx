import React, { useState, useEffect } from 'react'
import { Menu, X, MessageCircle, ArrowUpRight } from 'lucide-react'
import { site } from '../data/siteData'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Collection', href: '#collection' },
    { name: 'Technology', href: '#technology' },
    { name: 'Lookbook', href: '#lookbook' },
    { name: 'Store', href: '#store' },
  ]

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hello ${site.brand}, I would like to inquire about your eyewear collection.`
  )}`

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#101012]/80 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/40'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Logo */}
        <a
          href="#"
          className="group flex items-center gap-2.5 text-xl md:text-2xl font-bold tracking-tight font-display text-white"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#e8a24a] group-hover:scale-125 transition-transform duration-300 shadow-[0_0_10px_#e8a24a]" />
          <span>{site.brand}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="relative hover:text-white transition-colors py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#e8a24a] transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop WhatsApp Action */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-[#e8a24a] hover:text-black border border-white/10 hover:border-[#e8a24a] text-sm font-medium transition-all duration-300 group"
          >
            <MessageCircle className="w-4 h-4 text-[#e8a24a] group-hover:text-black transition-colors" />
            <span>WhatsApp</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
          className="md:hidden p-2 text-zinc-300 hover:text-white focus:outline-none"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[#101012]/95 backdrop-blur-xl border-b border-white/10 px-6 py-8 flex flex-col gap-6 animate-fadeIn">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-lg font-medium text-zinc-200 hover:text-[#e8a24a] transition-colors"
            >
              {link.name}
            </a>
          ))}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-[#e8a24a] text-black font-semibold text-sm transition-opacity hover:opacity-90"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      )}
    </header>
  )
}
