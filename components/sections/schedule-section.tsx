"use client"

import { useEffect, useRef, useState } from "react"
import { useSiteSettings } from "@/hooks/use-site-settings"

const schedules = [
  {
    title: "본회퍼 신학 세미나",
    date: "2026년 4월 15일",
    time: "오후 2시",
    description: "\"현대 사회에서의 본회퍼 윤리학\"을 주제로 진행되는 학술 세미나입니다.",
    day: 15,
    month: 4,
    color: "bg-primary",
  },
  {
    title: "연구소 정기 모임",
    date: "2026년 5월 22일",
    time: "오후 3시",
    description: "연구원들이 모여 최근 연구 성과를 공유하고 토론하는 정기 모임입니다.",
    day: 22,
    month: 5,
    color: "bg-secondary",
  },
  {
    title: "국제 본회퍼 학술대회",
    date: "2026년 7월 10-12일",
    time: "3일간",
    description: "국내외 본회퍼 연구자들이 모이는 대규모 국제 학술대회가 개최됩니다.",
    day: 10,
    month: 7,
    color: "bg-accent",
  },
]

export function ScheduleSection() {
  const { settings } = useSiteSettings()
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
    <section id="schedule" ref={sectionRef} className="relative overflow-hidden bg-muted py-20 md:py-28">
      {/* Parallax Background with Fixed Effect - Bonhoeffer portrait */}
      <div
        className="pointer-events-none absolute inset-0 bg-fixed bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('${settings.scheduleBackgroundImage}')`,
        }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">연구일정</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        <div className="mx-auto max-w-3xl space-y-6">
          {schedules.map((schedule, index) => (
            <div
              key={schedule.title}
              className={`flex gap-6 rounded-lg bg-card p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex-shrink-0">
                <div
                  className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg text-white ${schedule.color}`}
                >
                  <div className="text-2xl font-bold">{schedule.day}</div>
                  <div className="text-xs">{schedule.month}월</div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-bold text-foreground">{schedule.title}</h3>
                <p className="mb-2 text-sm text-accent">
                  {schedule.date} · {schedule.time}
                </p>
                <p className="leading-relaxed text-muted-foreground">{schedule.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
