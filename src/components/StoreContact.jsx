import React, { useState } from 'react'
import { MapPin, Clock, MessageCircle, Send, Sparkles } from 'lucide-react'
import { site } from '../data/siteData'

export default function StoreContact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    const text = `*Inquiry from ${site.brand} Website*%0A*Name:* ${encodeURIComponent(
      formData.name
    )}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Message:* ${encodeURIComponent(
      formData.message || 'Looking for custom frames & lens fitment.'
    )}`

    window.open(`https://wa.me/${site.whatsapp}?text=${text}`, '_blank')
  }

  return (
    <section id="store" className="relative z-20 py-24 bg-[#101012] grain-overlay">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-[#e8a24a] uppercase tracking-widest mb-4">
            <MapPin className="w-3.5 h-3.5" />
            Flagship Studio
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white tracking-tight">
            Experience In Person.
          </h2>
          <p className="text-zinc-400 mt-4 text-base md:text-lg">
            Visit our optical design studio for personalized facial geometry scanning, custom frame sizing, and lens tint consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Studio Info & Contact Form */}
          <div className="lg:col-span-6 flex flex-col justify-between gap-8">
            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl glass-card border border-white/10">
                <MapPin className="w-5 h-5 text-[#e8a24a] mb-3" />
                <h4 className="text-sm font-bold font-display text-white mb-1">STUDIO LOCATION</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{site.address}</p>
              </div>

              <div className="p-6 rounded-2xl glass-card border border-white/10">
                <Clock className="w-5 h-5 text-[#e8a24a] mb-3" />
                <h4 className="text-sm font-bold font-display text-white mb-1">OPENING HOURS</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">{site.hours}</p>
              </div>
            </div>

            {/* Instant WhatsApp Inquiry Form */}
            <form
              onSubmit={handleSubmit}
              className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col gap-4 shadow-xl"
            >
              <h3 className="text-lg font-bold font-display text-white mb-2 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-[#e8a24a]" />
                Direct Concierge Inquiry
              </h3>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e8a24a] text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e8a24a] text-sm transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase mb-1.5">
                  Frame of Interest / Notes
                </label>
                <textarea
                  rows="3"
                  placeholder="Tell us which frame or custom prescription you'd like to try..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e8a24a] text-sm transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                className="mt-2 w-full py-3.5 px-6 rounded-xl bg-[#e8a24a] hover:bg-amber-400 text-black font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-[0_0_20px_rgba(232,162,74,0.3)] hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Send via WhatsApp</span>
              </button>
            </form>
          </div>

          {/* Right Column: Google Map Embed */}
          <div className="lg:col-span-6 rounded-3xl overflow-hidden glass-panel border border-white/10 min-h-[400px] shadow-2xl relative">
            <iframe
              title="Studio Location Google Map"
              src={site.mapEmbedUrl}
              className="w-full h-full min-h-[420px] border-0 filter invert-[90%] hue-rotate-180 contrast-125 opacity-90"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
