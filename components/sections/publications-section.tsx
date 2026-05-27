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
  
  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  const books = [...baseBooks, ...baseBooks, ...baseBooks]

  const moveSlider = (dir: 1 | -1) => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + dir)
  }

  // 핵심: transition을 끄지 않고, 
  // 트랜지션이 끝난 뒤에만 인덱스를 보정하여 깜빡임 제거
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= 1 || currentIndex >= books.length - 2) {
      // 강제로 위치를 옮기지 않고, 인덱스만 부드럽게 보정
      setCurrentIndex(baseBooks.length + (currentIndex % baseBooks.length))
    }
  }

  return (
    <section id="publications" className="relative w-full overflow-hidden py-24 bg-stone-900">
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="overflow-hidden py-10">
          <div 
            className="flex items-center transition-transform duration-500 ease-out"
            style={{ transform: `translateX(calc(-${currentIndex * 33.33}% + 33.33%))` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {books.map((book, idx) => {
              const isCenter = currentIndex === idx
              return (
                <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4">
                  <div className={`transition-all duration-500 transform ${isCenter ? "scale-125 opacity-100" : "scale-[0.85] opacity-70"}`}>
                    <div className="relative w-[260px] h-[420px] cursor-pointer shadow-2xl bg-transparent" onClick={() => idx !== currentIndex && moveSlider(idx > currentIndex ? 1 : -1)}>
                      <img src={book.imageSrc} alt={book.title} className="w-full h-full object-fill" />
                      <div className={`absolute -inset-[1px] bg-stone-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out ${isCenter && activeBookIndex === idx ? "opacity-100" : "opacity-0"}`}>
                        <p className="text-white text-sm">{book.title}</p>
                        <a href={book.purchaseLink} className={btnClass}>종이책</a>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <button onClick={() => moveSlider(-1)} className={navBtnClass + " left-0"}>‹</button>
        <button onClick={() => moveSlider(1)} className={navBtnClass + " right-0"}>›</button>
      </div>
    </section>
  )
}
