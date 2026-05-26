"use client"

import { useEffect, useRef, useState } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook {
  title: string
  imageSrc: string
  purchaseLink: string // 종이책 링크
  ebookLink?: string    // 전자책 링크 (옵션)
}

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  
  // 모바일 및 클릭 인터랙션을 위해 현재 어떤 책의 오버레이가 열려있는지 관리하는 상태
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)

  const books: PublicationBook[] = [
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // 외부 클릭 시 오버레이 닫기 기능
  useEffect(() => {
    const handleOutsideClick = () => setActiveBookIndex(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <section 
      id="publications" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden py-24 md:py-32"
    >
      {/* 패럴랙스 배경 이미지 레이어 */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80"
        style={{
          backgroundImage: `url(${hero2Bg.src})`,
        }}
      />

      {/* 가독성을 위한 배경 그라데이션 막 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-900/75 to-stone-900/90" />

      {/* 💡 [수정] 노란색 바의 부드러운 색상 변화를 위한 CSS 키프레임 애니메이션 추가 */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bookFadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes barColorChange {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .book-pure-card {
          opacity: 0;
        }
        .publications-grid.visible .book-pure-card {
          animation: bookFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .moving-color-bar {
          background: linear-gradient(270deg, #f59e0b, #f5 Worth #facc15, #f59e0b);
          background-size: 200% 200%;
          animation: barColorChange 4s ease infinite;
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
          
          {/* 💡 [핵심 수정] 기존 bg-amber-500 대신 부드럽게 무지개빛으로 가변하는 'moving-color-bar' 클래스 적용 */}
          <div className="mx-auto mt-4 h-0.5 w-12 moving-color-bar rounded-full" />
          
          <p className="mt-4 font-sans text-base font-light text-stone-300">한국본회퍼연구소에서 출판한 책입니다</p>
        </div>

        {/* 출판물 정렬 그리드 구역 */}
        <div className="flex justify-center w-full">
          <div className={`publications-grid grid gap-12 grid-cols-1 md:grid-cols-3 w-full max-w-4xl ${isVisible ? "visible" : ""}`}>
            {books.map((book, index) => {
              const isSelected = activeBookIndex === index;
              
              return (
                <div
                  key={index}
                  className="book-pure-card group flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2"
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveBookIndex(isSelected ? null : index);
                  }}
                >
                  <div
                    className="relative max-w-full h-[380px] sm:h-[400px] flex items-center justify-center select-none"
                    title={`${book.title} 구매 옵션 보기`}
                  >
                    <div className="relative h-full w-auto overflow-hidden rounded-xl shadow-xl">
                      <img
                        src={book.imageSrc}
                        alt={book.title}
                        className="h-full w-auto object-contain pointer-events-none"
                        loading="lazy"
                      />

                      <div 
                        className={`absolute inset-0 bg-slate-900/95 backdrop-blur-[2px] flex flex-col items-center justify-center gap-4 p-4 transition-all duration-500 ease-out transform
                          ${isSelected 
                            ? "opacity-100 translate-y-0 visible" 
                            : "opacity-0 -translate-y-full invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible"}`}
                      >
                        <p className="text-white font-serif text-base font-medium text-center mb-1 px-2 leading-snug">
                          {book.title}
                        </p>

                        {book.ebookLink ? (
                          <>
                            <a
                              href={book.purchaseLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full max-w-[130px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                              onClick={(e) => e.stopPropagation()}
                            >
                              종이책
                            </a>
                            <a
                              href={book.ebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full max-w-[130px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
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
                            className="w-full max-w-[130px] py-2.5 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            종이책
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
