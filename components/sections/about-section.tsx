"use client"

import { useEffect, useRef, useState } from "react"

const activities = [
  { 
    title: "학술연구", 
    subtitle: "Academic Research", 
    desc: "본회퍼의 신학적 유산을 현대적 시각으로 재조명하고 체계적인 연구를 수행합니다.",
    color: "group-hover:from-[#5a6c9d]/10 group-hover:to-[#4a5578]/10",
    border: "group-hover:border-[#5a6c9d]"
  },
  { 
    title: "번역", 
    subtitle: "Translation", 
    desc: "엄밀한 텍스트 분석을 바탕으로 원전의 깊이를 한국어 정본으로 복원합니다.",
    color: "group-hover:from-[#b47b9e]/10 group-hover:to-[#8e5c73]/10",
    border: "group-hover:border-[#b47b9e]"
  },
  { 
    title: "출판", 
    subtitle: "Publication", 
    desc: "시대를 깨우는 활자와 사상을 엮어 복음의 실천적 의미를 전하는 도서를 펴냅니다.",
    color: "group-hover:from-[#6b8caf]/10 group-hover:to-[#547a9a]/10",
    border: "group-hover:border-[#6b8caf]"
  },
  { 
    title: "강의", 
    subtitle: "Lecture", 
    desc: "학문적 경계를 넘어 교회와 사회 속에서 참된 제자도를 양성하는 광장을 엽니다.",
    color: "group-hover:from-[#6b9d7b]/10 group-hover:to-[#567d63]/10",
    border: "group-hover:border-[#6b9d7b]"
  },
]

export function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
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

    return () => observer.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden bg-stone-50 py-24 md:py-32 dark:bg-stone-950">
      
      {/* 백그라운드 구조적 디자인 토큰 (미니멀한 장식 레이어) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* 1. 상단 섹션 타이틀 레이아웃 */}
        <div
          className={`mb-20 transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <span className="font-sans text-xs font-semibold tracking-[0.2em] text-amber-600 uppercase block mb-3 text-center md:text-left">
            KOREA BONHOEFFER INSTITUTE
          </span>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-stone-900 md:text-4xl lg:text-5xl dark:text-stone-100 text-center md:text-left">
              연구소 소개
            </h2>
            <p className="max-w-md font-sans text-sm font-light leading-relaxed text-stone-500 dark:text-stone-400 text-center md:text-left">
              디트리히 본회퍼의 신학적 유산을 정밀하게 탐구하여 오늘날 우리 사회와 교회가 걸어가야 할 이정표를 제시합니다.
            </p>
          </div>
          <div className="mt-6 h-[1px] w-full bg-stone-200 dark:bg-stone-800" />
        </div>

        {/* 2. 메인 컨텐츠 그리드 */}
        <div className="grid items-start gap-16 lg:grid-cols-12">
          
          {/* 왼쪽: 설립 목적 및 상세 논조 기술 (5개 컬럼 점유) */}
          <div
            className={`lg:col-span-5 transition-all delay-200 duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="sticky top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-200/60 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium font-sans mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                설립 목적
              </div>
              
              <h3 className="font-serif text-2xl font-bold tracking-tight text-stone-900 md:text-3xl dark:text-stone-100 mb-6 leading-snug">
                진리를 향한 텍스트,<br />
                시대를 깨우는 행동적 증언
              </h3>
              
              <div className="space-y-6 font-sans text-base font-light leading-relaxed text-stone-600 dark:text-stone-300">
                <p>
                  <span className="font-semibold text-stone-900 dark:text-white">한국본회퍼연구소</span>는 20세기 가장 치열했던 기독교 윤리학자이자 행동가였던 디트리히 본회퍼의 사상을 체계적으로 연구하며, 그의 학문적 깊이와 온전한 삶의 궤적을 한국 교회와 지성 사회에 올바르게 심어 가고 있습니다.
                </p>
                <p>
                  우리는 정교한 사료 번역과 깊이 있는 출판 활동, 학술적 연대를 기반으로 삼아 눈앞의 현상에 일희일비하지 않는 바른 길을 추구합니다. 이를 통해 그리스도의 참된 제자를 기르고, 건강한 신학적 토대를 공고히 하는 <span className="border-b border-amber-500/50 pb-0.5 font-normal text-stone-900 dark:text-white">문서 선교의 소명</span>을 다하고 있습니다.
                </p>
              </div>

              {/* 하단 미니 메트릭스 바 */}
              <div className="grid grid-cols-2 gap-4 mt-10 pt-8 border-t border-stone-200 dark:border-stone-800">
                <div>
                  <div className="font-serif text-xl font-bold text-stone-900 dark:text-white">정본 번역</div>
                  <div className="text-xs text-stone-400 mt-1">원전 중심의 엄밀한 주석</div>
                </div>
                <div>
                  <div className="font-serif text-xl font-bold text-stone-900 dark:text-white">제자도 양성</div>
                  <div className="text-xs text-stone-400 mt-1">삶과 신학의 일치 지향</div>
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽: 4대 핵심 활동 큐브 배열 (7개 컬럼 점유) */}
          <div
            className={`lg:col-span-7 grid gap-4 sm:grid-cols-2 transition-all delay-400 duration-1000 cubic-bezier(0.16, 1, 0.3, 1) ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {activities.map((activity) => (
              <div
                key={activity.title}
                className={`group relative overflow-hidden rounded-xl border border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900/40 p-8 transition-all duration-500 ease-out hover:shadow-xl hover:shadow-stone-200/30 dark:hover:shadow-none ${activity.border}`}
              >
                {/* 호버 시 부드럽게 배경에 차오르는 틴트 그라데이션 레이어 */}
                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 ${activity.color}`} />
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <span className="font-sans text-[10px] font-semibold tracking-wider text-stone-400 dark:text-stone-500 uppercase block mb-1">
                      {activity.subtitle}
                    </span>
                    <h4 className="font-serif text-xl font-bold text-stone-800 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors duration-300">
                      {activity.title}
                    </h4>
                  </div>
                  
                  <p className="mt-4 font-sans text-xs font-light leading-relaxed text-stone-500 dark:text-stone-400 group-hover:text-stone-600 dark:group-hover:text-stone-300 transition-colors duration-300">
                    {activity.desc}
                  </p>
                  
                  {/* 우측 하단 데코레이션 화살표 인디케이터 */}
                  <div className="mt-6 flex justify-end">
                    <span className="text-stone-300 dark:text-stone-700 group-hover:text-amber-500 dark:group-hover:text-amber-500 transition-transform duration-500 ease-out transform group-hover:translate-x-1 text-base font-light">
                      →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
