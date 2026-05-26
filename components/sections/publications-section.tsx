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

  // 💡 [교정] 컴파일러 에러를 유발했던 IntersectionObserver 구문을 완벽히 매칭 및 폐쇄
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

  // 외부 클릭 시 오버레이 초기화 이벤트 리스너 리셋 구문 마감 완결
  useEffect(() => {
    const handleOutsideClick = () => setActiveBookIndex(null)
    window.addEventListener("click", handleOutsideClick)
    return () => window.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <section 
      id="publications" 
      ref
