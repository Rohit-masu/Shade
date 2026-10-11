import React, { useState, useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { MessageCircle, Check, ArrowRight, Shield, Layers, Sparkles, Scale } from 'lucide-react'
import { site, products } from '../data/siteData'
import ProductCard from './ProductCard'

export default function ProductShowcase() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [isTransitioning, setIsTransitioning] = useState(false)

  const stageRef = useRef(null)
  const imageRef = useRef(null)
  const glowRef = useRef(null)
  const detailsRef = useRef(null)
  const shadowRef = useRef(null)

  // Mouse move 3D tilt and floating on the central showcase stage
  const handleStageMouseMove = (e) => {
    const stage = stageRef.current
    const img = imageRef.current
    if (!stage || !img) return

    const rect = stage.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    gsap.to(img, {
      rotateY: x * 22,
      rotateX: -y * 22,
      x: x * 20,
      y: y * 20,
      duration: 0.5,
      ease: 'power2.out',
    })

    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: x * 40,
        y: y * 40,
        duration: 0.7,
        ease: 'power2.out',
      })
    }
  }

  const handleStageMouseLeave = () => {
    const img = imageRef.current
    if (!img) return
    gsap.to(img, {
      rotateY: 0,
      rotateX: 0,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
    })
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }

  // Variant change GSAP transition
  const handleSelectProduct = (newProduct) => {
    if (newProduct.id === selectedProduct.id || isTransitioning) return

    setIsTransitioning(true)
    const img = imageRef.current
    const details = detailsRef.current
    const glow = glowRef.current

    const tl = gsap.timeline({
      onComplete: () => {
        setIsTransitioning(false)
      },
    })

    // Out animation
    tl.to(img, {
      scale: 0.7,
      opacity: 0,
      rotateY: -35,
      filter: 'blur(8px)',
      duration: 0.35,
      ease: 'power2.in',
    })
      .to(details, { opacity: 0.4, y: 10, duration: 0.2 }, 0)
      .add(() => {
        setSelectedProduct(newProduct)
      })
      // In animation
      .fromTo(
        img,
        { scale: 0.65, opacity: 0, rotateY: 35, filter: 'blur(10px)' },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          filter: 'blur(0px)',
          duration: 0.6,
          ease: 'power3.out',
        }
      )
      .to(details, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3')
      .to(glow, { backgroundColor: newProduct.glowColor, duration: 0.6 }, '-=0.5')
  }

  const handleCardClick = (product) => {
    handleSelectProduct(product)
    const stage = document.getElementById('product-stage')
    if (stage) {
      stage.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const whatsappInquiryUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hello ${site.brand}, I would like to enquire about the ${selectedProduct.name} (${selectedProduct.colorName}) priced at ₹${selectedProduct.price}.`
  )}`

  return (
    <section id="collection" className="relative z-20 py-24 bg-[#101012] grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e8a24a] uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Bespoke Eyewear Showcase
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold font-display text-white tracking-tight">
            Sculpted for Daylight.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e8a24a] via-amber-200 to-amber-500">
              Engineered for Vision.
            </span>
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-lg">
            Select a variant below to inspect real-time 3D depth, material curvature, and custom lens specifications.
          </p>
        </div>

        {/* Central Stage (Product Showcase) */}
        <div
          id="product-stage"
          ref={stageRef}
          onMouseMove={handleStageMouseMove}
          onMouseLeave={handleStageMouseLeave}
          className="relative rounded-3xl glass-panel p-8 md:p-14 overflow-hidden mb-20 border border-white/10 shadow-2xl shadow-black/80"
        >
          {/* Dynamic Colored Glow Behind Product */}
          <div
            ref={glowRef}
            className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] pointer-events-none transition-colors duration-700"
            style={{ backgroundColor: selectedProduct.glowColor }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left / Center: Interactive 3D Sunglasses Float */}
            <div className="lg:col-span-7 flex flex-col items-center justify-center min-h-[360px] md:min-h-[460px] perspective-[1200px]">
              {/* Floating Container */}
              <div className="relative w-full flex items-center justify-center animate-[bounce_6s_ease-in-out_infinite]">
                <img
                  ref={imageRef}
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="w-full max-w-[560px] max-h-[380px] object-contain filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.85)] cursor-grab active:cursor-grabbing transition-transform"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = '/products/amber-wayfarer.png'
                  }}
                />
              </div>

              {/* Floor Shadow Reflection */}
              <div
                ref={shadowRef}
                className="w-72 md:w-96 h-5 rounded-full bg-black/60 blur-md mt-6 transform scale-y-50"
              />

              {/* Color Swatches Switcher */}
              <div className="mt-8 flex items-center gap-3 bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                <span className="text-xs font-mono uppercase text-zinc-400 mr-2">Colorway:</span>
                {products.map((p) => {
                  const isActive = p.id === selectedProduct.id
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSelectProduct(p)}
                      title={`${p.name} - ${p.colorName}`}
                      className={`relative w-8 h-8 rounded-full transition-all duration-300 flex items-center justify-center ${
                        isActive
                          ? 'scale-125 ring-2 ring-[#e8a24a] ring-offset-2 ring-offset-black'
                          : 'opacity-70 hover:opacity-100 hover:scale-110'
                      }`}
                      style={{ backgroundColor: p.swatch }}
                    >
                      {isActive && <Check className="w-3.5 h-3.5 text-white drop-shadow" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right: Technical Details & Inquiry Panel */}
            <div ref={detailsRef} className="lg:col-span-5 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 self-start px-3 py-1 rounded-full text-xs font-mono text-[#e8a24a] bg-[#e8a24a]/10 border border-[#e8a24a]/20 mb-3">
                {selectedProduct.tag}
              </div>

              <h3 className="text-3xl md:text-4xl font-bold font-display text-white mb-1">
                {selectedProduct.name}
              </h3>
              <p className="text-sm text-zinc-400 mb-6">
                Finish: <span className="text-white font-medium">{selectedProduct.colorName}</span>
              </p>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl md:text-4xl font-extrabold font-accent text-white">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice && (
                  <span className="text-base text-zinc-500 line-through">
                    ₹{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  IN STOCK
                </span>
              </div>

              <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8">
                {selectedProduct.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <Layers className="w-4 h-4 text-[#e8a24a]" />
                  <div>
                    <span className="block text-[11px] text-zinc-400 font-mono">FRAME</span>
                    <span className="text-xs font-medium text-white">{selectedProduct.specs.frame}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <Shield className="w-4 h-4 text-[#e8a24a]" />
                  <div>
                    <span className="block text-[11px] text-zinc-400 font-mono">LENS TECH</span>
                    <span className="text-xs font-medium text-white">{selectedProduct.specs.lens}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 text-[#e8a24a]" />
                  <div>
                    <span className="block text-[11px] text-zinc-400 font-mono">UV DEFENSE</span>
                    <span className="text-xs font-medium text-white">{selectedProduct.specs.uv}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <Scale className="w-4 h-4 text-[#e8a24a]" />
                  <div>
                    <span className="block text-[11px] text-zinc-400 font-mono">WEIGHT</span>
                    <span className="text-xs font-medium text-white">{selectedProduct.specs.weight}</span>
                  </div>
                </div>
              </div>

              {/* WhatsApp Direct Inquiry Button */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-4 px-6 rounded-full bg-[#e8a24a] hover:bg-amber-400 text-black font-bold text-sm tracking-wide transition-all duration-300 flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(232,162,74,0.35)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-black" />
                  <span>Enquire on WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Product Cards Grid Below Stage */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold font-display text-white">Full Optical Lineup</h3>
            <span className="text-xs font-mono text-zinc-400">
              {products.length} ARCHITECTURAL SILHOUETTES
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={product.id === selectedProduct.id}
                onSelect={handleCardClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
