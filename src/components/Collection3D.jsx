import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { ContactShadows, Float, PresentationControls } from '@react-three/drei'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'
import Sunglasses from '../three/Sunglasses'
import { StudioLights } from '../three/studio'
import { makeFrameMaterial, makeLensMaterial } from '../three/materials'
import { site, products } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/* The selected pair: spins in on every product change, drag to inspect */
function Model({ product }) {
  const { viewport } = useThree()
  const groupRef = useRef()
  const mats = useMemo(
    () => ({ frame: makeFrameMaterial(product.model.frame), lens: makeLensMaterial(product.model.lens) }),
    [product]
  )
  useEffect(() => () => {
    mats.frame.dispose()
    mats.lens.dispose()
  }, [mats])

  useEffect(() => {
    const g = groupRef.current
    const tl = gsap.timeline()
    tl.fromTo(g.rotation, { y: -Math.PI * 1.25 }, { y: 0.45, duration: 1.4, ease: 'expo.out' })
      .fromTo(g.scale, { x: 0.55, y: 0.55, z: 0.55 }, { x: 1, y: 1, z: 1, duration: 1.1, ease: 'expo.out' }, 0)
    return () => tl.kill()
  }, [product])

  const fit = Math.min(1, viewport.width / 4.2) // keep temples inside the stage on narrow screens
  return (
    <group scale={fit}>
      <group ref={groupRef} rotation-x={0.14}>
        <Sunglasses style={product.model.style} frameMaterial={mats.frame} lensMaterial={mats.lens} />
      </group>
    </group>
  )
}

export default function Collection3D() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const detailsRef = useRef(null)
  const [index, setIndex] = useState(0)
  const [inView, setInView] = useState(false)
  const product = products[index]

  // Only render the WebGL stage while it is on screen
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '200px' })
    io.observe(stageRef.current)
    return () => io.disconnect()
  }, [])

  // Section intro: headline lines rise in, stage and list fade up
  useGSAP(
    () => {
      const split = SplitText.create('.collection-title', { type: 'lines', mask: 'lines' })
      gsap.timeline({ scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true } })
        .from(split.lines, { yPercent: 110, duration: 1, stagger: 0.12, ease: 'power4.out' })
        .from('.collection-reveal', { y: 50, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' }, '-=0.6')
      return () => split.revert()
    },
    { scope: rootRef }
  )

  // Details re-animate whenever the product changes
  useGSAP(
    () => {
      gsap.from(detailsRef.current.querySelectorAll('.detail-anim'), {
        y: 24,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.7,
        stagger: 0.06,
        ease: 'power3.out',
      })
    },
    { dependencies: [index], scope: detailsRef }
  )

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
    `Hello ${site.brand}, I would like to enquire about the ${product.name} (${product.colorName}) priced at ₹${product.price}.`
  )}`
  const specs = [
    ['Frame', product.specs.frame],
    ['Lens', product.specs.lens],
    ['Protection', product.specs.uv],
    ['Weight', product.specs.weight],
  ]

  return (
    <section id="collection" ref={rootRef} className="relative z-20 bg-[#0d0d0f] py-24 md:py-32 overflow-hidden grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <p className="collection-reveal text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">The Collection</p>
            <h2 className="collection-title text-[clamp(2.2rem,4.4vw,4.25rem)] font-display font-extrabold text-white leading-[0.95] tracking-tight">
              Six silhouettes.
              <br />
              <span className="text-[#e8a24a]">Sculpted in 3D.</span>
            </h2>
          </div>
          <p className="collection-reveal max-w-sm text-zinc-400">
            Drag to turn every pair in your hand. Pick a silhouette below and it assembles in front of you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* 3D stage */}
          <div
            ref={stageRef}
            className="collection-reveal lg:col-span-7 relative h-[52vh] md:h-[62vh] min-h-[360px] rounded-[2rem] border border-white/10 bg-[#141417] overflow-hidden cursor-grab active:cursor-grabbing"
          >
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] aspect-square rounded-full blur-[90px] opacity-60 transition-colors duration-700 pointer-events-none"
              style={{ backgroundColor: product.glowColor }}
            />
            <span key={product.id} className="theme-name absolute top-5 left-6 font-accent font-black text-7xl md:text-9xl text-white/[0.05] select-none pointer-events-none">
              {String(index + 1).padStart(2, '0')}
            </span>
            <Canvas
              className="!absolute inset-0"
              frameloop={inView ? 'always' : 'never'}
              dpr={[1, 1.75]}
              camera={{ position: [0, 0.2, 6], fov: 32 }}
              gl={{ antialias: true }}
            >
              <Suspense fallback={null}>
                <StudioLights />
                <PresentationControls global={false} cursor={false} snap polar={[-0.35, 0.35]} azimuth={[-1.2, 1.2]}>
                  <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
                    <Model product={product} />
                  </Float>
                </PresentationControls>
                <ContactShadows position={[0, -1.1, 0]} opacity={0.5} scale={10} blur={2.6} far={3} resolution={512} />
              </Suspense>
            </Canvas>
            <span className="absolute bottom-5 left-6 text-[11px] font-mono uppercase tracking-[0.25em] text-zinc-500 pointer-events-none">
              Drag to rotate
            </span>
          </div>

          {/* Details */}
          <div ref={detailsRef} className="collection-reveal lg:col-span-5 flex flex-col justify-center">
            <p className="detail-anim text-xs font-mono uppercase tracking-[0.25em] text-[#e8a24a] mb-3">{product.tag}</p>
            <h3 className="detail-anim text-3xl md:text-4xl font-display font-extrabold text-white leading-tight">{product.name}</h3>
            <p className="detail-anim text-zinc-400 mt-2">{product.colorName}</p>

            <div className="detail-anim flex items-baseline gap-3 mt-6">
              <span className="font-accent font-black text-3xl md:text-4xl text-white">₹{product.price.toLocaleString()}</span>
              <span className="text-zinc-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              <span className="text-xs font-mono text-emerald-400">
                -{Math.round((1 - product.price / product.originalPrice) * 100)}%
              </span>
            </div>

            <p className="detail-anim text-zinc-300 leading-relaxed mt-6">{product.description}</p>

            <dl className="detail-anim mt-8 border-t border-white/10">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between gap-6 py-3 border-b border-white/10 text-sm">
                  <dt className="font-mono uppercase tracking-widest text-[11px] text-zinc-500">{label}</dt>
                  <dd className="text-white text-right">{value}</dd>
                </div>
              ))}
            </dl>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="detail-anim group mt-8 self-start inline-flex items-center gap-3 rounded-full bg-[#e8a24a] text-black font-semibold text-sm pl-7 pr-2 py-2 hover:bg-amber-300 transition-colors"
            >
              Enquire on WhatsApp
              <span className="w-9 h-9 rounded-full bg-black text-[#e8a24a] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </a>
          </div>
        </div>

        {/* Product index */}
        <div className="collection-reveal mt-10 md:mt-14 -mx-6 px-6 md:mx-0 md:px-0 overflow-x-auto" data-lenis-prevent>
          <ol className="flex md:grid md:grid-cols-6 gap-3 min-w-max md:min-w-0">
            {products.map((p, i) => {
              const active = i === index
              return (
                <li key={p.id}>
                  <button
                    onClick={() => setIndex(i)}
                    className={`group w-44 md:w-full text-left rounded-2xl border px-4 py-4 transition-all duration-500 ${
                      active ? 'border-white/30 bg-white/[0.06]' : 'border-white/[0.07] hover:border-white/20 hover:bg-white/[0.03]'
                    }`}
                  >
                    <span className="flex items-center justify-between">
                      <span className={`font-mono text-[11px] ${active ? 'text-[#e8a24a]' : 'text-zinc-600'}`}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: p.swatch }} />
                    </span>
                    <span className={`block mt-3 text-sm font-semibold transition-colors ${active ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>
                      {p.name}
                    </span>
                    <span className="block text-xs text-zinc-500 mt-0.5">₹{p.price.toLocaleString()}</span>
                    <span className={`block h-px mt-3 bg-[#e8a24a] origin-left transition-transform duration-500 ${active ? 'scale-x-100' : 'scale-x-0'}`} />
                  </button>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
