"use client"

import { useEffect, useRef, useState } from "react"

const scheduleColors = ["bg-primary", "bg-secondary", "bg-accent"]

export function ScheduleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const schedules = [
    {
      id: "sch-1",
      day: "31",
      month: "7월",
      title: "<그리스도를 따라서> 2권 출판",
      dateInfo: "2026년 7월 31일 · 오전 7시",
      description: "교보문고에서 2권을 출판합니다."
    },
    {
      id: "sch-2",
      day: "30",
      month: "8월",
      title: "<그리스도를 따라서> 3권 번역 작업",
      dateInfo: "2026년 8월 30일 · 오전 11시",
      description: "마지막 3권까지 최선을 다해!"
    },
    {
      id: "sch-3",
      day: "25",
      month: "9월",
      title: "3권 번역 계속작업 및 다음책 선정",
      dateInfo: "2026년 9월 25일",
      description: "틈틈히 2권 수정작업 진행"
    }
  ]

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

  if (schedules.length === 0) {
    return null
  }

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30" id="schedule">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground font-serif">
            사역일정
          </h2>
          <div className="w-12 h-1 bg-amber-600/60 mx-auto mt-4 rounded" />
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {schedules.map((sch, index) => {
            const colorClass = scheduleColors[index % scheduleColors.length]
            
            return (
              <div
                key={sch.id}
                className={`flex flex-col sm:flex-row items-start gap-6 p-6 rounded-xl bg-card shadow-md ring-1 ring-border/50 transition-all duration-700 transform ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                } hover:shadow-lg`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`flex flex-col items-center justify-center w-16 h-16 rounded-xl text-white shrink-0 shadow-sm ${colorClass}`}>
                  <span className="text-xl font-bold leading-none">{sch.day}</span>
                  <span className="text-xs mt-1 opacity-90">{sch.month}</span>
                </div>

                <div className="space-y-1 text-left">
                  <h3 className="text-lg font-bold text-foreground">
                    {sch.title}
                  </h3>
                  <p className="text-sm text-primary/90 font-medium">
                    {sch.dateInfo}
                  </p>
                  <p className="text-base text-muted-foreground pt-1">
                    {sch.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
