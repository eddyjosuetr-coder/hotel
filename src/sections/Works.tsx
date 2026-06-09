import { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { rooms, type Room } from '../data/rooms'

gsap.registerPlugin(ScrollTrigger)

interface WorksProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  onSelectRoom: (id: string) => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Works({ scrollRef: _scrollRef, onSelectRoom }: WorksProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef<(HTMLCanvasElement | null)[]>([])
  const imageLoadedRef = useRef<boolean[]>(new Array(rooms.length).fill(false))
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(rooms.length).fill(null))
  const strengthRef = useRef(0)
  const prevScrollYRef = useRef(0)
  const randsRef = useRef<number[][]>([])

  useEffect(() => {
    if (randsRef.current.length === 0) {
      randsRef.current = rooms.map(() => [Math.random(), Math.random(), Math.random(), Math.random()])
    }
  }, [])

  const setCanvasRef = useCallback((el: HTMLCanvasElement | null, index: number) => {
    canvasRefs.current[index] = el
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from('.work-item', {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    rooms.forEach((room, i) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        imagesRef.current[i] = img
        imageLoadedRef.current[i] = true
        const canvas = canvasRefs.current[i]
        if (canvas) {
          const rect = canvas.parentElement?.getBoundingClientRect()
          if (rect) {
            canvas.width = rect.width * Math.min(window.devicePixelRatio, 2)
            canvas.height = rect.height * Math.min(window.devicePixelRatio, 2)
          }
          drawImage(canvas, img, 0, randsRef.current[i])
        }
      }
      img.src = room.img
    })
  }, [])

  useEffect(() => {
    let rafId: number
    const animate = () => {
      const scrollY = window.scrollY
      const scrollDelta = scrollY - prevScrollYRef.current
      const dt = 1 / 60

      const targetStrength = (Math.abs(scrollDelta) * 10) / window.innerHeight
      strengthRef.current *= Math.exp(-dt * 25)
      strengthRef.current += Math.min(targetStrength, 1.2)
      const strength = Math.min(0.35, strengthRef.current)

      canvasRefs.current.forEach((canvas, i) => {
        if (!canvas || !imagesRef.current[i]) return

        if (Math.random() > Math.exp(-dt * 25 * (1 + strength))) {
          randsRef.current[i] = [Math.random(), Math.random(), Math.random(), Math.random()]
        }

        drawImage(canvas, imagesRef.current[i]!, strength, randsRef.current[i])
      })

      prevScrollYRef.current = scrollY
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      canvasRefs.current.forEach((canvas, i) => {
        if (!canvas || !canvas.parentElement) return
        const rect = canvas.parentElement.getBoundingClientRect()
        const dpr = Math.min(window.devicePixelRatio, 2)
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
        if (imagesRef.current[i]) {
          drawImage(canvas, imagesRef.current[i]!, 0, randsRef.current[i])
        }
      })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <section
      id="works"
      ref={sectionRef}
      className="bg-zinc-100 py-32 px-5 md:px-[4vw] lg:px-[60px]"
    >
      <div className="max-w-[1560px] mx-auto">
        <div className="flex justify-between items-baseline mb-16 pb-5 border-b border-zinc-900">
          <h2 className="text-[clamp(36px,5vw,64px)] font-light tracking-tight leading-none text-zinc-950">
            Rooms &amp; Residences
          </h2>
          <span className="text-xs tracking-[0.18em] text-zinc-500 uppercase">
            Featured Stays
          </span>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 gap-0.5"
        >
          {rooms.map((room, i) => (
            <RoomCard
              key={room.id}
              room={room}
              index={i}
              setCanvasRef={setCanvasRef}
              onClick={() => onSelectRoom(room.id)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function RoomCard({
  room,
  index,
  setCanvasRef,
  onClick,
}: {
  room: Room
  index: number
  setCanvasRef: (el: HTMLCanvasElement | null, index: number) => void
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="work-item group block text-left bg-white border border-zinc-900 p-0 cursor-pointer overflow-hidden relative"
    >
      <div className="relative w-full pb-[56.25%] overflow-hidden bg-zinc-200">
        <canvas
          ref={(el) => setCanvasRef(el, index)}
          className="absolute inset-0 w-full h-full block transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex justify-between items-center gap-4 px-6 py-5 border-t border-zinc-900 bg-white transition-colors duration-300 group-hover:bg-zinc-50">
        <div>
          <p className="text-[11px] tracking-[0.2em] text-zinc-500 uppercase mb-1.5 font-medium">
            {room.id} · {room.client}
          </p>
          <p className="text-lg font-medium tracking-[-0.01em] leading-snug text-zinc-950">
            {room.title}
          </p>
        </div>
        <span className="text-xs tracking-[0.14em] text-zinc-950 uppercase whitespace-nowrap transition-transform duration-300 group-hover:translate-x-1">
          View →
        </span>
      </div>
    </button>
  )
}

function drawImage(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement,
  strength: number,
  rands: number[]
) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const cw = canvas.width
  const ch = canvas.height

  const imgRatio = img.width / img.height
  const canvasRatio = cw / ch
  let sw = img.width
  let sh = img.height
  let sx = 0
  let sy = 0
  if (imgRatio > canvasRatio) {
    sw = img.height * canvasRatio
    sx = (img.width - sw) / 2
  } else {
    sh = img.width / canvasRatio
    sy = (img.height - sh) / 2
  }

  ctx.clearRect(0, 0, cw, ch)

  if (strength < 0.03) {
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)
    return
  }

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch)

  const numStrips = Math.floor(2 + strength * 5)
  for (let s = 0; s < numStrips; s++) {
    const stripY = Math.floor(rands[s % 4] * ch * (0.3 + s * 0.15)) % ch
    const stripH = Math.floor(2 + Math.random() * ch * 0.04 * strength)
    const offsetX = (rands[(s + 1) % 4] - 0.5) * cw * 0.08 * strength

    if (rands[(s + 2) % 4] > 0.6) {
      ctx.drawImage(canvas, 0, stripY, cw, stripH, offsetX, stripY, cw, stripH)
    }
  }

  if (strength > 0.15) {
    const shiftAmount = strength * 3
    ctx.globalCompositeOperation = 'screen'
    ctx.globalAlpha = strength * 0.2
    ctx.drawImage(canvas, shiftAmount, 0, cw, ch, 0, 0, cw, ch)
    ctx.drawImage(canvas, -shiftAmount, 0, cw, ch, 0, 0, cw, ch)
    ctx.globalCompositeOperation = 'source-over'
    ctx.globalAlpha = 1
  }

  if (strength > 0.25) {
    ctx.fillStyle = `rgba(255,255,255,${(strength - 0.25) * 0.08})`
    ctx.fillRect(0, 0, cw, ch)
  }
}
