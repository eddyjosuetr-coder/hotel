import { useEffect, useRef } from 'react'
import gsap from 'gsap'

const services: { label: string; detail: string }[] = [
  { label: 'Ocean Suites', detail: 'King beds, 55m², retractable sea-facing glass facade' },
  { label: 'Private Villas', detail: 'Plunge pool, resident butler, 24-hour in-villa service' },
  { label: 'Spa & Wellness', detail: 'Seawater thermal circuit and coastal massage rituals' },
  { label: 'Coastal Dining', detail: 'Two restaurants, day-boat catch, local vineyards' },
  { label: 'Pool & Terrace', detail: '22m infinity pool, cabanas, sunset cocktail bar' },
  { label: 'Weddings & Events', detail: 'Cliffside venue for up to 120 guests' },
  { label: 'Concierge', detail: 'Yacht charters, hiking guides, and private excursions' },
  { label: 'Airport Transfer', detail: 'Chauffeured arrival from Naples and Amalfi airports' },
]

export default function Capabilities() {
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.play().catch(() => {})
  }, [])

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative overflow-hidden bg-zinc-950 px-5 md:px-[4vw] lg:px-[60px] py-[clamp(100px,12vw,160px)]"
    >
      <video
        ref={videoRef}
        src="/videos/spatial.mp4"
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black/60 z-[1]" />

      <div className="relative z-10 max-w-[1400px] mx-auto">
        {/* Top: title row */}
        <div className="flex flex-wrap items-start justify-between gap-[clamp(32px,6vw,80px)] mb-14 pb-7 border-b border-white/35">
          <div className="flex-[1_1_500px]">
            <p className="text-[11px] tracking-[0.24em] text-white/70 uppercase mb-4 font-medium">
              What we offer
            </p>
            <h2 className="text-[clamp(40px,6vw,80px)] font-light tracking-tight leading-none text-white mb-6">
              Hotel Services
            </h2>
            <p className="text-[clamp(15px,1.2vw,18px)] font-light leading-relaxed text-white/80 max-w-[640px]">
              From sunrise breakfast on your balcony to a private yacht at
              dusk, every detail of a stay at LUNAMARE is quietly arranged.
              A few of the services available to every guest:
            </p>
          </div>
          <div className="flex-[0_0_clamp(180px,22vw,280px)] aspect-square flex items-center justify-center">
            <OrbitalBadge />
          </div>
        </div>

        {/* Bullet grid */}
        <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-white/20 border border-white/20">
          {services.map((service, i) => (
            <BulletItem key={service.label} index={i} {...service} />
          ))}
        </ul>
      </div>
    </section>
  )
}

function BulletItem({
  label,
  detail,
  index,
}: {
  label: string
  detail: string
  index: number
}) {
  return (
    <li className="bg-black/55 p-7 md:p-8 flex gap-5 items-start min-h-[140px] transition-colors hover:bg-black/70">
      <span className="flex-none w-7 text-[11px] tracking-[0.14em] text-white/55 tabular-nums pt-1.5 font-medium">
        {String(index + 1).padStart(2, '0')}
      </span>
      <div className="flex-1">
        <h3 className="text-[clamp(18px,1.6vw,24px)] font-medium tracking-tight leading-[1.2] text-white mb-2">
          {label}
        </h3>
        <p className="text-sm leading-[1.55] text-white/70 m-0">
          {detail}
        </p>
      </div>
    </li>
  )
}

function OrbitalBadge() {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const pathId = `orbital-path-${Math.floor(Math.random() * 10000)}`
    const duration = 25

    const path = svg.querySelector('path')
    if (!path) return

    path.setAttribute('id', pathId)
    path.setAttribute('fill', 'none')

    const textContent = 'LUNAMARE \u2022 COASTAL RETREAT \u2022 EST. 1998 \u2022 '

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    textEl.setAttribute('fill', '#ffffff')
    textEl.setAttribute('font-family', "'Helvetica Neue', sans-serif")
    textEl.setAttribute('font-size', '18px')
    textEl.setAttribute('font-weight', '500')
    textEl.setAttribute('letter-spacing', '2px')

    const tp1 = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
    tp1.setAttribute('href', `#${pathId}`)
    tp1.setAttribute('startOffset', '0%')
    tp1.textContent = textContent

    const tp2 = document.createElementNS('http://www.w3.org/2000/svg', 'textPath')
    tp2.setAttribute('href', `#${pathId}`)
    tp2.setAttribute('startOffset', '0%')
    tp2.textContent = textContent

    textEl.appendChild(tp1)
    textEl.appendChild(tp2)
    svg.appendChild(textEl)

    const textPaths = svg.querySelectorAll('textPath')

    const tween1 = gsap.fromTo(
      textPaths[0],
      { attr: { startOffset: '0%' } },
      { attr: { startOffset: '-100%' }, duration, ease: 'none', repeat: -1 }
    )

    const tween2 = gsap.fromTo(
      textPaths[1],
      { attr: { startOffset: '100%' } },
      { attr: { startOffset: '0%' }, duration, ease: 'none', repeat: -1 }
    )

    return () => {
      tween1.kill()
      tween2.kill()
    }
  }, [])

  return (
    <div
      className="orbital-svg-container"
      style={{
        width: '100%',
        height: '100%',
        transform: 'rotate(-15deg)',
      }}
    >
      <svg
        ref={svgRef}
        viewBox="0 0 400 400"
        style={{ width: '100%', height: '100%' }}
      >
        <path
          d="M200,40 A160,160 0 1,1 199.99,40"
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.5"
          opacity="0.25"
        />
      </svg>
    </div>
  )
}
