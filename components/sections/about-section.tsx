"use client"

import { useEffect, useRef, useState } from "react"

const activities = [
  {
    num: "01",
    title: "학술연구",
    subtitle: "Academic Research",
    desc: "본회퍼 신학사상의 현대적 계승과 체계적 연구",
    tag: "Theology & Ethics",
  },
  {
    num: "02",
    title: "전문번역",
    subtitle: "Translation",
    desc: "독일어 원전의 정확하고 깊이 있는 학술 번역",
    tag: "German Primary Works",
  },
  {
    num: "03",
    title: "문서출판",
    subtitle: "Publication",
    desc: "한국교회의 갱신을 위한 양질의 신학 저술 및 보급",
    tag: "Theological Books",
  },
  {
    num: "04",
    title: "강의·사역",
    subtitle: "Lecture & Ministry",
    desc: "목회자와 성도를 위한 신학 강좌 및 제자도 훈련",
    tag: "Education & Seminars",
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
      { threshold: 0.15 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden bg-stone-950 py-24 md:py-32 border-x-2 border-white select-none"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
        }

        .about-fade-card {
          opacity: 0;
          transform: translateY(24px);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease;
        }

        .about-visible .about-fade-card {
          opacity: 1;
          transform: translateY(0);
        }
      `}} />

      {/* 배경 은은한 무드 조명 효과 */}
      <div className="pointer-events-none absolute -left-20 top-1/4 h-[500px] w-[500px] rounded-full bg-amber-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-[500px] w-[500px] rounded-full bg-amber-600/5 blur-[120px]" />

      <div className={`relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${isVisible ? "about-visible" : ""}`}>
        
        {/* 상단 타이틀 구역 */}
        <div className="mb-16 border-b border-white/10 pb-8 text-center about-fade-card">
          <div className="inline-flex flex-col items-center">
            <span className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400/80">
              About The Institute
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              연구소 소개
            </h2>
            <div className="mt-3 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
              <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
          <p className="mt-4 font-sans text-sm md:text-base font-light tracking-wide text-stone-300/85">
            그리스도의 제자도를 실천하며, 한국교회의 회복을 위해 문서 선교의 사명을 감당합니다
          </p>
        </div>

        {/* 2열 메인 레이아웃 */}
        <div className="grid items-stretch gap-10 lg:grid-cols-12">
          
          {/* 좌측: 설립 목적 및 미션 선언 (7열) */}
          <div className="flex flex-col justify-between space-y-6 lg:col-span-6 xl:col-span-5 about-fade-card">
            
            <div className="rounded-3xl border border-white/10 bg-stone-900/40 p-8 sm:p-10 backdrop-blur-md shadow-xl flex-1 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-medium text-amber-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                  Mission & Vision
                </div>
                
                <h3 className="mt-5 font-serif text-2xl font-bold text-white sm:text-3xl leading-snug">
                  디트리히 본회퍼의 삶과 신학,<br />
                  <span className="text-amber-400">한국교회와 세상의 다리</span>가 되다
                </h3>

                <div className="mt-6 space-y-4 font-serif text-[15px] font-light leading-relaxed text-stone-300/90 break-keep">
                  <p>
                    <strong className="font-semibold text-white">한국본회퍼연구소</strong>는 20세기 가장 치열한 신앙의 증인이었던 디트리히 본회퍼(Dietrich Bonhoeffer)의 신학사상을 체계적으로 연구하고, 그의 삶과 복음의 정수를 한국 교회와 사회에 올곧게 전하기 위해 설립되었습니다.
                  </p>
                  <p>
                    값싼 은혜가 만연한 시대 속에서 참된 제자도(Nachfolge)와 그리스도인의 윤리적 책임을 회복하며, 건강한 신앙 공동체를 세워가는 거룩한 문서 선교 사역에 헌신합니다.
                  </p>
                </div>
              </div>

              {/* 하단 강조 인용구 박스 */}
              <div className="mt-8 border-l-2 border-amber-400/80 bg-stone-950/60 p-4 rounded-r-2xl">
                <p className="font-serif text-xs sm:text-sm italic text-stone-200 leading-relaxed">
                  “그리스도께서 사람을 부르실 때에는, 와서 죽으라고 명하시는 것이다.”
                </p>
                <span className="mt-1.5 block text-[11px] font-sans tracking-wider text-amber-400/80">
                  — 디트리히 본회퍼 『나를 따르라』(Nachfolge) 中
                </span>
              </div>
            </div>

          </div>

          {/* 우측: 4대 핵심 사역 카드 그리드 (5열 또는 7열) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:col-span-6 xl:col-span-7">
            {activities.map((activity, index) => (
              <div
                key={activity.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-white/10 bg-stone-900/35 p-6 sm:p-7 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-amber-400/50 hover:bg-stone-900/70 hover:shadow-2xl about-fade-card"
                style={{
                  transitionDelay: isVisible ? `${(index + 1) * 0.1}s` : "0s",
                }}
              >
                {/* 상단 번호 & 영문 태그 */}
                <div>
                  <div className="flex items-center justify-between border-b border-white/5 pb-3">
                    <span className="font-mono text-xs font-semibold tracking-wider text-amber-400/80 group-hover:text-amber-300">
                      {activity.num}
                    </span>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400">
                      {activity.tag}
                    </span>
                  </div>

                  {/* 사역명 */}
                  <div className="mt-4">
                    <h4 className="font-serif text-xl font-bold text-stone-100 group-hover:text-amber-300 transition-colors">
                      {activity.title}
                    </h4>
                    <p className="font-mono text-xs font-medium text-stone-400 mt-0.5">
                      {activity.subtitle}
                    </p>
                  </div>

                  {/* 설명 */}
                  <p className="mt-4 font-serif text-[13px] font-light leading-relaxed text-stone-300/80 break-keep">
                    {activity.desc}
                  </p>
                </div>

                {/* 하단 장식 포인트 */}
                <div className="mt-6 flex items-center justify-between pt-2">
                  <div className="h-0.5 w-6 bg-white/10 group-hover:w-12 group-hover:bg-amber-400 transition-all duration-300" />
                  <span className="text-sm text-stone-500 group-hover:text-amber-300 group-hover:translate-x-1 transition-all duration-200">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  )
}
