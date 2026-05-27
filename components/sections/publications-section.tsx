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
  const [isVisible, setIsVisible] = useState(false)
  
  const sectionRef = useRef<HTMLDivElement>(null)

  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  const books = [...baseBooks, ...baseBooks, ...baseBooks]

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.2 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const moveSlider = useCallback((direction: 1 | -1) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + direction)
    setActiveBookIndex(null)
  }, [isTransitioning])

  // 핵심 수정: 트랜지션 완료 직후, 범위 밖일 경우 transition을 끄지 않고 
  // 즉시 인덱스만 바꿔치기합니다. (React의 렌더링 주기를 활용)
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= 1 || currentIndex >= books.length - 2) {
      setCurrentIndex(baseBooks.length + (currentIndex % baseBooks.length))
    }
  }

  return (
    <section id="publications" ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className={`mb-16 text-center transition-all duration-1000 transform ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-500 overflow-hidden relative" />
        </div>

        <div className="relative group mx-auto w-full max-w-6xl">
          <div className="overflow-hidden py-10">
            <div 
              // 항상 duration-500을 유지하여 일관된 움직임을 보장합니다.
              className={`flex items-center duration-500 ease-out ${isTransitioning ? "transition-transform" : ""}`}
              style={{ transform: `translateX(calc(-${currentIndex * 33.33}% + 33.33%))` }}
              onTransitionEnd={handleTransitionEnd}
            >
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx
                const isActive = activeBookIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4">
                    <div className={`transition-all duration-500 transform ${isCenter ? "scale-125 opacity-100 z-10" : "scale-[0.85] opacity-70"}`}>
                      <div className="relative w-[260px] h-[420px] cursor-pointer overflow-hidden shadow-2xl bg-transparent" onClick={() => idx !== currentIndex && moveSlider(idx > currentIndex ? 1 : -1)}>
                        <img src={book.imageSrc} alt={book.title} className="w-full h-full object-fill [image-rendering:high-quality]" />
                        <div className={`absolute -inset-[1px] bg-stone-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out ${isCenter && isActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
                          <p className="text-white font-serif text-sm font-medium text-center">{book.title}</p>
                          <a href={book.purchaseLink} className={btnClass} target="_blank" rel="noopener noreferrer">종이책</a>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <button onClick={() => moveSlider(-1)} className={`${navBtnClass} -left-4 md:-left-16`}>‹</button>
          <button onClick={() => moveSlider(1)} className={`${navBtnClass} -right-4 md:-right-16`}>›</button>
        </div>
      </div>
    </section>
  )
}
