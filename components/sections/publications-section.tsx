"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white bg-black/40 hover:bg-black/70 border border-white/10 rounded-full transition-all duration-300 backdrop-blur-sm flex items-center justify-center font-bold text-lg"

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  
  // 💡 좌우 버퍼를 넉넉히 두어 스왑할 때 여백이 보이지 않도록 앞뒤로 2개씩 곱절 복제 (끊김 방지 핵심)
  const books = [
    baseBooks[baseBooks.length - 2], baseBooks[baseBooks.length - 1],
    ...baseBooks,
    baseBooks[0], baseBooks[1]
  ]
  
  // baseBooks 앞에 2개가 붙었으므로 초기 인덱스는 2가 됩니다.
  const [currentIndex, setCurrentIndex] = useState(2)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // 💡 애니메이션이 확실히 끝난 시점에 투명하게 순간이동을 처리하여 뚝 끊기는 현상 차단
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= 1) {
      setCurrentIndex(books.length - 3 - (1 - currentIndex))
    } else if (currentIndex >= books.length - 2) {
      setCurrentIndex(2 + (currentIndex - (books.length - 2)))
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
        
        <div className="relative group mx-auto w-full max-w-5xl overflow-hidden px-4">
          {/* 💡 브라우저의 GPU 가속을 유도하는 cubic-bezier 가속 애니메이션 매핑 */}
          <div 
            className="flex items-center w-full will-change-transform" 
            style={{ 
              transform: `translate3d(calc(-${(currentIndex - 1) * 33.333}% + ${currentTranslate}px), 0, 0)`, 
              transition: isTransitioning ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none" 
            }} 
            onTransitionEnd={handleTransitionEnd} onMouseDown={(e) => handleStart(e.clientX)} onMouseMove={(e) => isDragging && setCurrentTranslate(e.clientX - startX)} onMouseUp={handleEnd} onMouseLeave={handleEnd} onTouchStart={(e) => handleStart(e.touches[0].clientX)} onTouchMove={(e) => isDragging && setCurrentTranslate(e.touches[0].clientX - startX)} onTouchEnd={handleEnd}
          >
            {books.map((book, idx) => {
              const isCenter = currentIndex === idx; const isSelected = activeBookIndex === idx
              return (
                <div key={idx} className="w-1/3 flex-shrink-0 flex justify-center px-2 sm:px-4">
                  <div className={`group/card flex flex-col items-center justify-center transition-all duration-500 transform cursor-grab active:cursor-grabbing ${isCenter ? "scale-105 sm:scale-110 opacity-100 z-10" : "scale-90 opacity-40 blur-[1px]"}`} onClick={(e) => { e.stopPropagation(); if (!isCenter) { moveSlider(idx > currentIndex ? "next" : "prev"); return }; if (!isDragging && currentTranslate === 0) setActiveBookIndex(isSelected ? null : idx) }}>
                    <div className="relative w-full max-w-[240px] aspect-[2/3] flex items-center justify-center select-none">
                      <div className="relative h-full w-full overflow-hidden shadow-2xl border border-stone-800/50 rounded-sm">
                        <img src={book.imageSrc} alt={book.title} className="h-full w-full object-cover pointer-events-none" loading="lazy" />
                        <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 p-4 transition-all duration-500 ease-out transform ${isSelected && isCenter ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-full invisible group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:visible"}`}>
                          <p className="text-white font-serif text-sm md:text-base font-medium text-center mb-1 px-1 leading-snug">{book.title}</p>
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
          <button onClick={(e) => { e.stopPropagation(); moveSlider("prev") }} className={`${navBtnClass} left-2`} aria-label="이전">‹</button>
          <button onClick={(e) => { e.stopPropagation(); moveSlider("next") }} className={`${navBtnClass} right-2`} aria-label="다음">›</button>
        </div>

        <div className="mt-12 flex justify-center gap-2">
          {baseBooks.map((_, idx) => {
            let adj = currentIndex
            // 인덱스 표시 보정기
            if (currentIndex <= 1) adj = baseBooks.length + currentIndex - 1
            else if (currentIndex >= books.length - 2) adj = currentIndex - (books.length - 2) + 1
            else adj = currentIndex - 1
            return <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${adj - 1 === idx ? "w-6 bg-amber-500" : "w-1.5 bg-stone-600"}`} />
          })}
        </div>
      </div>
    </section>
  )
}
