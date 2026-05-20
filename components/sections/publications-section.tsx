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

  // 박사님의 소중한 출판물 데이터 구조 정의 (불필요한 텍스트를 제거하고 링크와 이미지만 매칭)
  const books: PublicationBook[] = [
    {
      title: "하나님과 함께 (초판)",
      imageSrc: "images/with.jpg", // 실제 프로젝트 내 이미지 경로에 맞춤
      purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386"
    },
    {
      title: "그리스도를 따라서 Vol. 1",
      imageSrc: "images/vol1.jpg",
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719" // 해당 도서의 고유 몰 링크로 대체 가능
    },
    {
      title: "하나님과 함께 (전면개정판)",
      imageSrc: "images/withr.jpg",
      purchaseLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681"
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
        .book-motion-card {
          opacity: 0;
        }
        .publications-grid.visible .book-motion-card {
          animation: bookFadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 타이틀 */}
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

        {/* 출판물 카드 그리드 영역 */}
        <div className={`publications-grid grid gap-10 md:grid-cols-2 lg:grid-cols-3 ${isVisible ? "visible" : ""}`}>
          {books.map((book, index) => (
            <div
              key={index}
              className="book-motion-card flex flex-col items-center rounded-3xl bg-white p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-stone-200/60"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* 이미지 영역: 주변 텍스트 가림 처리를 없애고 이미지만 온전히 돋보이도록 마진 조정 */}
              <div className="relative w-full overflow-hidden rounded-2xl bg-stone-50 aspect-[3/4] flex items-center justify-center border border-stone-100">
                <img
                  src={book.imageSrc}
                  alt={book.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-103"
                  loading="lazy"
                />
              </div>

              {/* 버튼 영역: 중간 텍스트 소개글을 전부 탈락시키고 즉시 구매하기 버튼 배치 */}
              <div className="mt-8 w-full">
                <a
                  href={book.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center rounded-xl border border-stone-300 bg-white py-3.5 text-sm font-medium text-stone-700 hover:bg-stone-950 hover:text-white hover:border-stone-950 transition-all duration-200 active:scale-98 shadow-sm"
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
