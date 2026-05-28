"use client"

import { useEffect, useRef, useState } from "react"

export function SupportSection() {
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
    <section id="support" ref={sectionRef} className="relative overflow-hidden bg-card py-20 md:py-28">
      {/* Parallax decorative background */}
      <div className="pointer-events-none absolute bottom-0 right-0 h-[500px] w-[500px] translate-x-1/4 translate-y-1/4 rounded-full bg-primary/3" />
      <div className="pointer-events-none absolute left-0 top-0 h-[300px] w-[300px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-accent/3" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">후원하기</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-4 text-lg text-muted-foreground"> 한국본회퍼연구소의 문서 선교 사역에<br /> 든든한 동역자가 되어 주십시오</p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div
            className={`mb-10 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 p-8 shadow-md transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-center text-2xl font-bold text-primary">후원금은 이렇게 사용됩니다</h3>
            <p className="text-center leading-relaxed text-foreground">
              한국본회퍼연구소는 디트리히 본회퍼의 신학과 삶의 연구를 통해 교회와 사회를 온전히 세우는 일에 헌신하고
              있습니다. 여러분의 후원은 학술 연구, 번역 및 출판, 강의, 교육 프로그램 등의 운영에 사용됩니다.
            </p>
          </div>

          <div
            className={`rounded-lg bg-gradient-to-br from-slate-700 to-slate-900 p-8 text-white shadow-lg transition-all duration-700 delay-400 ${
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
                  <p className="text-xl font-bold">339-04-1455001</p>
                </div>
              </div>
              <div className="rounded-lg bg-white/10 p-4">
                <p className="mb-1 text-sm text-slate-300">예금주</p>
                <p className="text-xl font-bold">양석진(한국본회퍼연구소)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
