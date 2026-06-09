import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { trpc } from '@/providers/trpc'
import { useAuth } from '@/hooks/useAuth'

const vertexShader = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`

const fragmentShader = `
precision highp float;
uniform vec2 resolution;
uniform float time;

void main() {
  vec2 coord = gl_FragCoord.xy / resolution;
  vec2 st = coord;
  coord *= 10.0;

  float len;
  for (int i = 0; i < 5; i++) {
    len = length(vec2(coord.x, coord.y));
    coord.x += cos(coord.y + sin(len)) + cos(time * 0.07) * 0.2;
    coord.y += sin(coord.x + cos(len)) + sin(time * 0.1);
  }

  len *= cos(len * 0.4);
  len -= 10.0;

  for (float i = 0.0; i < 5.0; i++) {
    len += 1.0 / abs(mod(st.x, 0.09 * i) * 200.0) * 1.0;
  }

  float r = cos(len + 0.2) * 0.4 + 0.5;
  float g = cos(len + 0.1) * 0.4 + 0.5;
  float b = cos(len - 0.05) * 0.45 + 0.55;

  vec3 color = vec3(r, g, b);
  color = smoothstep(0.1, 0.9, color);
  color *= 0.7;

  gl_FragColor = vec4(color, 1.0);
}
`

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasHostRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const uniformsRef = useRef<{ resolution: THREE.Uniform; time: THREE.Uniform }>({
    resolution: new THREE.Uniform(new THREE.Vector2(1, 1)),
    time: new THREE.Uniform(0),
  })

  const [submitHovered, setSubmitHovered] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    checkin: '',
    checkout: '',
    guests: '2',
    roomType: 'Any room',
    name: '',
    email: '',
    message: '',
  })

  const { user } = useAuth()

  // Pre-fill name and email from authenticated user
  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }))
    }
  }, [user])

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => {
      setSubmitted(true)
      setSubmitError(null)
    },
    onError: (err) => {
      setSubmitError(err.message || 'Something went wrong. Please try again.')
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvasHostRef.current
    if (!canvas || !host) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()

    const geometry = new THREE.PlaneGeometry(2, 2)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        resolution: uniformsRef.current.resolution,
        time: uniformsRef.current.time,
      },
      depthTest: false,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const handleResize = () => {
      const rect = host.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      renderer.setSize(w, h, false)
      uniformsRef.current.resolution.value.set(w, h)
    }
    handleResize()

    const ro = new ResizeObserver(handleResize)
    ro.observe(host)

    let rafId: number
    const startTime = performance.now()
    const animate = () => {
      uniformsRef.current.time.value = (performance.now() - startTime) / 1000
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(animate)
    }
    rafId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)

    if (!formData.checkin || !formData.checkout || !formData.name || !formData.email) {
      setSubmitError('Please fill in all required fields.')
      return
    }

    createReservation.mutate({
      checkInDate: formData.checkin,
      checkOutDate: formData.checkout,
      guests: formData.guests,
      roomType: formData.roomType,
      fullName: formData.name,
      email: formData.email,
      message: formData.message || undefined,
      userId: user?.id,
    })
  }

  return (
    <section
      id="hero"
      className="relative w-full min-h-[700px] bg-zinc-950 grid grid-cols-1 md:grid-cols-2"
    >
      {/* Left: shader */}
      <div
        ref={canvasHostRef}
        className="relative w-full min-h-[420px] overflow-hidden"
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block"
        />
        <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 right-6 md:right-12 z-10 pointer-events-none">
          <h2 className="text-4xl md:text-6xl lg:text-[64px] font-light tracking-tight leading-[1.02] text-white mb-4 drop-shadow-2xl max-w-[520px] text-balance">
            Plan your
            <br />
            coastal stay
          </h2>
          <p className="text-xs tracking-[0.18em] text-white/90 uppercase font-medium">
            LUNAMARE · Reservations & Inquiries
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div className="bg-zinc-950 text-white p-10 md:p-16 flex flex-col justify-center">
        <div className="max-w-[520px] w-full mx-auto">
          <p className="text-[11px] tracking-[0.24em] text-white/60 uppercase mb-4 font-medium">
            Get in touch
          </p>
          <h3 className="text-3xl md:text-[40px] font-light tracking-tight leading-[1.15] mb-10 text-balance text-white/90">
            Reserve a room or send us a note.
          </h3>

          {submitted ? (
            <div className="border border-white/20 p-8 text-[15px] leading-relaxed text-white/80 bg-white/5 backdrop-blur-sm rounded-sm">
              Thank you — our reservations team will be in touch within 24
              hours. A confirmation has been sent to your email.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {submitError && (
                <div className="border border-red-500/50 p-4 text-[13px] leading-relaxed text-red-400 bg-red-500/10 rounded-sm mb-1">
                  {submitError}
                </div>
              )}
              <Row>
                <Field label="Check-in" type="date" name="checkin" value={formData.checkin} onChange={handleChange} />
                <Field label="Check-out" type="date" name="checkout" value={formData.checkout} onChange={handleChange} />
              </Row>
              <Row>
                <Field label="Guests" type="number" name="guests" placeholder="2" min={1} value={formData.guests} onChange={handleChange} />
                <SelectField
                  label="Room type"
                  name="roomType"
                  value={formData.roomType}
                  onChange={handleChange}
                  options={[
                    'Any room',
                    'Ocean Suite',
                    'Private Villa',
                    'Horizon Loft',
                    'Beachfront Studio',
                    'Cliffside Suite',
                    'Seaview Villa',
                  ]}
                />
              </Row>
              <Field label="Full name" type="text" name="name" placeholder="Jane Doe" value={formData.name} onChange={handleChange} />
              <Field label="Email" type="email" name="email" placeholder="you@domain.com" value={formData.email} onChange={handleChange} />
              <TextareaField
                label="Message (optional)"
                name="message"
                placeholder="Occasion, dietary preferences, arrival needs…"
                value={formData.message}
                onChange={handleChange}
              />
              <button
                type="submit"
                disabled={createReservation.isPending}
                onMouseEnter={() => setSubmitHovered(true)}
                onMouseLeave={() => setSubmitHovered(false)}
                className={`mt-4 px-6 py-[18px] text-[13px] font-medium tracking-[0.16em] uppercase transition-all duration-300 border border-white ${
                  submitHovered ? 'bg-white text-zinc-950' : 'bg-transparent text-white'
                } ${createReservation.isPending ? 'opacity-60 cursor-wait' : 'cursor-pointer hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]'}`}
              >
                {createReservation.isPending ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-2 gap-5">{children}</div>
}

function Field({
  label,
  type,
  name,
  placeholder,
  min,
  value,
  onChange,
}: {
  label: string
  type: string
  name: string
  placeholder?: string
  min?: number
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
  return (
    <label className="block group">
      <span className="block text-[11px] tracking-[0.2em] text-white/60 uppercase mb-1.5 font-medium transition-colors group-focus-within:text-white/90">
        {label}
      </span>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        min={min}
        value={value}
        onChange={onChange}
        className="w-full py-3 text-[15px] bg-transparent text-white border-b border-white/30 outline-none transition-colors focus:border-white placeholder:text-white/30 rounded-none appearance-none"
        style={{ colorScheme: 'dark' }}
      />
    </label>
  )
}

function SelectField({
  label,
  name,
  options,
  value,
  onChange,
}: {
  label: string
  name: string
  options: string[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <label className="block group">
      <span className="block text-[11px] tracking-[0.2em] text-white/60 uppercase mb-1.5 font-medium transition-colors group-focus-within:text-white/90">
        {label}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full py-3 pr-5 text-[15px] bg-transparent text-white border-b border-white/30 outline-none transition-colors focus:border-white rounded-none appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt} value={opt} className="text-zinc-950 bg-white">
            {opt}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextareaField({
  label,
  name,
  placeholder,
  value,
  onChange,
}: {
  label: string
  name: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <label className="block group">
      <span className="block text-[11px] tracking-[0.2em] text-white/60 uppercase mb-1.5 font-medium transition-colors group-focus-within:text-white/90">
        {label}
      </span>
      <textarea
        name={name}
        placeholder={placeholder}
        rows={3}
        value={value}
        onChange={onChange}
        className="w-full py-3 text-[15px] bg-transparent text-white border-b border-white/30 outline-none transition-colors focus:border-white placeholder:text-white/30 resize-y rounded-none appearance-none"
      />
    </label>
  )
}
