"use client"

import { useEffect, useRef, useState } from "react"
import { useSiteSettings, type ScheduleItem } from "@/hooks/use-site-settings"

const scheduleColors = ["bg-primary", "bg-secondary", "bg-accent"]

export function ScheduleSection() {
  const { settings } = useSiteSettings()
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
      description: "홈페이지 시스템 정비 및 리뉴얼"
    },
    {
      id: "sch-3",
      day: "10",
      month: "6월",
      title: "본회퍼 원서 구입",
      dateInfo: "2026년 6월 10일 · 3일간",
      description: "본회퍼 원서 시리즈 구입, 독일 배송"
    }
  ];

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
          {schedules.map((schedule: ScheduleItem, index: number) => {
            const date = new Date(schedule.date)
            const day = date.getDate()
            const month = date.getMonth() + 1
            const color = scheduleColors[index % 3]
            
            // Format date for display
            const displayDate = schedule.date 
              ? date.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })
              : ""

            return (
              <div
                key={schedule.title + index}
                className={`flex gap-6 rounded-lg bg-card p-6 shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex-shrink-0">
                  <div
                    className={`flex h-16 w-16 flex-col items-center justify-center rounded-lg text-white ${color}`}
                  >
                    <div className="text-2xl font-bold">{day || "-"}</div>
                    <div className="text-xs">{month || "-"}월</div>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-bold text-foreground">{schedule.title}</h3>
                  <p className="mb-2 text-sm text-accent">
                    {displayDate} {schedule.time && `· ${schedule.time}`}
                  </p>
                  <p className="leading-relaxed text-muted-foreground">{schedule.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
