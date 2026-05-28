"use client"

import { useEffect, useRef, useState } from "react"

export function SupportSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxY, setParallaxY] = useState(0)

  useEffect(() => {
    // 1. 등장 애니메이션 트리거 (Intersection Observer)
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

    // 2. 안전한 상대 좌표 페럴렉스 계산 함수
    const handleScroll = () => {
      if (!sectionRef.current) return
      
      // 화면(뷰포트) 기준으로 이 섹션의 위치를 가져옴
      const rect = sectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // 섹션이 화면에 보이기 시작할 때부터 끝날 때까지만 페럴렉스 계산
      if (rect.top < windowHeight && rect.bottom > 0) {
        const speed = 0.2 // 수치가 낮을수록 부드럽고 느리게 움직입니다 (0.1 ~ 0.3 추천)
        
        // 화면 중앙을 기준으로 상대적인 스크롤 위치를 계산하여 밀림 방지
        const yPos = -(rect.top * speed)
        setParallaxY(yPos)
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // 초기 로드 시점에도 위치를 맞추기 위해 즉시 실행

    return () => {
      observer.disconnect()
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    // 배경 이미지가 돋보이도록 어두운 톤(bg-slate-950)을 기본 베이스로 깔고 글자색을 white로 변경합니다.
    <section id="support" ref={sectionRef} className="relative overflow-hidden bg-slate-950 py-20 md:py-28 text-white">
      
      {/* 페럴렉스 배경 이미지 컨테이너 */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/images/support.jpg"
          alt="Support Background"
          // h-[130%]로 세로를 늘려주어야 translateY로 움직일 때 위아래에 빈 하얀 공백이 생기지 않습니다.
          className="absolute left-1/2 top-0 h-[130%] w-full min-w-full object-cover will-change-transform"
          style={{ transform: `translateX(-50%) translateY(${parallaxY}px)` }}
        />
        {/* 이미지 위에 어두운 투명 반투명 레이어를 깔아 글씨 가독성을 극대화합니다 */}
        <div className="absolute inset-0 bg-black/60 z-10" />
      </div>

      {/* 실 콘텐츠 영역 (z-20으로 지정하여 이미지 레이어 위로 띄움) */}
      <div className="relative z-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
          {/* 후원금 사용 안내 박스 (배경 이미지와 조화를 위해 백드롭 블러를 준 반투명 스타일로 변경) */}
          <div
            className={`mb-10 rounded-lg bg-white/10 backdrop-blur-sm p-8 shadow-md transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-center text-2xl font-bold text-white">후원금은 이렇게 사용됩니다</h3>
            <p className="text-center leading-relaxed text-slate-200">
              한국본회퍼연구소는 디트리히 본회퍼의 신학과 삶의 연구를 통해 교회와 사회를 온전히 세우는 일에 헌신하고
              있습니다. 여러분의 후원은 학술 연구, 번역 및 출판, 강의, 교육 프로그램 등의 운영에 사용됩니다.
            </p>
          </div>

          {/* 계좌 안내 박스 */}
          <div
            className={`rounded-lg bg-gradient-to-br from-slate-800/90 to-slate-950/90 backdrop-blur-sm p-8 text-white shadow-lg transition-all duration-700 delay-400 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-6 text-center text-2xl font-bold">후원 계좌 안내</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-white/10 p-4">
                <div>
                  <p className="mb-1 text-sm text-slate-400">은행명</p>
                  <p className="text-xl font-bold">신한은행</p>
                </div>
                <div className="text-right">
                  <p className="mb-1 text-sm text-slate-400">계좌번호</p>
                  <p className="text-xl font-bold">339-04-745500</p>
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="mb-1 text-sm text-slate-400">예금주</p>
                <p className="text-xl font-bold">양석진(한국본회퍼연구소장)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
