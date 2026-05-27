"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/40 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-5xl md:text-6xl select-none cursor-pointer"

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstHoverRef = useRef<boolean>(true)
  
  const [isVisible, setIsVisible] = useState(false)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  
  const books = [...baseBooks, ...baseBooks, ...baseBooks]
  const [currentIndex, setCurrentIndex] = useState(baseBooks.length)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)

  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isTransitioning || currentIndex === targetIdx) return
    setIsTransitioning(true)
    setCurrentIndex(targetIdx)
  }, [isTransitioning, currentIndex])

  const moveSlider = useCallback((dir: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))
  }, [isTransitioning])

  const handleMouseEnterToJump = useCallback((targetIdx: number) => {
    if (isMobile || isTransitioning || currentIndex === targetIdx) return
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    
    if (isFirstHoverRef.current) {
      isFirstHoverRef.current = false
      jumpToIndex(targetIdx)
      hoverTimeoutRef.current = setTimeout(() => {
        const nextIdx = targetIdx < currentIndex ? targetIdx - 1 : targetIdx + 1
        jumpToIndex(nextIdx)
      }, 2000)
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        jumpToIndex(targetIdx)
      }, 2000)
    }
  }, [isMobile, isTransitioning, currentIndex, jumpToIndex])

  const handleMouseLeaveFromCard = () => {
    isFirstHoverRef.current = true
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    if (isDragging) handleEnd()
  }

  const handleStart = (x: number) => {
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(x)
    setActiveBookIndex(null)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (currentTranslate < -40) moveSlider("next")
    else if (currentTranslate > 40) moveSlider("prev")
    setCurrentTranslate(0)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= baseBooks.length - 1) setCurrentIndex(currentIndex + baseBooks.length)
    else if (currentIndex >= baseBooks.length * 2) setCurrentIndex(currentIndex - baseBooks.length)
  }

  useEffect(() => {
    setIsMounted(true)
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  const multiplier = isMobile ? 100 : (100 / 3)
  const offset = isMobile ? 0 : (100 / 3)
  const transformX = `calc(-${currentIndex * multiplier}% + ${offset}% + ${currentTranslate}px)`

  if (!isMounted) return null

  return (
    <section id="publications" ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 select-none">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-900/75 to-stone-900/90" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center transition-all duration-1000 transform" style={{ transform: isVisible ? "translateY(0)" : "translateY(30px)", opacity: isVisible ? 1 : 0 }}>
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 overflow-hidden bg-amber-500"><div className="animate-pulse bg-white/80 h-full w-full" /></div>
        </div>
        <div className="relative group mx-auto w-full max-w-6xl px-8 py-4">
          <div className="overflow-hidden w-full py-10">
            <div className="flex items-center w-full" style={{ transform: `translate3d(${transformX}, 0, 0)`, transition: isTransitioning ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none" }} onTransitionEnd={handleTransitionEnd} onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => isDragging && setCurrentTranslate(e.clientX - startX)} onMouseUp={handleEnd} onMouseLeave={handleMouseLeaveFromCard} onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => isDragging && setCurrentTranslate(e.touches[0].clientX - startX)} onTouchEnd={handleEnd}>
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4 md:px-6">
                    <div 
                      className={`group/card flex flex-col items-center justify-center transition-all duration-500 transform ${isMobile ? "scale-100 opacity-100" : isCenter ? "scale-115 opacity-100 z-10" : "scale-90 opacity-65 blur-[0.3px]"}`} 
                      onMouseEnter={() => handleMouseEnterToJump(idx)}
                      onMouseLeave={handleMouseLeaveFromCard}
                    >
                      <div className="relative w-[260px] md:w-[280px] aspect-[2/3] overflow-hidden">
                        <img src={book.imageSrc} alt={book.title} className="w-full h-full object-contain" />
                        <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-500 ${isCenter ? "opacity-0 hover:opacity-100" : "hidden"}`}>
                          <p className="text-white font-serif text-sm font-medium">{book.title}</p>
                          <a href={book.purchaseLink} className={btnClass}>종이책</a>
                          {book.ebookLink && <a href={book.ebookLink} className={btnClass}>전자책(eBook)</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={() => moveSlider("prev")} className={`${navBtnClass} -left-2 md:-left-6`}>‹</button>
          <button onClick={() => moveSlider("next")} className={`${navBtnClass} -right-2 md:-right-6`}>›</button>
        </div>
      </div>
    </section>
  )
}
