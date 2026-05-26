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
      title: "그ريس도를 따라서 Vol. 1",
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

  // 양방향 무한 루프 구현을 위해 앞뒤로 데이터를 복제
  const books = [
    baseBooks[baseBooks.length - 1], 
    ...baseBooks,                    
    baseBooks[0]                     
  ]

  // 슬라이더 상태 관리
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
    setActiveBookIndex(null) 
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
        .animate
