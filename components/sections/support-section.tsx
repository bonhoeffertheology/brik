"use client"

import { useEffect, useRef, useState } from "react"
import supportBg from "@/public/images/support.jpg"

export function SupportSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    // 1. 등장 애니메이션 트리거
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

    // 2. 다이내믹 페럴렉스 스크롤 (속도 0.3 유지)
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
      className="relative overflow-hidden bg-slate-950 py-24 md:py-36 text-white"
    >
      {/* 페럴렉스 배경 이미지 영역 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src={supportBg.src}
          alt="Support Background"
          className="absolute left-1/2 top-0 h-[150%] w-full min-w-full object-cover will-change-transform"
          style={{ transform: `translateX(-50%) translateY(${parallaxY}px)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-slate-950/20 to-slate-950/30 backdrop-blur-[1px]" />
      </div>

      {/* 패럴랙스 원형 데코레이션 배경 */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 z-10" />
      <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/5 z-10" />

      {/* 콘텐츠 영역 (z-20) */}
      <div className="relative z-20 mx-auto max-w-4xl px-6 lg:px-8">

        {/* 상단 타이틀 및 문구 통합 영역 */}
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-normal text-white md:text-4xl">후원하기</h2>

          {/* 애니메이션 바 */}
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>

          {/* 본문 설명 글씨체 색상 강화 */}
          <div className="mt-8 space-y-4 max-w-2xl mx-auto">
            <p className="text-lg md:text-xl font-normal leading-relaxed text-white tracking-wide">
              한국본회퍼연구소의 문서 선교 사역에<br />
              든든한 동역자가 되어 주십시오.
              한국본회퍼연구소의 문서 선교 사역은 <br />
              한국교회의 회복을 위한 가장 중요한 사역입니다.<br />
              이 귀한 선교사역에 든든한 동역자가 되어 주십시오.
            </p>
            <p className="text-sm md:text-base font-light leading-relaxed text-slate-200 tracking-wider">
              <span className="text-primary font-medium">후원금은 본 연구소의 </span>
              {/* 수정 부분: ' 등'을 span 내부로 이동하여 흰색, 세미볼드, 밑줄을 함께 적용 */}
              <span className="text-white font-semibold border-b border-accent/80 pb-0.5">학술연구, 번역, 출판, 네트워크 등</span>
              <span className="text-primary font-medium"><br className="hidden sm:inline" /> 교회와 사회를 온전히 세워가는 모든 사역의 운영에 사용됩니다.</span>
            </p>
          </div>
        </div>

        {/* 하단 계좌 안내 */}
        <div
          className={`mt-20 transition-all duration-1000 delay-300 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-2xl p-4 md:p-6">
            <p className="text-center text-lg tracking-[0.2em] text-primary uppercase mb-8 font-semibold">
              후원계좌
            </p>

            <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
              {/* 은행 및 계좌번호 */}
              <div className="text-center md:text-left space-y-1">
                {/* 수정 부분: '신한'을 굵게(font-semibold), 그리고 크기를 text-base -> text-lg로 확장 */}
                <p className="text-lg tracking-wider text-slate-100 font-semibold">신한</p>
                <p className="text-2xl md:text-3xl font-bold tracking-wider text-white font-mono">
                  339-04-745500
                </p>
              </div>

              {/* 경계선 가독성을 위해 bg-white/10 -> bg-white/20으로 변경 */}
              <div className="hidden md:block h-10 w-[1px] bg-white/20" />
              <div className="block md:hidden h-[1px] w-12 bg-white/20" />

              {/* 예금주 정보 */}
              <div className="text-center md:text-right space-y-1">
                {/* 수정 부분: '예금주'의 크기를 text-sm -> text-base로 한 단계 확장 */}
                <p className="text-base tracking-wider text-primary font-normal">예금주</p>
                <p className="text-lg md:text-xl font-normal tracking-wide text-slate-100">
                  한국본회퍼연구소장 양석진
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
