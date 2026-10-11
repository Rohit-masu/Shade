import React, { useRef } from 'react'
import { ArrowUpRight, Shield, Sparkles } from 'lucide-react'

export default function ProductCard({ product, isSelected, onSelect }) {
  const cardRef = useRef(null)

  // Spotlight follows cursor (React Bits inspired)
  const handleMouseMove = (e) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    card.style.setProperty('--spotlight-x', `${x}px`)
    card.style.setProperty('--spotlight-y', `${y}px`)

    // 3D Tilt calculation
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`
  }

  const handleMouseLeave = () => {
    const card = cardRef.current
    if (!card) return
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(product)}
      className={`spotlight-card group cursor-pointer relative p-6 rounded-3xl transition-all duration-300 ease-out border ${
        isSelected
          ? 'bg-zinc-900/90 border-[#e8a24a] shadow-[0_0_30px_rgba(232,162,74,0.2)]'
          : 'bg-[#151518]/70 border-white/8 hover:border-white/20'
      }`}
    >
      {/* Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className="px-3 py-1 rounded-full text-[11px] font-mono tracking-wider uppercase bg-white/5 text-zinc-300 border border-white/10">
          {product.tag}
        </span>
        <div
          className="w-4 h-4 rounded-full border border-white/30 shadow-sm"
          style={{ backgroundColor: product.swatch }}
          title={product.colorName}
        />
      </div>

      {/* Product Image Stage */}
      <div className="relative h-44 flex items-center justify-center my-4 overflow-hidden">
        {/* Soft dynamic backdrop glow */}
        <div
          className="absolute w-32 h-32 rounded-full blur-2xl opacity-25 group-hover:opacity-60 transition-opacity duration-500"
          style={{ backgroundColor: product.swatch }}
        />
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="max-h-36 max-w-full object-contain filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.6)] group-hover:scale-108 group-hover:-rotate-2 transition-all duration-500 ease-out"
          onError={(e) => {
            // Graceful fallback placeholder
            e.target.onerror = null
            e.target.src = '/products/amber-wayfarer.png'
          }}
        />
      </div>

      {/* Product Information */}
      <div className="pt-2 border-t border-white/5">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-base font-bold font-display text-white group-hover:text-[#e8a24a] transition-colors">
              {product.name}
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">{product.colorName}</p>
          </div>
          <div className="text-right">
            <span className="text-base font-extrabold font-accent text-white">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="block text-[11px] text-zinc-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-4 flex items-center justify-between text-xs text-zinc-400 group-hover:text-white pt-2 border-t border-white/5">
          <span className="font-mono text-[11px]">SPECS & 3D VIEW</span>
          <div className="w-7 h-7 rounded-full bg-white/5 group-hover:bg-[#e8a24a] group-hover:text-black flex items-center justify-center transition-all duration-300">
            <ArrowUpRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  )
}
