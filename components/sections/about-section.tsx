"use client"

import { useEffect, useRef, useState } from "react"

const activities = [
  { title: "학술연구", subtitle: "Academic Research", color: "from-[#5a6c9d] to-[#4a5578]" },
  { title: "번역", subtitle: "Translation", color: "from-[#b47b9e] to-[#8e5c73]" },
  { title: "출판", subtitle: "Publication", color: "from-[#6b8caf] to-[#547a9a]" },
  { title: "강의", subtitle: "Lecture", color: "from-[#6b9d7b] to-[#567d63]" },
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
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    /* 💡 [양 옆 흰색 실선 테두리 추가] 
       - md:border-x 속성을 통해 데스크톱 화면 좌우 가장자리에 투명도 20%의 깔끔한 흰색 선을 추가했습니다.
       - border-white/20의 수치를 변경하여 테두리의 선명도를 조절하실 수 있습니다. (예: 완전히 진하게 하려면 border-white)
    */
    <section 
      id="about" 
      ref={sectionRef} 
      className="relative overflow-hidden bg-card py-20 md:py-28 md:border-x border-white/20"
    >
      {/* Parallax background elements */}
      <div 
        className="pointer-events-none absolute -right-20 top-20 h-[600px] w-[600px] rounded-full bg-primary/3"
        style={{ transform: "translateZ(-1px) scale(1.5)" }}
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">연구소 소개</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        <div className="grid items-center gap-12 md:grid-cols-2">
          <div
            className={`transition-all delay-200 duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <h3 className="mb-4 text-2xl font-bold text-foreground">설립 목적</h3>
            <p className="mb-4 text-lg leading-relaxed text-muted-foreground">
              <span className="font-bold text-primary">한국본회퍼연구소</span>는 디트리히 본회퍼의 신학사상을 체계적으로 연구하고, 그의 삶과 신학을 한국 교회와 사회에 전하기 위해 설립되었습니다.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              본 연구소는 학술 연구, 번역, 출판, 강의 등을 통해 본회퍼 신학의 깊이와 실천적 의미를 전함으로 예수 그리스도의 제자들을 세우고, 건강한 교회들을 세워가는 문서 선교의 사명을 감당하고 있습니다. 
            </p>
          </div>

          <div
            className={`grid grid-cols-2 gap-4 transition-all delay-400 duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {activities.map((activity, index) => (
              <div
                key={activity.title}
                className={`group cursor-pointer rounded-lg bg-gradient-to-br ${activity.color} p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-2 text-2xl font-bold text-white">{activity.title}</div>
                <div className="text-sm font-medium text-white/90">{activity.subtitle}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
