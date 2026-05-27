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
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => {
      window.removeEventListener("resize", checkSize)
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    }
  }, [])

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= baseBooks.length - 1) {
      setCurrentIndex(currentIndex + baseBooks.length)
    } else if (currentIndex >= baseBooks.length * 2) {
      setCurrentIndex(currentIndex - baseBooks.length)
    }
  }

  const moveSlider = useCallback((dir: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))
  }, [isTransitioning])

  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isTransitioning || currentIndex === targetIdx) return
    setIsTransitioning(true)
    setCurrentIndex(targetIdx)
  }, [isTransitioning, currentIndex])

  const handleMouseEnterToJump = (targetIdx: number) => {
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
  }

  const handleMouseLeaveFromCard = () => {
    isFirstHoverRef.current = true
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
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

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])
  
  useEffect(() => {
    const cls = () => setActiveBookIndex(null)
    window.addEventListener("click", cls)
    return () => window.removeEventListener("click", cls)
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
          <div className="mx-auto mt-4 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-pulse bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-4 font-sans text-base font-light text-stone-300">한국본회퍼연구소에서 출판한 책입니다</p>
        </div>
        
        <div className="relative group mx-auto w-full max-w-6xl px-8 py-4">
          <div className="overflow-hidden w-full py-10">
            <div className="flex items-center w-full will-change-transform" style={{ transform: `translate3d(${transformX}, 0, 0)`, transition: isTransitioning ? "transform 0.7s cubic-bezier(0.25, 1, 0.5, 1)" : "none" }} onTransitionEnd={handleTransitionEnd} onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => isDragging && setCurrentTranslate(e.clientX - startX)} onMouseUp={handleEnd} onMouseLeave={handleMouseLeaveFromCard} onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => isDragging && setCurrentTranslate(e.touches[0].clientX - startX)} onTouchEnd={handleEnd}>
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx; const isSelected = activeBookIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4 md:px-6">
                    {/* 💡 1번 보완: 양옆 카드 불투명도를 기존 opacity-15에서 opacity-65로 높여 가시성 확보 */}
                    {/* 💡 2번 보완: 데스크탑 브라우저 그래픽 가속 연산(scale 연산) 시의 폰트/선 세밀도 뭉개짐을 완화하는 backface-visibility 및 하드웨어 힌트 수식 주입 */}
                    <div 
                      className={`group/card flex flex-col items-center justify-center transition-all duration-500 transform cursor-grab active:cursor-grabbing [backface-visibility:hidden] [transform-style:preserve-3d] ${
                        isMobile 
                          ? "scale-100 opacity-100" 
                          : isCenter 
                            ? "scale-115 opacity-100 z-10 [transform:translateZ(0)_scale(1.15)]" 
                            : "scale-90 opacity-65 blur-[0.3px]"
                      }`} 
                      onClick={(e) => { e.stopPropagation(); if (!isMobile && !isCenter) { jumpToIndex(idx); return }; if (!isDragging && currentTranslate === 0) setActiveBookIndex(isSelected ? null : idx) }}
                      onMouseEnter={() => handleMouseEnterToJump(idx)}
                      onMouseLeave={handleMouseLeaveFromCard}
                    >
                      <div className="relative w-full max-w-[260px] md:max-w-[300px] aspect-[2/3] flex items-center justify-center select-none">
                        <div className="relative h-full w-full overflow-hidden border-none shadow-none rounded-none bg-transparent flex items-center justify-center">
                          
                          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                            <div className="relative w-full h-full flex items-center justify-center">
                              {/* 💡 데스크탑 모니터용 하이-콘트라스트 그래픽 렌더링 속성 강제 지정 ([image-rendering]) */}
                              <img src={book.imageSrc} alt={book.title} className="w-full h-full object-contain pointer-events-none rounded-none block [image-rendering:-webkit-optimize-contrast] [image-rendering:crisp-edges]" loading="lazy" />
                              
                              <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-700 ease-in-out transform ${
                                isCenter && (isSelected || activeBookIndex === idx) 
                                  ? "opacity-100 translate-y-0 visible" 
                                  : isCenter 
                                    ? "opacity-0 translate-y-4 invisible group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:visible"
                                    : "opacity-0 invisible pointer-events-none"
                              }`}>
                                <p className="text-white font-serif text-xs md:text-sm font-medium text-center mb-1 px-1 leading-snug">{book.title}</p>
                                <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className={btnClass} onClick={(e) => e.stopPropagation()}>종이책</a>
                                {book.ebookLink && <a href={book.ebookLink} target="_blank" rel="noopener noreferrer" className={btnClass} onClick={(e) => e.stopPropagation()}>전자책(eBook)</a>}
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); moveSlider("prev") }} className={`${navBtnClass} -left-2 md:-left-6`} aria-label="이전">‹</button>
          <button onClick={(e) => { e.stopPropagation(); moveSlider("next") }} className={`${navBtnClass} -right-2 md:-right-6`} aria-label="다음">›</button>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {baseBooks.map((_, idx) => {
            const currentNormalized = currentIndex % baseBooks.length
            return <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentNormalized === idx ? "w-6 bg-amber-500" : "w-1.5 bg-stone-600"}`} />
          })}
        </div>
      </div>
    </section>
  )
}
