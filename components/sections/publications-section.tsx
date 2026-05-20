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

  // 박사님의 새로운 이미지 경로 및 구매 링크 데이터 완전 매칭
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
        .book-pure-card {
          opacity: 0;
        }
        .publications-grid.visible .book-pure-card {
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

        {/* 출판물 정렬 그리드 구역 (80% 크기 컴팩트 레이아웃) */}
        <div className="flex justify-center w-full">
          <div className={`publications-grid grid gap-10 grid-cols-1 md:grid-cols-3 w-full max-w-4xl ${isVisible ? "visible" : ""}`}>
            {books.map((book, index) => (
              <div
                key={index}
                className="book-pure-card flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* [이미지 자체를 링크로 일체화]
                  - 버튼 없이 책 이미지를 누르면 각 구매 사이트로 안전하게 창이 열립니다.
                  - h-[400px] 고정 높이와 object-contain 구조로 세 권의 책 크기가 완벽히 통일됩니다.
                */}
                <a
                  href={book.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative w-full h-[400px] flex items-center justify-center overflow-hidden rounded-xl cursor-pointer"
                  title={`${book.title} 구매페이지로 이동`}
                >
                  <img
                    src={book.imageSrc}
                    alt={book.title}
                    className="h-full w-auto object-contain drop-shadow-md transition-transform duration-500 hover:scale-103"
                    loading="lazy"
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
