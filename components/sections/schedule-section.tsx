"use client"

import { useEffect, useRef, useState } from "react"

const scheduleColors = ["bg-primary", "bg-secondary", "bg-accent"]

export function ScheduleSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  const schedules = [
    {
      id: "sch-1",
      day: "19",
      month: "5월",
      title: "<그리스도를 따라서> 2권 번역",
      dateInfo: "2026년 5월 19일 · 오전 7시",
      description: "1권에 이어 2권 번역이 계속됩니다."
    },
    {
      id: "sch-2",
      day: "22",
      month: "5월",
      title: "한국본회퍼연구소 홈페이지 관리",
      dateInfo: "2026년 5월 22일 · 오전 11시",
      description: "시스템 정비 및 리뉴얼 제작비 250,000원"
    },
    {
      id: "sch-3",
      day: "10",
      month: "6월",
      title: "본회퍼 원서 구입",
      dateInfo: "2026년 6월 10일 · 3일간",
      description: "본회퍼 원서 독일 배송 구입비 360,000원"
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
            연구일정
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
