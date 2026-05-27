"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
// 💡 화살표의 클릭 영역(Padding)을 넓히고 텍스트 크기를 키워 시각적 개방감 확보
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/40 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-5xl md:text-6xl select-none cursor-pointer"

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  
  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  
  // 💡 데이터 배열 버퍼 최적화: 스왑 영역 안정화를 위해 곱절 배치
  const books = [...baseBooks, ...baseBooks, ...baseBooks]
  const [currentIndex, setCurrentIndex] = useState(baseBooks.length)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize(); window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  // 💡 깜빡임 원천 차단: 인덱스 변동 즉시 브라우저가 스왑하도록 동기 처리 보정
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= baseBooks.length - 1) {
      setCurrentIndex((prev) => prev + baseBooks.length)
    } else if (currentIndex >= baseBooks.length * 2) {
      setCurrentIndex((prev) => prev - baseBooks.length)
    }
  }

  const moveSlider = useCallback((dir: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))
  }, [isTransitioning])

  const handleStart = (x: number) => {
    if (isTransitioning) return
    setIsDragging(true); setStartX(x); setActiveBookIndex(null)
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

  // 💡 정밀 스크롤 연산: 모바일과 데스크톱의 인덱스 매칭 좌표 통일
  const multiplier = isMobile ? 100 : 33.3333
  const offset = isMobile ? 0 : 33.3333
  const transformX = `calc(-${currentIndex * multiplier}% + ${offset}% + ${currentTranslate}px)`

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
        
        {/* 💡 마스크 영역 확보를 위해 여백을 제어하고 가로 너비를 안정화 */}
        <div className="relative group mx-auto w-full max-w-6xl px-8 py-12">
          <div className="overflow-hidden w-full">
            <div className="flex items-center w-full will-change-transform" style={{ transform: `translate3d(${transformX}, 0, 0)`, transition: isTransitioning ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none" }} onTransitionEnd={handleTransitionEnd} onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => isDragging && setCurrentTranslate(e.clientX - startX)} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => isDragging && setCurrentTranslate(e.touches[0].clientX - startX)} onTouchEnd={handleEnd}>
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx; const isSelected = activeBookIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4 md:px-6">
                    <div className={`group/card flex flex-col items-center justify-center transition-all duration-500 transform cursor-grab active:cursor-grabbing ${isMobile ? "scale-100 opacity-100" : isCenter ? "scale-115 opacity-100 z-10" : "scale-90 opacity-30 blur-[0.5px]"}`} onClick={(e) => { e.stopPropagation(); if (!isMobile && !isCenter) { moveSlider(idx > currentIndex ? "next" : "prev"); return }; if (!isDragging && currentTranslate === 0) setActiveBookIndex(isSelected ? null : idx) }}>
                      <div className="relative w-full max-w-[260px] md:max-w-[300px] aspect-[2/3] flex items-center justify-center select-none">
                        {/* 💡 테두리 원인 제거: rounded-none 설정 및 외부 경계선 축소 */}
                        <div className="relative h-full w-full overflow-hidden shadow-2xl border border-stone-800/10 rounded-none bg-stone-950">
                          {/* 💡 가독성 확보 핵심: object-contain으로 원본 텍스트 비율 복구, 뭉개짐 및 크롭 해결 */}
                          <img src={book.imageSrc} alt={book.title} className="h-full w-full object-contain pointer-events-none rounded-none" loading="lazy" style={{ imageRendering: "auto" }} />
                          <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-500 ease-out transform ${isSelected || (!isMobile && isSelected && isCenter) ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-full invisible group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:visible"}`}>
                            <p className="text-white font-serif text-xs md:text-sm font-medium text-center mb-1 px-1 leading-snug">{book.title}</p>
                            <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className={btnClass} onClick={(e) => e.stopPropagation()}>종이책</a>
                            {book.ebookLink && <a href={book.ebookLink} target="_blank" rel="noopener noreferrer" className={btnClass} onClick={(e) => e.stopPropagation()}>전자책(eBook)</a>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          {/* 💡 폭 넓히기 반영: 슬라이더 밖 영역까지 버튼을 확장 배치하여 와이드 기획 연출 */}
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
