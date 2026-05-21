"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const navLinks = [
  { href: "#about", label: "연구소 소개" },
  { href: "#research", label: "연구 활동" },
  { href: "#publications", label: "출판물" },
  { href: "#schedule", label: "연구일정" },
  { href: "#support", label: "후원하기" },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
      setIsMobileMenuOpen(false)
    }
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}
    >
      {/* Turbopack 구문 오류 방지를 위해 dangerouslySetInnerHTML 사용 */}
      <style dangerouslySetInnerHTML={{ __html: `
        .logo-triangle-tl {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 18px 18px 0 0;
          border-color: #1E3A8A transparent transparent transparent;
        }
        .logo-triangle-br {
          width: 0;
          height: 0;
          border-style: solid;
          border-width: 0 0 18px 18px;
          border-color: transparent transparent #1E3A8A transparent;
        }
      `}} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* 로고 영역 */}
          <div className="flex items-center gap-3">
            
            {/* 4분할 격자 심볼 (정확히 정렬된 2x2 구조) */}
            <div className="flex h-10 w-10 flex-col justify-between transition-transform duration-300 hover:scale-105 cursor-pointer">
              
              {/* 상단 레이어 (좌상 삼각형, 우상 각진 사각형) */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 좌상단(TL): 삼각형 */}
                <div className="h-full w-[45%] flex items-start justify-start">
                  <div className="logo-triangle-tl" />
                </div>
                {/* 우상단(TR): 각진 사각형 (rounded 제거) */}
                <div className="h-full w-[45%] bg-[#1E3A8A]" />
              </div>
              
              {/* 하단 레이어 (좌하 각진 사각형, 우하 삼각형) */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 좌하단(BL): 각진 사각형 (rounded 제거) */}
                <div className="h-full w-[45%] bg-[#1E3A8A]" />
                {/* 우하단(BR): 삼각형 */}
                <div className="h-full w-[45%] flex items-end justify-end">
                  <div className="logo-triangle-br" />
                </div>
              </div>

            </div>

            {/* 연구소 명칭 */}
            <div>
              <div className="text-xl font-bold text-primary">한국본회퍼연구소</div>
              <div className="text-xs text-muted-foreground">Bonhoeffer Research Institute of Korea</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="nav-link relative text-lg font-medium text-foreground transition-colors hover:text-primary"
              >
