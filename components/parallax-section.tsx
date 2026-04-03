"use client"

import { useEffect, useRef, ReactNode } from "react"

interface ParallaxSectionProps {
  children: ReactNode
  className?: string
  speed?: number
  bgColor?: string
  bgImage?: string
  overlay?: boolean
}

export function ParallaxSection({
  children,
  className = "",
  speed = 0.5,
  bgColor,
  bgImage,
  overlay = false,
}: ParallaxSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    if (!section || !content) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const scrolled = window.scrollY
      const sectionTop = section.offsetTop
      const offset = (scrolled - sectionTop + window.innerHeight) * speed

      if (rect.top < window.innerHeight && rect.bottom > 0) {
        content.style.transform = `translateY(${offset * 0.3}px)`
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={sectionRef}
      className={`relative overflow-hidden ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {bgImage && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${bgImage})` }}
        />
      )}
      {overlay && <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/80" />}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  )
}
