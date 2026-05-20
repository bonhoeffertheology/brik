"use client"

import { useEffect, useRef, useState } from "react"

interface PublicationBook {
  title: string
  imageSrc: string
}

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  // 도서 데이터 구성 (버튼이 제거됨에 따라 링크 데이터 제외)
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

        {/* 출판물 정렬 그리드 구역 */}
        <div className="flex justify-center w-full">
          {/* max-w-5xl 및 gap 조정을 통해 기존 그리드 레이아웃 대비 전체 크기를 80%로 축소 컴팩트화 */}
          <div className={`publications-grid grid gap-8 sm:gap-10 grid-cols-1 md:grid-cols-3 w-full max-w-5xl ${isVisible ? "visible" : ""}`}>
            {books.map((book, index) => (
              <div
                key={index}
                className="book-pure-card flex flex-col items-center justify-center transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                {/* [세 책의 사이즈 균일화 모델]
                  - aspect-[3/4] 고정 비율 박스를 통해 세 도서의 출력 크기를 완전히 일치시켰습니다.
                  - shadow와 미세한 라운드(rounded-2xl) 처리를 이미지 자체에만 부여하여 테두리 없이 깔끔하게 떨어집니다.
                */}
                <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 border border-stone-200/30 bg-stone-50">
                  <img
                    src={book.imageSrc}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
