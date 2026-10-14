import React, { useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'
import { testimonials } from '../data/siteData'

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)

/**
 * Sticky stacked quote cards: each card pins near the top, the next one slides over it,
 * and the covered card shrinks and dims. Quote words light up as the card scrolls in.
 */
export default function Testimonials() {
  const rootRef = useRef(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(rootRef)

      const title = SplitText.create(q('.voices-title'), { type: 'lines', mask: 'lines' })
      gsap.from(title.lines, {
        yPercent: 110,
        duration: 1,
        stagger: 0.12,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 70%', once: true },
      })

      const splits = [title]
      const cards = q('.voice-card')
      cards.forEach((card, i) => {
        // Words brighten as the card travels up into its sticky slot
        const quote = SplitText.create(card.querySelector('.voice-quote'), { type: 'words' })
        splits.push(quote)
        gsap.fromTo(
          quote.words,
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: card, start: 'top 85%', end: 'top 30%', scrub: true },
          }
        )

        // Covered cards recede while the next one slides over them
        const next = cards[i + 1]
        if (next) {
          gsap.to(card.querySelector('.voice-inner'), {
            scale: 0.9,
            filter: 'brightness(0.4)', // dim without going see-through
            ease: 'none',
            scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true },
          })
        }
      })

      return () => splits.forEach((split) => split.revert())
    },
    { scope: rootRef }
  )

  return (
    <section ref={rootRef} className="relative z-20 bg-[#121215] border-t border-white/5 py-24 md:py-32 grain-overlay">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14 md:mb-20">
          <div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500 mb-4">Client Voices</p>
            <h2 className="voices-title text-[clamp(2.2rem,4.4vw,4.25rem)] font-display font-extrabold text-white leading-[0.95] tracking-tight">
              Worn by architects
              <br />
              <span className="text-[#e8a24a]">&amp; drivers.</span>
            </h2>
          </div>
          <p className="max-w-xs text-zinc-400">What people say after a few months of wearing their pair every day.</p>
        </div>

        <div className="space-y-8 md:space-y-10">
          {testimonials.map((t, i) => (
            <article
              key={t.name}
              className="voice-card sticky"
              style={{ top: `calc(14vh + ${i * 22}px)` }}
            >
              <div className="voice-inner origin-top relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#18181c] p-8 md:p-14 shadow-[0_-20px_60px_rgba(0,0,0,0.45)]">
                <span
                  aria-hidden="true"
                  className="absolute -top-8 right-6 md:right-12 font-display font-extrabold text-[11rem] md:text-[16rem] leading-none text-[#e8a24a]/10 select-none"
                >
                  &ldquo;
                </span>

                <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.25em] text-zinc-500">
                  <span>{String(i + 1).padStart(2, '0')} / {String(testimonials.length).padStart(2, '0')}</span>
                  <span className="text-[#e8a24a] tracking-[0.3em]" aria-label={`${t.rating} out of 5`}>
                    {'★'.repeat(t.rating)}
                  </span>
                </div>

                <blockquote className="voice-quote relative mt-8 md:mt-10 text-2xl md:text-4xl font-display font-bold text-white leading-[1.2] max-w-4xl">
                  {t.comment}
                </blockquote>

                <footer className="mt-10 md:mt-12 flex items-center gap-4">
                  <span className="w-12 h-12 rounded-full bg-[#e8a24a] text-black font-accent font-black flex items-center justify-center">
                    {t.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </span>
                  <span>
                    <span className="block text-white font-semibold">{t.name}</span>
                    <span className="block text-sm text-zinc-500">
                      {t.role} · {t.city}
                    </span>
                  </span>
                </footer>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
