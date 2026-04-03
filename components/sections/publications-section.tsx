"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"

const publications = [
  {
    title: "하나님과 함께",
    author: "양석진",
    publisher: "한국본회퍼연구소",
    description: "본회퍼의 신학을 통해 공적신학의 통전적인 기초를 확립한 저자의 논문을 책으로 출판하였습니다.",
    image: "/images/with-god.png",
    link: "https://smartstore.naver.com/bonhoeffer/products/6989986386",
    bgColor: "bg-primary",
  },
  {
    title: "옥중서간",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "감옥에서 쓴 편지들로, 고난 속에서도 빛나는 신앙의 깊이를 보여줍니다.",
    image: null,
    link: null,
    bgColor: "bg-secondary",
  },
  {
    title: "윤리학",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "그리스도인의 윤리적 삶과 책임에 대한 본회퍼의 심오한 통찰을 담고 있습니다.",
    image: null,
    link: null,
    bgColor: "bg-accent",
  },
]

function BookIcon() {
  return (
    <svg className="h-20 w-20 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

export function PublicationsSection() {
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
    <section id="publications" ref={sectionRef} className="relative overflow-hidden bg-card py-20 md:py-28">
      {/* Parallax Background */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5" />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">주요 출판물</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((pub, index) => {
            const CardWrapper = pub.link ? Link : "div"
            const cardProps = pub.link
              ? { href: pub.link, target: "_blank", rel: "noopener noreferrer" }
              : {}

            return (
              <CardWrapper
                key={pub.title}
                {...cardProps}
                className={`group block overflow-hidden rounded-lg bg-card shadow-md transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className={`flex h-48 items-center justify-center overflow-hidden ${pub.bgColor}`}>
                  {pub.image ? (
                    <Image
                      src={pub.image}
                      alt={pub.title}
                      width={300}
                      height={192}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="animate-float">
                      <BookIcon />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                    {pub.title}
                  </h3>
                  {/* 저자와 출판사를 한 줄에 나란히 배치 */}
                  <p className="mb-3 flex items-center gap-2 text-sm text-accent">
                    <span>{pub.author}</span>
                    <span className="text-muted-foreground">|</span>
                    <span className="text-muted-foreground">{pub.publisher}</span>
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{pub.description}</p>
                </div>
              </CardWrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
