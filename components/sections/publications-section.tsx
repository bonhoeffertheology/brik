"use client"

import { useEffect, useRef, useState, useCallback } from "react"

import hero2Bg from "@/public/images/hero3.png"



interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }



const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"

const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/40 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-5xl md:text-6xl select-none cursor-pointer"



export function PublicationsSection() {

  const sectionRef = useRef<HTMLDivElement>(null)

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const isFirstHoverRef = useRef<boolean>(true)

  

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

  const [startX, setStartX] = useState(0)



  const jumpToIndex = useCallback((targetIdx: number) => {

    if (isTransitioning || currentIndex === targetIdx) return

    setIsTransitioning(true)

    setCurrentIndex(targetIdx)

  }, [isTransitioning, currentIndex])



  const moveSlider = useCallback((dir: "prev" | "next") => {

    if (isTransitioning) return

    setIsTransitioning(true)

    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))

  }, [isTransitioning])



  const handleMouseEnterToJump = (idx: number) => {

    if (isMobile || isTransitioning || currentIndex === idx) return

    

    if (isFirstHoverRef.current) {

      isFirstHoverRef.current = false

      jumpToIndex(idx)

    } else {

      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)

      hoverTimeoutRef.current = setTimeout(() => {

        jumpToIndex(idx)

      }, 2000)

    }

  }



  const handleMouseLeave = () => {

    isFirstHoverRef.current = true

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current)

  }



  const handleTransitionEnd = () => {

    setIsTransitioning(false)

    if (currentIndex <= baseBooks.length - 1) setCurrentIndex(currentIndex + baseBooks.length)

    else if (currentIndex >= baseBooks.length * 2) setCurrentIndex(currentIndex - baseBooks.length)

  }



  useEffect(() => {

    setIsMounted(true)

    const checkSize = () => setIsMobile(window.innerWidth < 768)

    checkSize()

    window.addEventListener("resize", checkSize)

    return () => window.removeEventListener("resize", checkSize)

  }, [])



  const multiplier = isMobile ? 100 : (100 / 3)

  const offset = isMobile ? 0 : (100 / 3)

  const transformX = `calc(-${currentIndex * multiplier}% + ${offset}% + ${currentTranslate}px)`



  if (!isMounted) return null



  return (

    <section id="publications" ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 select-none">

      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-80" style={{ backgroundImage: `url(${hero2Bg.src})` }} />

      <div className="absolute inset-0 bg-gradient-to-br from-stone-900/85 via-stone-900/75 to-stone-900/90" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="relative group mx-auto w-full max-w-6xl px-8 py-4">

          <div className="overflow-hidden w-full py-10">

            <div className="flex items-center w-full" style={{ transform: `translate3d(${transformX}, 0, 0)`, transition: isTransitioning ? "transform 0.4s ease-out" : "none" }} onTransitionEnd={handleTransitionEnd}>

              {books.map((book, idx) => {

                const isCenter = currentIndex === idx

                return (

                  <div key={idx} className="w-full md:w-1/3 flex-shrink-0 flex justify-center px-4 md:px-6">

                    <div 

                      className={`transition-all duration-500 transform ${isMobile ? "scale-100" : isCenter ? "scale-110 opacity-100" : "scale-90 opacity-60"}`}

                      onMouseEnter={() => handleMouseEnterToJump(idx)}

                      onMouseLeave={handleMouseLeave}

                    >

                      {/* 1. 고정 사이즈 & 2. 빈틈없는 음영 */}

                      <div className="relative w-[260px] h-[390px] overflow-hidden bg-stone-800">

                        <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover" />

                        <div className={`absolute inset-0 bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-3 p-4 transition-opacity duration-300 ${isCenter ? "opacity-100" : "opacity-0"}`}>

                          <p className="text-white font-serif text-sm font-medium">{book.title}</p>

                          <a href={book.purchaseLink} className={btnClass} target="_blank">종이책</a>

                          {book.ebookLink && <a href={book.ebookLink} className={btnClass} target="_blank">전자책</a>}

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
