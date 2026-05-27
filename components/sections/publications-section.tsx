"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"

export function PublicationsSection() {
  const isFirstHoverRef = useRef<boolean>(true)
  const [currentIndex, setCurrentIndex] = useState(3)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  const books = [...baseBooks, ...baseBooks, ...baseBooks]

  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isTransitioning || currentIndex === targetIdx) return
    setIsTransitioning(true)
    setCurrentIndex(targetIdx)
    setActiveBookIndex(null)
  }, [isTransitioning, currentIndex])

  const handleMouseEnter = (idx: number) => {
    if (isMobile || !isFirstHoverRef.current || currentIndex === idx) return
    isFirstHoverRef.current = false
    jumpToIndex(idx)
  }

  const handleMouseLeave = () => {
    isFirstHoverRef.current = true
  }

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= 2) setCurrentIndex(currentIndex + 3)
    else if (currentIndex >= 6) setCurrentIndex(currentIndex - 3)
  }

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => {
      window.removeEventListener("resize", checkSize)
      observer.disconnect()
    }
  }, [])

  const transformX = isMobile ? `-${currentIndex * 100}%` : `calc(-${currentIndex * 33.33}% + 33.33%)`

  return (
    <section id="publications" ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="mb-20 text-center transition-all duration-1000 transform" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? "translateY(0)" : "translateY(30px)" }}>
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-500 overflow-hidden relative">
            <div className="absolute inset-0 animate-pulse bg-white/80" />
          </div>
        </div>

        <div className="overflow-hidden py-10">
          <div 
            className="flex items-center transition-transform duration-500 ease-out"
            style={{ transform: `translateX(${transformX})` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {books.map((book, idx) => {
              const isCenter = currentIndex === idx
              const isActive = activeBookIndex === idx
              return (
                <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4">
                  <div 
                    // 가운데 책은 scale-125로 확대, 양옆은 scale-75로 축소하여 강조
                    className={`transition-all duration-500 transform ${isCenter ? "scale-125 opacity-100 z-10" : "scale-75 opacity-70"}`}
                    onMouseEnter={() => handleMouseEnter(idx)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div 
                      className="relative w-[260px] h-[390px] cursor-pointer overflow-hidden shadow-2xl bg-transparent"
                      onClick={(e) => { e.stopPropagation(); setActiveBookIndex(isActive ? null : idx) }}
                    >
                      <img src={book.imageSrc} alt={book.title} className="w-full h-full object-contain" />
                      
                      <div className={`absolute inset-0 bg-stone-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out 
                        ${isCenter && isActive ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}`}>
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

        <div className="mt-16 flex justify-center gap-2">
          {baseBooks.map((_, idx) => (
            <div key={idx} className={`h-1.5 rounded-full transition-all duration-300 ${currentIndex % 3 === idx ? "w-8 bg-amber-500" : "w-2 bg-stone-600"}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
