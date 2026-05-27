"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/40 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-5xl md:text-6xl select-none cursor-pointer"

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isFirstHoverRef = useRef<boolean>(true) // 💡 첫 진입 판별 플래그
  
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

  // ... (이전과 동일한 useEffect 및 핸들러 로직)

  const handleMouseEnterToJump = (targetIdx: number) => {
    if (isMobile || isTransitioning || currentIndex === targetIdx) return
    
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    
    if (isFirstHoverRef.current) {
      isFirstHoverRef.current = false
      jumpToIndex(targetIdx) // 💡 첫 번째는 딜레이 없이 즉시 이동
      
      hoverTimeoutRef.current = setTimeout(() => {
        const nextIdx = targetIdx < currentIndex ? targetIdx - 1 : targetIdx + 1
        jumpToIndex(nextIdx)
      }, 2000)
    } else {
      hoverTimeoutRef.current = setTimeout(() => {
        jumpToIndex(targetIdx) // 💡 2회차부터는 2초 딜레이
      }, 2000)
    }
  }

  const handleMouseLeaveFromCard = () => {
    isFirstHoverRef.current = true // 💡 커서 나가면 다시 첫 진입 상태로 초기화
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)
    if (isDragging) handleEnd()
  }

  // ... (기타 핸들러)

  return (
    <section id="publications" ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 select-none">
      {/* ... 배경 생략 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ... 타이틀 생략 */}
        
        <div className="relative group mx-auto w-full max-w-6xl px-8 py-4">
          <div className="overflow-hidden w-full py-10">
            <div className="flex items-center w-full" style={{ transform: `translate3d(${transformX}, 0, 0)`, transition: isTransitioning ? "transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)" : "none" }} /*...이벤트핸들러*/>
              {books.map((book, idx) => {
                const isCenter = currentIndex === idx
                return (
                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4 md:px-6">
                    <div 
                      className={`group/card flex flex-col items-center justify-center transition-all duration-500 transform ${isMobile ? "scale-100 opacity-100" : isCenter ? "scale-115 opacity-100 z-10" : "scale-90 opacity-65 blur-[0.3px]"}`} 
                      onMouseEnter={() => handleMouseEnterToJump(idx)}
                      onMouseLeave={handleMouseLeaveFromCard}
                    >
                      {/* 💡 2번 보완: 고정된 크기의 컨테이너를 사용하여 이미지와 음영 영역을 1:1로 일치시킴 */}
                      <div className="relative w-[260px] md:w-[280px] aspect-[2/3] overflow-hidden">
                        <img src={book.imageSrc} alt={book.title} className="w-full h-full object-contain" />
                        
                        {/* 💡 2번 보완: absolute inset-0 으로 이미지와 크기 완벽 일치 */}
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
        </div>
      </div>
    </section>
  )
}
