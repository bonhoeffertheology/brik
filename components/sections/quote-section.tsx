"use client"

import { useState, useEffect } from "react"

const quotes = [
  {
    text: "\"값비싼 은혜란 그리스도께서 우리의 주인이 되시며, 그분이 우리를 다스리시는 것입니다.\"",
    author: "— 디트리히 본회퍼, 『나를 따르라』 중에서",
  },
  {
    text: "\"오직 믿는 사람만이 순종하고, 순종하는 사람만이 믿는 것입니다.\"",
    author: "— 디트리히 본회퍼, 『나를 따르라』 중에서",
  },
  {
    text: "\"교회는 오직 다른 사람들을 위해 존재할 때만 교회입니다.\"",
    author: "— 디트리히 본회퍼, 『옥중서간』 중에서",
  },
]

export function QuoteSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      // Start fade out
      setIsVisible(false)
      
      // Change quote after fade out completes
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % quotes.length)
        // Start fade in
        setIsVisible(true)
      }, 800)
    }, 8000) // 8 seconds display time

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden bg-muted py-16 md:py-24">
      {/* Parallax decorative elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-accent/5" />
      
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Fixed height container to prevent layout shift */}
        <blockquote className="min-h-[180px] border-l-4 border-accent pl-6 md:min-h-[160px] md:pl-8">
          <div className="flex h-full flex-col justify-center">
            <p
              className={`mb-4 font-serif text-2xl leading-relaxed text-foreground transition-all duration-700 ease-in-out md:text-3xl ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {quotes[currentIndex].text}
            </p>
            <footer
              className={`text-lg font-medium text-accent transition-all duration-700 ease-in-out delay-100 ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              }`}
            >
              {quotes[currentIndex].author}
            </footer>
          </div>
        </blockquote>
        
        {/* Quote navigation dots */}
        <div className="mt-8 flex justify-center gap-2">
          {quotes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsVisible(false)
                setTimeout(() => {
                  setCurrentIndex(idx)
                  setIsVisible(true)
                }, 400)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-accent" : "w-2 bg-accent/30 hover:bg-accent/50"
              }`}
              aria-label={`Go to quote ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
