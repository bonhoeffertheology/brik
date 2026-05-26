"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook {
  title: string
  imageSrc: string
  purchaseLink: string
  ebookLink?: string
}

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)

  // 기본 책 데이터
  const baseBooks: PublicationBook[] = [
    {
      title: "그리스도를 따라서 Vol. 1",
      imageSrc: "images/vol1.jpg",
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/"
    },
    {
      title: "하나님과 함께 (전면개정판)",
      imageSrc: "images/withr.jpg",
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/",
      ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681"
    },
    {
      title: "하나님과 함께 (초판)",
      imageSrc: "images/with.jpg",
      purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/",
      ebookLink: "https://jelsayou.upaper.kr/content/1153861"
    }
  ]

  // 양방향 무한 루프 구현을 위해 앞뒤로 데이터를 복제 (앞에 1개, 뒤에 1개 샌드위치 구조)
  const books = [
    baseBooks[baseBooks.length - 1], // [2] 하나님과 함께 (초판)
    ...baseBooks,                    // [0, 1, 2] 원래 배열
    baseBooks[0]                     // [0] 그리스도를 따라서
  ]

  // 슬라이더 상태 관리 (복제본 고려하여 초기 인덱스는 1)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  // 드래그 및 스와이프 관련 상태
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // 인덱스 이동 함수 (무한 루프 제어)
  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex === 0) {
      setCurrentIndex(books.length - 2)
    } else if (currentIndex === books.length - 1) {
      setCurrentIndex(1)
    }
  }

  const moveSlider = useCallback((direction: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (direction === "next" ? prev + 1 : prev - 1))
  }, [isTransitioning])

  // 마우스/터치 드래그 로직
  const handleStart = (clientX: number) => {
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(clientX)
    setActiveBookIndex(null) // 드래그 시 오버레이 초기화
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const currentX = clientX
    const diff = currentX - startX
    setCurrentTranslate(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    
    const swipeThreshold = 50
    if (currentTranslate < -swipeThreshold) {
      moveSlider("next")
    } else if (currentTranslate > swipeThreshold) {
      moveSlider("prev")
    }
    setCurrentTranslate(0)
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleOutsideClick = () => setActiveBookIndex(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <section 
      id="publications" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden py-24 md:py-32 select-none"
    >
      {/* 패럴랙스 배경 이미지 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80"
        style={{ backgroundImage: `url(${hero2Bg.src})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-900/75 to-stone-900/90" />

      {/* 연구업적 섹션 크로스오버 쉬머 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
        }
      `}} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 */}
        <div 
          className="mb-20 text-center transition-all duration-1000 transform"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <p className="mt-4 font-sans text-base font-light text-stone-300">한국본회퍼연구소에서 출판한 책입니다</p>
        </div>

        {/* 💡 캐러셀 메인 컨테이너 (group 클래스로 내부 화살표 호버 감지) */}
        <div className="relative group mx-auto w-full max-w-sm sm:max-w-md md:max-w-xl overflow-hidden px-4">
          
          {/* 슬라이드 트랙 구역 */}
          <div 
            className="flex"
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${currentTranslate}px))`,
              transition: isTransitioning ? "transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)" : "none"
            }}
            onTransitionEnd={handleTransitionEnd}
            
            // 데스크톱 마우스 드래그 핸들러
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            
            // 모바일 터치 스와이프 핸들러
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            {books.map((book, index) => {
              // 복제본 구조 때문에 원래 실제 매칭되는 원본 인덱스 계산
              const realIndex = (index - 1 + baseBooks.length) % baseBooks.length
              const isSelected = activeBookIndex === index

              return (
                <div 
                  key={index} 
                  className="w-full flex-shrink-0 flex justify-center px-4"
                >
                  <div
                    className="group/card flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2 cursor-grab active:cursor-grabbing"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (!isDragging && currentTranslate === 0) {
                        setActiveBookIndex(isSelected ? null : index)
                      }
                    }}
                  >
                    <div className="relative w-[260px] sm:w-[280px] h-[380px] sm:h-[400px] flex items-center justify-center select-none">
                      
                      {/* [필수 사항] 각진 직사각형 프레임 아키텍처 */}
                      <div className="relative h-full w-full overflow-hidden shadow-2xl border border-stone-800/50">
                        <img
                          src={book.imageSrc}
                          alt={book.title}
                          className="h-full w-full object-cover pointer-events-none"
                          loading="lazy"
                        />

                        {/* [필수 사항] 아래에서 위로 롤업 정렬되는 슬레이트 음영 오버레이 */}
                        <div 
                          className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out transform
                            ${isSelected 
                              ? "opacity-100 translate-y-0 visible" 
                              : "opacity-0 translate-y-full invisible group-hover/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:visible"}`}
                        >
                          <p className="text-white font-serif text-base font-medium text-center mb-2 px-2 leading-snug">
                            {book.title}
                          </p>

                          {book.ebookLink ? (
                            <>
                              <a
                                href={book.purchaseLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full max-w-[140px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                종이책
                              </a>
                              <a
                                href={book.ebookLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full max-w-[140px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                                onClick={(e) => e.stopPropagation()}
                              >
                                전자책(eBook)
                              </a>
                            </>
                          ) : (
                            <a
                              href={book.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full max-w-[140px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              종이책
                            </a>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 💡 [핵심 추가] 호버 시 부드럽게 나타나는 컨트롤 네비게이션 버튼 */}
          {/* 좌측 버튼 */}
          <button
            onClick={(e) => { e.stopPropagation(); moveSlider("prev"); }}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 border border-white/10 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="이전 책 보기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2,5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* 우측 버튼 */}
          <button
            onClick={(e) => { e.stopPropagation(); moveSlider("next"); }}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 text-white/50 hover:text-white bg-black/20 hover:bg-black/50 border border-white/10 rounded-full transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
            aria-label="다음 책 보기"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2,5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>

        {/* 하단 인덱스 도트 내비게이션 (시각적 정렬 보조) */}
        <div className="mt-8 flex justify-center gap-2">
          {baseBooks.map((_, idx) => {
            // 현재 슬라이더의 실질적인 위치 계산
            let adjustedIndex = currentIndex
            if (currentIndex === 0) adjustedIndex = baseBooks.length
            if (currentIndex === books.length - 1) adjustedIndex = 1
            
            return (
              <div 
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  adjustedIndex - 1 === idx ? "w-6 bg-amber-500" : "w-1.5 bg-stone-600"
                }`}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
