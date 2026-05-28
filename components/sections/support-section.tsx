"use client"

import { useEffect, useRef, useState } from "react"
import supportBg from "@/public/images/support.jpg"

export function SupportSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    // 1. 등장 애니메이션 트리거 (기존 유지)
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

    // 2. 부드럽고 빠른 페럴렉스 (기존 속도 0.3 유지)
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.3 
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
      className="relative overflow-hidden bg-slate-950 py-24 md:py-32 text-white"
    >
      {/* 페럴렉스 배경 이미지 영역 (기존 유지) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={supportBg.src}
          alt="Support Background"
          className="absolute left-1/2 top-0 h-[150%] w-full min-w-full object-cover will-change-transform"
          style={{ transform: `translateX(-50%) translateY(${parallaxY}px)` }}
        />
        {/* 조금 더 깊이감 있고 세련된 다크 오버레이 */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px]" />
      </div>

      {/* 기존의 패럴랙스 원형 데코레이션 배경 유지 */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 z-10" />
      <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/5 z-10" />
      
      {/* 콘텐츠 영역 (z-20) */}
      <div className="relative z-20 mx-auto max-w-5xl px-6 lg:px-8">
        
        {/* 타이틀 영역 (기존 유지) */}
        <div
          className={`mb-20 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl tracking-wide">후원하기</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-5 text-base md:text-lg text-slate-300 font-light leading-relaxed">
            한국본회퍼연구소의 문서 선교 사역에<br /> 든든한 동역자가 되어 주십시오
          </p>
        </div>

        {/* 하부 디자인: 심플&모던 미니멀 스타일로 전면 개편 */}
        <div
          className={`mx-auto max-w-3xl space-y-16 transition-all duration-700 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* 1. 후원금 사용 안내 (카드 형태를 깨고 텍스트에 집중) */}
          <div className="text-center">
            <p className="text-lg md:text-xl font-light leading-relaxed text-slate-200 tracking-wide max-w-2xl mx-auto">
              "후원금은 한국본회퍼연구소의 <span className="text-accent font-medium">학술연구, 번역, 출판, 네트워크</span> 등의 운영에 사용됩니다."
            </p>
          </div>

          {/* 두 섹션을 구분하는 미니멀한 라인 */}
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          {/* 2. 후원 계좌 안내 (불필요한 박스를 없애고 미니멀한 그리드로 배치) */}
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
              {/* 은행 및 계좌번호 */}
              <div className="flex flex-col items-center md:items-end justify-center pb-6 md:pb-0 md:border-r border-white/10 pr-0 md:pr-12">
                <span className="text-xs tracking-widest text-slate-400 uppercase mb-1">Account</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-lg font-light text-slate-300">신한은행</span>
                  <span className="text-2xl font-semibold tracking-wider text-white">339-04-745500</span>
                </div>
              </div>

              {/* 예금주 */}
              <div className="flex flex-col items-center md:items-start justify-center">
                <span className="text-xs tracking-widest text-slate-400 uppercase mb-1">Holder</span>
                <p className="text-xl font-light text-slate-200">
                  양석진 <span className="text-sm text-slate-400 ml-1">(한국본회퍼연구소장)</span>
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
