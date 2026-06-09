import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const tags = ['Coastal', 'Slow Living', 'Timeless']

export default function Philosophy() {
  const sectionRef = useRef<HTMLElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const text = textRef.current
    const tagsEl = tagsRef.current
    if (!section || !text || !tagsEl) return

    const ctx = gsap.context(() => {
      gsap.from(text, {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          once: true,
        },
      })

      gsap.from(tagsEl.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
          once: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-white py-40 px-5 md:px-[4vw] lg:px-[60px]"
    >
      <div className="max-w-[1400px] mx-auto flex flex-wrap gap-20 items-start">
        <p
          ref={textRef}
          className="flex-[1_1_700px] text-[clamp(28px,4vw,60px)] font-light leading-[1.25] tracking-tight text-zinc-950 max-w-[1200px]"
        >
          We believe a true retreat is not measured in amenities, but in the
          quiet moments a place gives back to you.
        </p>

        <div
          ref={tagsRef}
          className="flex flex-col gap-3 pt-3"
        >
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[11px] font-medium tracking-[0.18em] text-zinc-950 px-[18px] py-[10px] border border-zinc-950/20 whitespace-nowrap uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
