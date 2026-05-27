"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-7xl md:text-9xl select-none cursor-pointer"

export function PublicationsSection() {
  const [currentIndex, setCurrentIndex] = useState(3)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  
  const sectionRef = useRef<HTMLDivElement>(null)

  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  const books = [...baseBooks, ...baseBooks, ...baseBooks]

  const moveSlider = useCallback((dir: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))
    setActiveBookIndex(null)
  }, [isTransitioning])

  const handleBookClick = (idx: number) => {
    if (idx === currentIndex) {
      setActiveBookIndex(activeBookIndex === idx ? null : idx)
    } else {
      const diff = idx - currentIndex
      if (diff === 1) moveSlider("next")
      else if (diff === -1) moveSlider("prev")
    }
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (currentTranslate < -50) moveSlider("next")
    else if (currentTranslate > 50) moveSlider("prev")
    setCurrentTranslate(0)
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= 2) setCurrentIndex(currentIndex + 3)
    else if (currentIndex >= 6) setCurrentIndex(currentIndex - 3)
  }

  return (
    <section id="publications" className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="relative group mx-auto w-full max-w-6xl">
          <div className="overflow-hidden py-10" 
            onMouseDown={(e) => { setIsDragging(true); setStartX(e.clientX) }} 
            onMouseMove={(e) => isDragging && setCurrentTranslate(e.clientX - startX)} 
            onMouseUp={handleEnd} onMouseLeave={handleEnd}
          >
            <div className="flex items-center transition-transform duration-500 ease-out" style={{ transform: `translateX(calc(-${currentIndex * 33.33}% + 33.33% + ${currentTranslate}px))` }} onTransitionEnd={handleTransitionEnd}>
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx
                const isActive = activeBookIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4">
                    <div className={`transition-all duration-500 transform ${isCenter ? "scale-125 opacity-100 z-10" : "scale-[0.85] opacity-70"}`}>
                      {/* 1. rounded-lg 삭제(직사각형) 및 2. 글씨 선명도를 위해 이미지 속성 최적화 */}
                      <div className="relative w-[260px] h-[420px] cursor-pointer overflow-hidden shadow-2xl bg-transparent" onClick={() => handleBookClick(idx)}>
                        <img 
                          src={book.imageSrc} 
                          alt={book.title} 
                          className="w-full h-full object-fill [image-rendering:high-quality]" 
                        />
                        
                        {/* 음영 레이어도 라운딩 제거 */}
                        <div className={`absolute inset-0 bg-stone-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out ${isCenter && isActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                          <p className="text-white font-serif text-sm font-medium text-center">{book.title}</p>
                          <a href={book.purchaseLink} className={btnClass} target="_blank" rel="noopener noreferrer">종이책</a>
                          {book.ebookLink && <a href={book.ebookLink} className={btnClass} target="_blank" rel="noopener noreferrer">전자책</a>}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={() => moveSlider("prev")} className={`${navBtnClass} -left-4 md:-left-16`}>‹</button>
          <button onClick={() => moveSlider("next")} className={`${navBtnClass} -right-4 md:-right-16`}>›</button>
        </div>
      </div>
    </section>
  )
}
