"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSiteSettings, type Publication } from "@/hooks/use-site-settings"

const bgColors = ["bg-primary", "bg-secondary", "bg-accent"]

function BookIcon() {
  return (
    <svg className="h-16 w-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

export function PublicationsSection() {
  const { settings } = useSiteSettings()
  const sectionRef = useRef<HTMLDivElement>(null)
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const publications = settings.publications || []
  const minSwipeDistance = 50
  const totalBooks = publications.length

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const goToNext = useCallback(() => {
    if (totalBooks <= 0) return
    setCurrentIndex((prev) => (prev + 1) % totalBooks)
  }, [totalBooks])

  const goToPrev = useCallback(() => {
    if (totalBooks <= 0) return
    setCurrentIndex((prev) => (prev - 1 + totalBooks) % totalBooks)
  }, [totalBooks])

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrev()
    }
  }

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseStart(e.clientX)
    setIsDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    e.preventDefault()
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) {
      setIsDragging(false)
      return
    }
    const distance = mouseStart - e.clientX
    if (distance > minSwipeDistance) {
      goToNext()
    } else if (distance < -minSwipeDistance) {
      goToPrev()
    }
    setMouseStart(null)
    setIsDragging(false)
  }

  const onMouseLeave = () => {
    setMouseStart(null)
    setIsDragging(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    const section = sectionRef.current
    if (section) {
      section.addEventListener("keydown", handleKeyDown)
    }
    return () => {
      if (section) {
        section.removeEventListener("keydown", handleKeyDown)
      }
    }
  }, [goToNext, goToPrev])

  if (publications.length === 0) {
    return null
  }

  return (
    <section id="publications" ref={sectionRef} className="relative overflow-hidden bg-card py-20 md:py-28" tabIndex={0}>
      {/* Parallax Background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">주요 출판물</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Arrows */}
          {totalBooks > 3 && (
            <>
              <button
                onClick={goToPrev}
                className="absolute -left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card p-3 shadow-lg ring-1 ring-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 md:-left-6"
                aria-label="이전"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 18-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={goToNext}
                className="absolute -right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-card p-3 shadow-lg ring-1 ring-border transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-110 md:-right-6"
                aria-label="다음"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </button>
            </>
          )}

          {/* Carousel Track */}
          <div
            ref={carouselRef}
            className={`overflow-hidden ${isDragging ? "cursor-grabbing" : totalBooks > 3 ? "cursor-grab" : ""}`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {/* Render all books in a single row */}
              {publications.map((pub: Publication, index: number) => {
                const CardWrapper = pub.link ? Link : "div"
                const cardProps = pub.link
                  ? { href: pub.link, target: "_blank" as const, rel: "noopener noreferrer" }
                  : {}
                const bgColor = pub.bgColor || bgColors[index % 3]

                return (
                  <div
                    key={pub.title + index}
                    className="w-full flex-shrink-0 px-3 md:w-1/2 lg:w-1/3"
                  >
                    <CardWrapper
                      href="#"
                      {...cardProps}
                      className={`group block overflow-hidden rounded-xl bg-card shadow-md ring-1 ring-border/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl hover:ring-border ${
                        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                      } ${pub.link ? "cursor-pointer" : ""}`}
                      style={{ transitionDelay: `${index * 150}ms` }}
                    >
                      {/* Book Cover - Vertical format for 신국판 (152x225mm ratio ≈ 2:3) */}
                      <div className={`relative flex aspect-[2/3] items-center justify-center overflow-hidden ${bgColor}`}>
                        {pub.image ? (
                          <Image
                            src={
  pub.title.includes("초판") ? "/brik/images/vol1.jpg" : 
  pub.title.includes("Vol. 1") ? "/brik/images/with.jpg" : 
  pub.title.includes("개정판") ? "/brik/images/withr.jpg" : 
  (pub.image.startsWith('http') ? pub.image : pub.image.startsWith('/') ? `/brik${pub.image}` : `/brik/images/${pub.image}`)
                            }
 
                            alt={pub.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                        ) : (
                          <div className="flex flex-col items-center gap-4 animate-float">
                            <BookIcon />
                            <span className="text-lg font-serif text-white/70 text-center px-4">{pub.title}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                          {pub.title}
                        </h3>
                        {/* 저자와 출판사를 한 줄에 나란히 배치 */}
                        <p className="mb-3 flex items-center gap-2 text-sm text-accent">
                          <span className="truncate">{pub.author}</span>
                          <span className="text-muted-foreground">|</span>
                          <span className="truncate text-muted-foreground">{pub.publisher}</span>
                        </p>
                        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{pub.description}</p>
                      </div>
                    </CardWrapper>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Page Indicators */}
          {totalBooks > 3 && (
            <div className="mt-8 flex justify-center gap-2">
              {publications.map((_: Publication, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-6 bg-primary" : "w-2 bg-primary/30 hover:bg-primary/50"
                  }`}
                  aria-label={`${idx + 1}번째 책으로 이동`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
