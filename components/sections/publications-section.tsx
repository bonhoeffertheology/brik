"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/40 hover:text-white bg-transparent transition-all duration-300 flex items-center justify-center font-light text-5xl md:text-6xl select-none cursor-pointer"

export function PublicationsSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [activeBookIndex, setActiveBookIndex] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  const baseBooks: PublicationBook[] = [
    { title: "그ريس도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]
  
  const books = [...baseBooks, ...baseBooks, ...baseBooks]
  const [currentIndex, setCurrentIndex] = useState(baseBooks.length)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentTranslate, setCurrentTranslate] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    const checkSize = () => setIsMobile(window.innerWidth < 768)
    checkSize()
    window.addEventListener("resize", checkSize)
    return () => window.removeEventListener("resize", checkSize)
  }, [])

  const handleTransitionEnd = () => {
    setIsTransitioning(false)
    if (currentIndex <= baseBooks.length - 1) {
      setCurrentIndex(currentIndex + baseBooks.length)
    } else if (currentIndex >= baseBooks.length * 2) {
      setCurrentIndex(currentIndex - baseBooks.length)
    }
  }

  const moveSlider = useCallback((dir: "prev" | "next") => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => (dir === "next" ? prev + 1 : prev - 1))
  }, [isTransitioning])

  const jumpToIndex = useCallback((targetIdx: number) => {
    if (isTransitioning || currentIndex === targetIdx) return
    setIsTransitioning(true)
    setCurrentIndex(targetIdx)
  }, [isTransitioning, currentIndex])

  const handleStart = (x: number) => {
    if (isTransitioning) return
    setIsDragging(true)
    setStartX(x)
    setActiveBookIndex(null)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)
    if (currentTranslate < -40) moveSlider("next")
    else if (currentTranslate > 40) moveSlider("prev")
    setCurrentTranslate(0)
  }

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setIsVisible(true) }, { threshold: 0.1 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])
  
  useEffect(() => {
    const cls = () => setActiveBookIndex(null)
    window.addEventListener("click", cls)
    return () => window.removeEventListener("click", cls)
  }, [])

  const multiplier = isMobile ? 100 : (100 / 3)
  const offset = isMobile ? 0 : (100 / 3)
  const transformX = `calc(-${currentIndex
