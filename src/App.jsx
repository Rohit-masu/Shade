import React, { useState } from 'react'
import { useLenis } from './hooks/useLenis'
import { useFakeProgress } from './hooks/useFakeProgress'

// Components
import CustomCursor from './components/CustomCursor'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Experience3D from './components/Experience3D'
import Highlights from './components/Highlights'
import Collection3D from './components/Collection3D'
import LensTech from './components/LensTech'
import Lookbook from './components/Lookbook'
import Testimonials from './components/Testimonials'
import StoreContact from './components/StoreContact'
import Footer from './components/Footer'

export default function App() {
  // 1. Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
  useLenis()

  // 2. Loader progress (3D hero is procedural, so nothing heavy to preload yet)
  const { progress, isLoaded } = useFakeProgress()

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

      {/* Scroll-driven 3D experience: assemble → colorways → anatomy → lineup */}
      <Experience3D ready={loaderComplete} />

      {/* Scroll-velocity marquee + count-up stats */}
      <Highlights />

      {/* Interactive 3D collection: drag-to-rotate stage + product index */}
      <Collection3D />

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
