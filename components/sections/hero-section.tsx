"use client"

import Link from "next/link"

export function HeroSection() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[70vh] items-center overflow-hidden pt-20 text-white"
    >
      {/* Video Parallax Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover fixed z-0"
      >
        <source src="/open4.mp4" type="video/mp4" />
        브라우저가 비디오 태그를 지원하지 않습니다.
      </video>

      {/* Overlay to improve text readability */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-secondary/30 to-primary/30 z-0" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="max-w-3xl">
          <h1
            className="mb-6 font-serif text-4xl font-bold leading-relaxed md:text-5xl lg:text-6xl"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            오늘 우리에게
            <br />
            예수 그리스도는 누구신가?
          </h1>
          <p className="mb-8 text-lg leading-relaxed text-white/90 md:text-xl">
            한국본회퍼연구소는 본회퍼가 던진 이 질문에 대답하기 위해, 오늘날 교회가 걸어가야 할 바른 길을 제시하고, 예수
            그리스도의 참된 제자들을 양성하는 일에 기여하고 있습니다.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className="btn-primary rounded-lg bg-accent px-6 py-3 font-medium text-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
            >
              연구소 알아보기
            </Link>
            <Link
              href="#publications"
              onClick={(e) => scrollToSection(e, "#publications")}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:bg-white/20"
            >
              출판물 보기
            </Link>
            <Link
              href="#support"
              onClick={(e) => scrollToSection(e, "#support")}
              className="rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all hover:bg-white/20"
            >
              후원하기
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <svg className="h-8 w-8 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
