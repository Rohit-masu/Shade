import React, { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { useImagePreloader } from './hooks/useImagePreloader'
import { hero } from './data/siteData'

// Components
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import HeroScroll from './components/HeroScroll'
import FeatureStrip from './components/FeatureStrip'
import ProductShowcase from './components/ProductShowcase'
import LensTech from './components/LensTech'
import Lookbook from './components/Lookbook'
import Testimonials from './components/Testimonials'
import StoreContact from './components/StoreContact'
import Footer from './components/Footer'

export default function App() {
  // 1. Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useLenis()

  // 2. Preload Hero frame sequence
  const { images, progress, isLoaded, hasRealFrames } = useImagePreloader({
    basePath: hero.framePath,
    frameCount: hero.frameCount,
    extension: hero.frameExt,
    padLength: hero.padLength,
  })

  const [loaderComplete, setLoaderComplete] = useState(false)

  return (
    <div className="min-h-screen bg-[#101012] text-white selection:bg-[#e8a24a] selection:text-black">
      {/* Custom Magnetic Cursor for Desktop */}
      <CustomCursor />

      {/* Cinematic Full-screen Preloader */}
      {!loaderComplete && (
        <Loader
          progress={progress}
          isLoaded={isLoaded}
          onComplete={() => setLoaderComplete(true)}
        />
      )}

      {/* Sticky Blur Navbar */}
      <Navbar />

      {/* Scroll-Driven Pinned 3D Hero */}
      <HeroScroll images={images} hasRealFrames={hasRealFrames} />

      {/* Value Proposition Feature Strip */}
      <FeatureStrip />

      {/* Interactive 3D Product Showcase & Variant Switcher */}
      <ProductShowcase />

      {/* Optical Lens Technology with Before/After Glare Slider */}
      <LensTech />

      {/* Campaign Editorial Lookbook with Parallax & Lightbox */}
      <Lookbook />

      {/* Client Testimonials Carousel */}
      <Testimonials />

      {/* Flagship Studio Location, Dark Google Map & WhatsApp Concierge */}
      <StoreContact />

      {/* Sleek Dark Footer */}
      <Footer />
    </div>
  )
}
