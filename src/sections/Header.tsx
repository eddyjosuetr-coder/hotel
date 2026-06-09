import { useEffect, useRef, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  scrollRef: React.MutableRefObject<{ y: number; speed: number }>
  forceLight?: boolean
}

const navItems = ['Rooms', 'Experiences', 'Contact']
const sectionIds = ['#works', '#capabilities', '#footer']

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL
  const appID = import.meta.env.VITE_APP_ID
  const redirectUri = `${window.location.origin}/api/oauth/callback`
  const state = btoa(redirectUri)

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`)
  url.searchParams.set('client_id', appID)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('response_type', 'code')
  url.searchParams.set('scope', 'profile')
  url.searchParams.set('state', state)

  return url.toString()
}

export default function Header({ scrollRef, forceLight = false }: HeaderProps) {
  const [isCompact, setIsCompact] = useState(false)
  const [overHeroRaw, setOverHeroRaw] = useState(true)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const check = () => {
      const y = scrollRef.current.y
      setIsCompact(y > 100)
      setOverHeroRaw(y < window.innerHeight * 0.85)
      rafRef.current = requestAnimationFrame(check)
    }
    rafRef.current = requestAnimationFrame(check)
    return () => cancelAnimationFrame(rafRef.current)
  }, [scrollRef])

  const overHero = overHeroRaw && !forceLight
  const { user, isAuthenticated, logout } = useAuth({ redirectPath: '/' })

  const handleNavClick = (index: number) => {
    const target = document.querySelector(sectionIds[index])
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 md:px-12 lg:px-[60px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        isCompact ? 'h-16' : 'h-[88px]'
      } ${
        overHero
          ? 'bg-transparent border-b border-white/20'
          : 'bg-white/90 backdrop-blur-md border-b border-black/10'
      }`}
    >
      <div
        className={`text-lg font-medium tracking-[0.22em] cursor-pointer transition-colors duration-500 ${
          overHero ? 'text-white' : 'text-zinc-950'
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        LUNAMARE
      </div>

      <nav className="flex items-stretch h-full">
        {navItems.map((item, i) => (
          <NavItem
            key={item}
            label={item}
            overHero={overHero}
            onClick={() => handleNavClick(i)}
          />
        ))}
        {isAuthenticated && user ? (
          <NavItem
            label="Sign Out"
            overHero={overHero}
            onClick={logout}
          />
        ) : (
          <NavItem
            label="Sign In"
            overHero={overHero}
            onClick={() => { window.location.href = getOAuthUrl() }}
          />
        )}
      </nav>
    </header>
  )
}

function NavItem({
  label,
  overHero,
  onClick,
}: {
  label: string
  overHero: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={`flex items-center justify-center px-4 md:px-6 text-[13px] font-medium tracking-[0.08em] border-none cursor-pointer whitespace-nowrap uppercase transition-colors duration-300 ${
        overHero
          ? hovered
            ? 'bg-white text-zinc-950'
            : 'bg-transparent text-white'
          : hovered
          ? 'bg-zinc-950 text-white'
          : 'bg-transparent text-zinc-950'
      }`}
    >
      {label}
    </button>
  )
}
