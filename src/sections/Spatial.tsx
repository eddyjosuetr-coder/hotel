import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Spatial() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const ctx = gsap.context(() => {
      gsap.from(content.children, {
        y: 40,
        opacity: 0,
        duration: 1.1,
        stagger: 0.18,
        ease: 'power3.out',
        delay: 0.4,
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <section
      id="spatial"
      ref={sectionRef}
      className="relative w-full h-screen min-h-[640px] overflow-hidden bg-zinc-950"
    >
      <video
        ref={videoRef}
        src="/videos/sea-hotel.mp4"
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 to-black/55" />

      <div
        ref={contentRef}
        className="relative z-10 w-full h-full flex flex-col items-start justify-center gap-7 px-8 md:px-[4.5vw] lg:px-[72px]"
      >
        <span className="text-xs font-medium tracking-[0.28em] text-white/80 uppercase">
          Luxury Seaside Retreat · Est. 1998
        </span>

        <h1 className="text-[clamp(44px,7vw,108px)] font-light tracking-tight leading-[1.02] text-white max-w-[920px] drop-shadow-2xl text-balance">
          Where the Sea
          <br />
          Meets Stillness
        </h1>

        <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-relaxed text-white/90 max-w-[520px]">
          Nestled along a secluded stretch of coastline, LUNAMARE offers suites,
          villas, and residences shaped by salt air, open horizons, and
          unhurried time — a sanctuary for travelers who measure days by the
          tide.
        </p>

        <div className="flex flex-wrap gap-4 mt-3">
          <button
            onClick={() => document.querySelector('#hero')?.scrollIntoView({ behavior: 'smooth' })}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`text-[13px] font-medium tracking-[0.14em] px-9 py-4 cursor-pointer transition-all duration-300 uppercase border border-white ${
              hovered ? 'bg-white text-zinc-950' : 'bg-transparent text-white'
            }`}
          >
            Reserve Your Stay
          </button>
          <button
            onClick={() => document.querySelector('#works')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-[13px] font-medium tracking-[0.14em] text-white bg-transparent border-none px-2 py-4 cursor-pointer uppercase underline underline-offset-8 decoration-white/50 hover:decoration-white transition-colors"
          >
            Explore Rooms →
          </button>
        </div>
      </div>
    </section>
  )
}
