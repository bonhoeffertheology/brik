"use client"

import { useEffect, useRef, useState } from "react"

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

    // 2. 부드러운 페럴렉스 위치 계산 (스크롤 버그 보완)
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 섹션이 화면에 보이기 시작할 때부터 끝날 때까지만 계산
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.2 // 숫자가 클수록 배경이 더 많이 움직입니다
        const yPos = -(rect.top * speed)
        setParallaxY(yPos)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // 초기 위치 맞추기

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <section 
      id="support" 
      ref={sectionRef} 
      className="relative overflow-hidden bg-slate-900 py-20 md:py-28" // 검은 화면 에러 방지를 위해 명확한 다크 톤 배경 지정
    >
      {/* [페럴렉스 배경 이미지 레이어] - 이제 선명하게 뒤에서 움직입니다 */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <img
          src="/images/support.jpg"
          alt="Support Background"
          // h-[140%]로 세로를 늘려 스크롤 시 위아래 여백이 찢어지는 현상 방지
          className="absolute left-1/2 top-0 h-[140%] w-full min-w-full object-cover will-change-transform"
          style={{ transform: `translateX(-50%) translateY(${parallaxY}px)` }}
        />
        {/* 이미지 위에 투명도 40%의 어두운 필터를 씌워, 이미지는 선명하게 보이고 글씨는 잘 읽히도록 조절 */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 기존의 패럴랙스 원형 데코레이션 배경 (z-10) */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/5 z-10" />
      <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/5 z-10" />
      
      {/* [콘텐츠 레이어] (z-20으로 올려 이미지 위에 선명하게 배치) */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 타이틀 영역 */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          {/* 배경 이미지 위에서 잘 보이도록 타이틀 글자색을 white로 변경 */}
          <h2 className="mb-4 font-serif text-3xl font-bold text-white md:text-4xl">후원하기</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-4 text-lg text-slate-200">
            한국본회퍼연구소의 문서 선교 사역에<br /> 든든한 동역자가 되어 주십시오
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          {/* 후원금 사용 안내 박스 (기존의 밝은 그라데이션 카드를 유지하되, 배경 이미지가 살짝 비치도록 backdrop-blur 적용) */}
          <div
            className={`mb-10 rounded-lg bg-gradient-to-r from-slate-50/95 to-blue-50/95 backdrop-blur-sm p-8 shadow-md transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-center text-2xl font-bold text-primary">후원금은 이렇게 사용됩니다</h3>
            <p className="text-center leading-relaxed text-slate-800">
              한국본회퍼연구소는 디트리히 본회퍼의 신학과 삶의 연구를 통해 교회와 사회를 온전히 세우는 일에 헌신하고
              있습니다. 여러분의 후원은 학술 연구, 번역 및 출판, 강의, 교육 프로그램 등의 운영에 사용됩니다.
            </p>
          </div>

          {/* 후원 계좌 안내 박스 (기존 스타일 100% 유지) */}
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
