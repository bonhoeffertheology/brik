"use client"

import { useEffect, useRef, useState } from "react"

interface PublicationBook {
  title: string
  imageSrc: string
  purchaseLink: string
}

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 도서 데이터 구성
  const books: PublicationBook[] = [
    {
      title: "하나님과 함께 (초판)",
      imageSrc: "images/with.jpg",
      purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/"
    },
    {
      title: "그리스도를 따라서 Vol. 1",
      imageSrc: "images/vol1.jpg",
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/"
    },
    {
      title: "하나님과 함께 (전면개정판)",
      imageSrc: "images/withr.jpg",
      purchaseLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681/"
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

  return (
    <section 
      id="publications" 
      ref={sectionRef} 
      className="relative w-full bg-stone-100 py-24 md:py-32"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bookFadeInUp {
          0% { opacity: 0; transform: translateY(40px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .book-unified-card {
          opacity: 0;
        }
        .publications-grid.visible .book-unified-card {
          animation: bookFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 */}
        <div 
          className="mb-20 text-center transition-all duration-1000 transform"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-600" />
          <p className="mt-4 font-sans text-base font-light text-stone-600">바른 신학의 발자취를 책으로 전합니다</p>
        </div>

        {/* 출판물 통합 배너 그리드 */}
        <div className={`publications-grid grid gap-12 md:grid-cols-2 lg:grid-cols-3 ${isVisible ? "visible" : ""}`}>
          {books.map((book, index) => (
            <div
              key={index}
              className="book-unified-card flex flex-col items-center group transition-all duration-300 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* [하나의 통합 배너 구조]: 이미지와 버튼을 하나의 외곽 레이아웃으로 결합하고 외부 흰색 테두리 배경을 원천 삭제 */}
              <div className="w-full overflow-hidden rounded-3xl shadow-md group-hover:shadow-xl transition-shadow duration-300 border border-stone-200/40 bg-white">
                
                {/* 1. 상단: 책 표지 이미지 (여백 없이 가득 채움) */}
                <div className="relative w-full flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src={book.imageSrc}
                    alt={book.title}
                    className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-101"
                    loading="lazy"
                  />
                </div>

                {/* 2. 하단: 이미지 아래에 빈틈없이 완전히 붙어 일체화된 구매하기 배너 */}
                <a
                  href={book.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-stone-900 py-4 text-sm font-medium text-white hover:bg-amber-700 transition-colors duration-200 tracking-wider"
                >
                  구매하기
                </a>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
