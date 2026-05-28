"use client"

import { useEffect, useRef, useState } from "react"
// 이미지를 상대 경로로 직접 import 하여 경로 에러를 원천 차단합니다.
import supportBg from "@/public/images/support.jpg"

export function SupportSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    // 1. 등장 애니메이션 트리거 (기존 기능 유지)
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

    // 2. 부드러운 페럴렉스 위치 계산
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.15
        const yPos = -(rect.top * speed)
        setParallaxY(yPos)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll()

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section 
      id="support" 
      ref={sectionRef} 
      className="relative overflow-hidden bg-slate-900 py-20 md:py-28 text-white"
    >
      {/* 페럴렉스 배경 이미지 영역 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={supportBg.src}
          alt="Support Background"
          className="absolute left-1/2 top-0 h-[135%] w-full min-w-full object-cover will-change-transform"
          style={{ transform: `translateX(-50%) translateY(${parallaxY}px)` }}
        />
        {/* 어두운 오버레이 필터로 가독성 확보 */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* 기존의 패럴랙스 원형 데코레이션 배경 유지 */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 z-10" />
      <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/5 z-10" />
      
      {/* 콘텐츠 영역 (z-20) */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 타이틀 */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">후원하기</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-4 text-lg text-slate-300">
            한국본회퍼연구소의 문서 선교 사역에<br /> 든든한 동역자가 되어 주십시오
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* 변경된 후원금 사용 안내 배너 (반투명 및 문구 수정) */}
          <div
            className={`mb-10 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 p-8 shadow-xl transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-center text-2xl font-bold text-white">후원금은 이렇게 사용됩니다</h3>
            <p className="text-center leading-relaxed text-slate-100 tracking-wide">
              후원금은 한국본회퍼연구소의 학술연구, 번역, 출판, 네트워크 등의 운영에 사용됩니다.
            </p>
          </div>

          {/* 후원 계좌 안내 (기존 기능 100% 유지) */}
          <div
            className={`rounded-lg bg-gradient-to-br from-slate-700/90 to-slate-900/90 backdrop-blur-sm p-8 text-white shadow-lg transition-all duration-700 delay-400 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-6 text-center text-2xl font-bold">후원 계좌 안내</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-4">
                <div>
                  <p className="mb-1 text-sm text-slate-300">은행명</p>
                  <p className="text-xl font-bold">신한은행</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-sm text-slate-300">계좌번호</p>
                  <p className="text-xl font-bold">339-04-745500</p>
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="mb-1 text-sm text-slate-300">예금주</p>
                <p className="text-xl font-bold">양석진(한국본회퍼연구소장)</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
