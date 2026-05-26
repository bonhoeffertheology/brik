"use client"

import Link from "next/link"
import openBg from "@/public/images/open.png"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false)

  // 페이지가 로드되면 애니메이션이 시작되도록 설정
  useEffect(() => {
    setIsMounted(true)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-gradient-to-br from-primary to-secondary pt-20 text-white"
    >
      {/* 1. 가장 먼저 보이는 배경 사진 (페이드 인 효과) */}
      <div
        className={`absolute inset-0 bg-cover bg-center bg-fixed transition-opacity duration-1000 ${
          isMounted ? "opacity-50" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${openBg.src})`,
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20" 
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="max-w-3xl">
          
          {/* 2. 메인 타이틀 문구 (부드럽게 위로 올라오며 등장) */}
          <h1
            className={`mb-6 font-serif text-4xl font-bold leading-relaxed md:text-5xl lg:text-6xl text-shadow transform transition-all duration-1000 ease-out ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            오늘 우리에게
            <br />
            예수 그리스도는 누구신가?
          </h1>

          {/* 3. 서브 설명 문구 (약간의 시차(delay-300)를 두고 등장) */}
          <p 
            className={`mb-8 text-lg leading-relaxed text-white/90 md:text-xl transform transition-all duration-1000 ease-out delay-300 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            한국본회퍼연구소는 본회퍼가 던진 이 질문에 대답하기 위해, 오늘날 교회가 걸어가야 할 바른 길을 제시하고, 예수
            그리스도의 참된 제자들을 양성하는 일에 기여하고 있습니다.
          </p>

          {/* 4. 하단 링크 버튼 배너 (가장 마지막(delay-500)에 등장) */}
          <div 
            className={`flex flex-wrap gap-4 transform transition-all duration-1000 ease-out delay-500 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <Link
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="btn-primary rounded-lg bg-accent px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              연구소 알아보기
            </Link>
            <Link
              href="#publications"
              onClick={(e) => scrollToSection(e, "#publications")}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:bg-white/20"
            >
              출판물 보기
            </Link>
            <Link
              href="#support"
              onClick={(e) => scrollToSection(e, "#support")}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:bg-white/20"
            >
              후원하기
            </Link>
          </div>
        </div>
      </div>
      
      {/* 5. 아래쪽 화살표 제거 완료 */}
    </section>
  )
}
