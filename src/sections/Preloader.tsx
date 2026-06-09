import { useEffect, useState } from 'react'

export default function Preloader() {
  const [phase, setPhase] = useState<'loading' | 'reveal' | 'done'>('loading')

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('reveal'), 600)
    const t2 = setTimeout(() => setPhase('done'), 1600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [])

  if (phase === 'done') return null

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-zinc-950 flex items-center justify-center transition-opacity duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === 'reveal' ? 'opacity-0 pointer-events-none' : 'opacity-100 pointer-events-auto'
      }`}
    >
      <span
        className={`text-[clamp(32px,8vw,80px)] font-light tracking-tight text-white transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          phase === 'loading' ? 'translate-y-10 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        LUNAMARE
      </span>
    </div>
  )
}
