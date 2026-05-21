"use client"

import { useEffect, useRef, useState } from "react"
// 1. 💡 깃허브 public/images/hero2.jpg 파일을 안전하게 직접 import 합니다.
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

  // 박사님의 새로운 이미지 경로 및 구매 링크 데이터 완전 매칭 (전자책 링크 추가)
  const books: PublicationBook[] = [
    {
      title: "하나님과 함께 (초판)",
      imageSrc: "images/with.jpg",
      purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/",
      ebookLink: "https://jelsayou.upaper.kr/content/1153861"
    },
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
      {/* 2. 💡 패럴랙스 이미지 레이어 추가 (윤곽 선명도를 위해 opacity-90 적용) */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80"
        style={{
          backgroundImage: `url(${hero2Bg.src})`,
        }}
      />

      {/* 3. 💡 책 이미지와 글씨 가독성을 높여주는 반투명 어두운 그라데이션 오버레이 막 */}
      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-900/75 to-stone-900/90" />

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

      {/* 4. 💡 relative z-10을 부여하여 글씨와 책 카드가 배경막 위로 올라오게 합니다. */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 섹션 헤더 (배경에 맞추어 텍스트 색상을 흰색/연회색 계열로 변경) */}
        <div 
          className="mb-20 text-center transition-all duration-1000 transform"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-500" />
          <p className="mt-4 font-sans text-base font-light text-stone-300">한국본회퍼연구소에서 출판한 책입니다</p>
        </div>

        {/* 출판물 정렬 그리드 구역 (80% 크기 컴팩트 레이아웃) */}
        <div className="flex justify-center w-full">
          <div className={`publications-grid grid gap-10 grid-cols-1 md:grid-cols-3 w-full max-w-4xl ${isVisible ? "visible" : ""}`}>
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
                  {/* 책 카드 영역 */}
                  <div
                    className="relative w-full h-[400px] flex items-center justify-center overflow-hidden rounded-xl cursor-pointer select-none"
                    title={`${book.title} 구매 옵션 보기`}
                  >
                    {/* 오리지널 책 이미지 */}
                    <img
                      src={book.imageSrc}
                      alt={book.title}
                      className="h-full w-auto object-contain drop-shadow-xl transition-transform duration-500 group-hover:scale-103"
                      loading="lazy"
                    />

                    {/* 💡 수정: 아래에서 살며시 올라오는 모션의 반투명 푸른색 오버레이 막 */}
                    <div 
                      className={`absolute inset-0 bg-slate-900/90 backdrop-blur-[3px] flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-out transform
                        ${isSelected 
                          ? "opacity-100 translate-y-0 visible" 
                          : "opacity-0 translate-y-6 invisible group-hover:opacity-100 group-hover:translate-y-0 group-hover:visible"}`}
                    >
                      {/* 책 제목 안내 */}
                      <p className="text-white font-serif text-lg font-medium text-center mb-2 px-2">
                        {book.title}
                      </p>

                      {/* 전자책 링크가 존재하는 경우 분기 처리 */}
                      {book.ebookLink ? (
                        <>
                          {/* 💡 수정: 테두리만 있고 오버시 배경이 흰색, 글씨가 푸른색으로 반전되는 버튼 */}
                          <a
                            href={book.purchaseLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full max-w-[160px] py-3 text-center font-sans text-sm font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            종이책
                          </a>
                          <a
                            href={book.ebookLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full max-w-[160px] py-3 text-center font-sans text-sm font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                            onClick={(e) => e.stopPropagation()}
                          >
                            전자책(eBook)
                          </a>
                        </>
                      ) : (
                        // 전자책이 없는 경우 단일 대형 버튼 노출
                        <a
                          href={book.purchaseLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full max-w-[160px] py-3 text-center font-sans text-sm font-medium text-white bg-transparent border border-white/80 rounded-lg shadow-md hover:bg-white hover:text-slate-900 transition-all duration-300"
                          onClick={(e) => e.stopPropagation()}
                        >
                          종이책
                        </a>
                      )}
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
