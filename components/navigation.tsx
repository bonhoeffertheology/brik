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
      {/* 💡 Custom Triangle Util classes defined here for compatibility with primary color */}
      <style>
        {`
          .triangle-diag-down-left {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 0 100% 100% 0; /* Creates pointing down-left triangle */
            border-color: transparent transparent transparent currentcolor; /* Fills using currentcolor, inherit from parent text-primary */
          }
          .triangle-diag-up-right {
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 100% 100% 0 0; /* Creates pointing up-right triangle */
            border-color: currentcolor transparent transparent transparent; /* Fills using currentcolor, inherit from parent text-primary */
          }
        `}
      </style>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* 로고 영역 (4분할 격자 심볼 적용: 좌상 삼각형, 우하 삼각형 구조) */}
          <div className="flex items-center gap-3">
            
            {/* 💡 BRIK 원형 마크를 대체하는 코드로 짠 4분할 격자 마크 */}
            <div className="flex h-11 w-11 flex-col justify-between p-[2px] transition-transform duration-300 hover:scale-105 cursor-pointer text-primary">
              
              {/* 상단 2개 조각 */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 💡 왼쪽 위 (TL): 좌상단만 뾰족한 삼각형 (Pointing Down-Left) */}
                <div className="h-full w-[45%] overflow-hidden">
                  <div className="triangle-diag-down-left h-full w-full" style={{ borderColor: 'transparent transparent transparent #1E3A8A' }}>
                    {/* In a real project, replace '#1E3A8A' with your actual primary color variable if border-color can't inherit text color */}
                  </div>
                </div>
                {/* 💡 오른쪽 위 (TR): 우상단만 둥글게 (Rounded Square) */}
                <div className="h-full w-[45%] rounded-tr-[5px] bg-primary" />
              </div>
              
              {/* 하단 2개 조각 */}
              <div className="flex justify-between h-[45%] w-full">
                {/* 💡 왼쪽 아래 (BL): 좌하단만 둥글게 (Rounded Square) */}
                <div className="h-full w-[45%] rounded-bl-[5px] bg-primary" />
                {/* 💡 오른쪽 아래 (BR): 우하단만 뾰족한 삼각형 (Pointing Up-Right) */}
                <div className="h-full w-[45%] overflow-hidden">
                  <div className="triangle-diag-up-right h-full w-full" style={{ borderColor: '#1E3A8A transparent transparent transparent' }}>
                  </div>
                </div>
              </div>
            </div>

            {/* 연구소 명칭 */}
            <div>
              <div className="text-xl font-bold text-primary">한국본회퍼연구소</div>
              <div className="text-xs text-muted-foreground">Bonhoeffer Research Institute of Korea</div>
            </div>
