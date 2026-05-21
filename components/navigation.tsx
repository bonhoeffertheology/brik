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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* 로고 영역 (4분할 격자 심볼 적용) */}
          <div className="flex items-center gap-3">
            
            {/* 💡 BRIK 원형 마크를 대체하는 코드로 짠 4분할 마크 */}
            <div className="flex h-11 w-11 flex-col justify-between p-[2px] transition-transform duration-300 hover:scale-105 cursor-pointer">
              {/* 상단 2개 조각 */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 왼쪽 위: 좌상단만 둥글게 */}
                <div className="h-full w-[45%] rounded-tl-[5px] bg-primary" />
                {/* 오른쪽 위: 우상단만 둥글게 */}
                <div className="h-full w-[45%] rounded-tr-[5px] bg-primary" />
              </div>
              
              {/* 하단 2개 조각 */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 왼쪽 아래: 좌하단만 둥글게 */}
                <div className="h-full w-[45%] rounded-bl-[5px] bg-primary" />
                {/* 오른쪽 아래: 우상단만 둥글게 */}
                <div className="h-full w-[45%] rounded-br-[5px] bg-primary" />
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
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="p-2 md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            isMobileMenuOpen ? "max-h-96 pb-4" : "max-h-0"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="block py-2 text-lg font-medium text-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
