import React, { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { ArrowDown, Sparkles } from 'lucide-react'
import Sunglasses from '../three/Sunglasses'
import { site, themes3d, lineup3d } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

const CHAPTERS = ['Assemble', 'Colorways', 'Anatomy', 'Lineup']

const clamp01 = (v) => Math.min(Math.max(v, 0), 1)
const lerp = THREE.MathUtils.lerp
const smoothstep = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

function makeFrameMaterial(cfg) {
  return new THREE.MeshPhysicalMaterial({
    color: cfg?.color ?? '#111',
    metalness: cfg?.metalness ?? 0.2,
    roughness: cfg?.roughness ?? 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  })
}

function makeLensMaterial(cfg) {
  return new THREE.MeshPhysicalMaterial({
    color: cfg?.color ?? '#333',
    metalness: cfg?.metalness ?? 0.7,
    roughness: 0.04,
    transparent: true,
    opacity: cfg?.opacity ?? 0.85,
    clearcoat: 1,
    envMapIntensity: 1.8,
  })
}

/* ------------------------------------------------------------------ */
/*  3D scene: reads the GSAP-driven `anim` object every frame          */
/* ------------------------------------------------------------------ */
function Scene({ anim, stageRef, glowRef }) {
  const { viewport } = useThree()
  const mainRef = useRef()
  const extraRefs = useRef([])

  const mainFrame = useMemo(() => makeFrameMaterial(themes3d[0].frame), [])
  const mainLens = useMemo(() => makeLensMaterial(themes3d[0].lens), [])
  const extras = useMemo(
    () => lineup3d.slice(1).map((p) => ({ ...p, frameMat: makeFrameMaterial(p.frame), lensMat: makeLensMaterial(p.lens) })),
    []
  )
  const palette = useMemo(
    () =>
      themes3d.map((t) => ({
        ...t,
        frameC: new THREE.Color(t.frame.color),
        lensC: new THREE.Color(t.lens.color),
        bgC: new THREE.Color(t.bg),
        accentC: new THREE.Color(t.accent),
      })),
    []
  )
  const tmp = useMemo(() => ({ bg: new THREE.Color(), accent: new THREE.Color() }), [])

  useFrame((state) => {
    const a = anim.current
    const t = state.clock.elapsedTime

    /* -- Color theme blend (holds each colorway, then morphs) -- */
    const i0 = Math.floor(a.theme)
    const i1 = Math.min(i0 + 1, palette.length - 1)
    const f = smoothstep(0.3, 0.7, a.theme - i0)
    const A = palette[i0]
    const B = palette[i1]
    mainFrame.color.lerpColors(A.frameC, B.frameC, f)
    mainFrame.metalness = lerp(A.frame.metalness, B.frame.metalness, f)
    mainFrame.roughness = lerp(A.frame.roughness, B.frame.roughness, f)
    mainLens.color.lerpColors(A.lensC, B.lensC, f)
    mainLens.metalness = lerp(A.lens.metalness, B.lens.metalness, f)
    mainLens.opacity = lerp(A.lens.opacity, B.lens.opacity, f)

    tmp.bg.lerpColors(A.bgC, B.bgC, f)
    tmp.accent.lerpColors(A.accentC, B.accentC, f)
    const accentHex = `#${tmp.accent.getHexString()}`
    if (stageRef.current) {
      stageRef.current.style.backgroundColor = `#${tmp.bg.getHexString()}`
      stageRef.current.style.setProperty('--theme-accent', accentHex)
    }
    if (glowRef.current) glowRef.current.style.backgroundColor = accentHex

    /* -- Layout: responsive scale so the pair fits on phones -- */
    const portrait = viewport.aspect < 1
    const fit = Math.min(1, viewport.width / (portrait ? 3.2 : 5.2))
    const xMul = portrait ? 0.25 : 1 // keep the pair centred on phones
    const spacing = viewport.width * (portrait ? 0.62 : 0.34)
    const L = a.lineup
    const pointerX = state.pointer.x * 0.25
    const pointerY = state.pointer.y * 0.12

    // Carousel slot for item i, relative to the focused one
    const slot = (i) => {
      const d = i - a.focus
      return {
        x: d * spacing,
        scale: (0.62 - 0.2 * Math.min(Math.abs(d), 1)) * fit,
        rotY: -d * 0.55 + Math.sin(t * 0.6 + i) * 0.12,
      }
    }

    /* -- Hero pair: solo choreography → carousel slot 0 -- */
    const main = mainRef.current
    if (main) {
      const s0 = slot(0)
      const introSpin = (1 - a.intro) * -2.2
      main.position.x = lerp(a.x * viewport.width * xMul, s0.x, L)
      main.position.y = lerp(a.y, -0.05, L) + Math.sin(t * 1.2) * 0.04
      main.scale.setScalar(lerp(a.scale * fit, s0.scale, L))
      main.rotation.y = a.rotY + introSpin + L * s0.rotY + pointerX * (1 - a.explode)
      main.rotation.x = a.rotX * (1 - L) - pointerY
    }

    /* -- Other products fly in from the right, staggered -- */
    extras.forEach((_, idx) => {
      const obj = extraRefs.current[idx]
      if (!obj) return
      const i = idx + 1
      const enter = smoothstep(0, 1, clamp01(L * 1.5 - idx * 0.35))
      const s = slot(i)
      obj.visible = enter > 0.001
      obj.position.x = s.x + (1 - enter) * viewport.width
      obj.position.y = -0.05 + Math.sin(t * 1.2 + i) * 0.04
      obj.scale.setScalar(s.scale)
      obj.rotation.y = s.rotY + (1 - enter) * -2.5
    })
  })

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} castShadow />
      <spotLight position={[-4, 2, 3]} intensity={30} angle={0.5} penumbra={1} color="#ffd8a8" />

      {/* Studio reflections built from light panels — no HDR download needed */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, -2]} scale={[10, 1.5, 1]} />
        <Lightformer form="rect" intensity={2} position={[-5, 1, 1]} rotation-y={Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[5, 1, 1]} rotation-y={-Math.PI / 2} scale={[8, 2, 1]} />
        <Lightformer form="ring" intensity={4} position={[0, 0, 5]} scale={2} />
      </Environment>

      <group ref={mainRef}>
        <Sunglasses style={lineup3d[0].style} frameMaterial={mainFrame} lensMaterial={mainLens} anim={anim} showLabels />
      </group>

      {extras.map((p, idx) => (
        <group key={p.id} ref={(o) => (extraRefs.current[idx] = o)} visible={false}>
          <Sunglasses style={p.style} frameMaterial={p.frameMat} lensMaterial={p.lensMat} />
        </group>
      ))}

      <ContactShadows position={[0, -1.15, 0]} opacity={0.55} scale={12} blur={2.6} far={3} resolution={512} />
    </>
  )
}

/* ------------------------------------------------------------------ */
/*  Scroll section: sticky stage + GSAP timeline + HTML overlays        */
/* ------------------------------------------------------------------ */
export default function Experience3D({ ready }) {
  const wrapRef = useRef(null)
  const stageRef = useRef(null)
  const glowRef = useRef(null)
  const headlineRef = useRef(null)
  const anim = useRef({ intro: 0, explode: 0, x: 0.12, y: 0.35, scale: 0.85, rotY: -0.35, rotX: 0.12, theme: 0, lineup: 0, focus: 0 })

  const [chapter, setChapter] = useState(0)
  const [themeIdx, setThemeIdx] = useState(0)
  const [focusIdx, setFocusIdx] = useState(0)

  // Scroll-scrubbed choreography (timeline units ≈ "beats", total 10)
  useGSAP(
    () => {
      const a = anim.current
      const q = gsap.utils.selector(wrapRef)
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
        onUpdate: () => {
          const time = tl.time()
          setChapter(time < 1.6 ? 0 : time < 4.6 ? 1 : time < 7.3 ? 2 : 3)
          setThemeIdx(Math.round(a.theme))
          setFocusIdx(Math.round(a.focus))
        },
      })

      // 01 — Hero: pair spins a full turn and glides right, giant wordmark drifts
      tl.to(a, { rotY: Math.PI * 2 - 0.35, x: 0.2, y: 0, scale: 0.8, ease: 'power1.inOut', duration: 1.5 }, 0)
        .to(q('.hero-copy'), { autoAlpha: 0, y: -60, filter: 'blur(8px)', duration: 0.6 }, 0)
        .to(q('.hero-wordmark'), { scale: 1.25, autoAlpha: 0, duration: 1.4 }, 0)

      // 02 — Colorways: theme morphs Amber → Obsidian → Gold → Emerald
        .fromTo(q('.chapter-color'), { autoAlpha: 0, x: -40 }, { autoAlpha: 1, x: 0, duration: 0.4 }, 1.3)
        .to(a, { theme: themes3d.length - 1, duration: 3 }, 1.5)
        .to(a, { rotY: `+=${Math.PI * 2}`, rotX: 0.25, duration: 3 }, 1.5)
        .to(q('.chapter-color'), { autoAlpha: 0, x: -40, duration: 0.3 }, 4.4)

      // 03 — Anatomy: centre stage, explode into parts, labels, snap back together
        .to(a, { x: 0, y: -0.2, scale: 0.85, rotY: `+=${0.7}`, rotX: 0.35, ease: 'power2.inOut', duration: 0.8 }, 4.6)
        .fromTo(q('.chapter-anatomy'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 4.9)
        .to(a, { explode: 0.8, ease: 'power2.inOut', duration: 1 }, 5.2)
        .to(a, { explode: 0, ease: 'power2.inOut', duration: 0.8 }, 6.5)
        .to(q('.chapter-anatomy'), { autoAlpha: 0, y: -30, duration: 0.3 }, 7.1)

      // 04 — Lineup: hero pair shifts into the carousel, other products slide in
        .to(a, { lineup: 1, rotY: `-=${0.7}`, ease: 'power2.inOut', duration: 1 }, 7.4)
        .fromTo(q('.chapter-lineup'), { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 7.9)
        .to(a, { focus: lineup3d.length - 1, ease: 'power1.inOut', duration: 1.8 }, 8.4)
        .to({}, { duration: 0.3 }) // short hold before the section scrolls away
    },
    { scope: wrapRef }
  )

  // Intro: parts fly in and assemble, headline splits in letter by letter
  useGSAP(
    () => {
      if (!ready) return
      gsap.to(anim.current, { intro: 1, duration: 2.6, ease: 'power2.out', delay: 0.15 })

      const split = SplitText.create(headlineRef.current, { type: 'chars,words' })
      gsap.set(headlineRef.current, { visibility: 'visible' })
      gsap.from(split.chars, { yPercent: 110, rotateX: -60, opacity: 0, stagger: 0.025, duration: 1, ease: 'power3.out', delay: 0.9 })
      gsap.from('.hero-fade', { opacity: 0, y: 20, stagger: 0.12, duration: 0.8, delay: 1.4 })
      return () => split.revert()
    },
    { dependencies: [ready], scope: wrapRef }
  )

  const scrollToCollection = () => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })
  const focused = lineup3d[focusIdx]

  return (
    <section ref={wrapRef} className="relative" style={{ height: '720vh' }}>
      <div ref={stageRef} className="sticky top-0 h-screen w-full overflow-hidden grain-overlay" style={{ backgroundColor: themes3d[0].bg }}>
        {/* Accent halo — recoloured every frame by the theme blend */}
        <div ref={glowRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vmin] h-[70vmin] rounded-full opacity-25 blur-[120px] pointer-events-none" />

        {/* Giant outline wordmark behind the model */}
        <div className="hero-wordmark absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <span className="font-accent font-black text-[24vw] leading-none tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)]">
            VANTA
          </span>
        </div>

        <Canvas className="!absolute inset-0" dpr={[1, 1.75]} camera={{ position: [0, 0.15, 6], fov: 35 }} gl={{ antialias: true }} shadows>
          <Suspense fallback={null}>
            <Scene anim={anim} stageRef={stageRef} glowRef={glowRef} />
          </Suspense>
        </Canvas>

        {/* 01 — Hero copy */}
        <div className="hero-copy absolute inset-x-0 bottom-0 z-20 px-6 md:px-12 pb-10 md:pb-14 flex flex-col md:flex-row md:items-end justify-between gap-6 pointer-events-none">
          <div className="max-w-3xl">
            <div className="hero-fade inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-5 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[var(--theme-accent)]" />
              <span className="text-xs uppercase tracking-[0.25em] text-zinc-300 font-mono">New 2026 Architectural Drop</span>
            </div>
            <h1 ref={headlineRef} className="invisible text-[2.2rem] sm:text-5xl md:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.02] [perspective:600px]">
              {site.tagline}
            </h1>
            <p className="hero-fade text-base md:text-lg text-zinc-400 mt-4 max-w-md">{site.subtitle}</p>
          </div>
          <div className="hero-fade flex items-center gap-4 pointer-events-auto">
            <button
              onClick={scrollToCollection}
              className="group px-7 py-3.5 rounded-full bg-[var(--theme-accent)] text-black font-semibold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-transform"
            >
              Explore Collection
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </button>
            <span className="hidden md:block text-xs font-mono uppercase tracking-widest text-zinc-500">Scroll to explore</span>
          </div>
        </div>

        {/* 02 — Colorways */}
        <div className="chapter-color invisible absolute z-20 left-6 md:left-12 bottom-10 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-xs pointer-events-none">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">02 — Colorways</p>
          <h2 key={themeIdx} className="theme-name text-3xl md:text-6xl font-display font-extrabold text-white leading-tight">
            {themes3d[themeIdx].name}
          </h2>
          <ul className="mt-5 md:mt-8 space-y-2 md:space-y-3">
            {themes3d.map((t, i) => (
              <li key={t.id} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i === themeIdx ? 'text-white translate-x-2' : 'text-zinc-600'}`}>
                <span
                  className={`w-4 h-4 rounded-full border border-white/20 transition-transform duration-500 ${i === themeIdx ? 'scale-125' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${t.frame.color} 50%, ${t.lens.color} 50%)` }}
                />
                {t.name}
              </li>
            ))}
          </ul>
        </div>

        {/* 03 — Anatomy (part labels are rendered in 3D by <Sunglasses showLabels />) */}
        <div className="chapter-anatomy invisible absolute z-20 inset-x-0 top-24 md:top-28 text-center px-6 pointer-events-none">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">03 — Anatomy</p>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white">
            Nine parts. <span className="text-[var(--theme-accent)]">Zero compromise.</span>
          </h2>
        </div>

        {/* 04 — Lineup */}
        <div className="chapter-lineup invisible absolute z-20 inset-x-0 top-24 md:top-28 text-center px-6 pointer-events-none">
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-3">04 — The Lineup</p>
          <h2 className="text-4xl md:text-6xl font-display font-extrabold text-white">Find your silhouette.</h2>
        </div>
        <div className="chapter-lineup invisible absolute z-20 inset-x-0 bottom-10 md:bottom-14 flex flex-col items-center gap-3 pointer-events-none">
          <p key={focused.id} className="theme-name text-2xl md:text-3xl font-display font-bold text-white">{focused.name}</p>
          <p className="font-accent text-lg text-[var(--theme-accent)]">₹{focused.price.toLocaleString()}</p>
          <div className="flex gap-2 mt-1">
            {lineup3d.map((p, i) => (
              <span key={p.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === focusIdx ? 'w-8 bg-white' : 'w-1.5 bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Chapter progress rail */}
        <nav className={`hidden md:flex absolute z-20 right-8 top-1/2 -translate-y-1/2 flex-col gap-4 pointer-events-none transition-opacity duration-500 ${chapter === 3 ? "opacity-0" : ""}`}>
          {CHAPTERS.map((name, i) => (
            <div key={name} className={`flex items-center justify-end gap-3 text-[11px] font-mono uppercase tracking-widest transition-colors duration-500 ${i === chapter ? 'text-white' : 'text-zinc-600'}`}>
              <span>{name}</span>
              <span className={`h-px transition-all duration-500 ${i === chapter ? 'w-10 bg-[var(--theme-accent)]' : 'w-4 bg-zinc-700'}`} />
            </div>
          ))}
        </nav>
      </div>
    </section>
  )
}
