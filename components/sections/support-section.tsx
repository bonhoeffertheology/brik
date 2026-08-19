"use client"

import { useEffect, useRef, useState } from "react"

export function SupportSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  // 연구소 후원 계좌 정보
  const accountNumber = "1002-850-845607"
  const bankName = "우리은행"
  const accountHolder = "한국본회퍼연구소"

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${bankName} ${accountNumber} ${accountHolder}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (_err) {
      // 복사 실패 시 무시
    }
  }

  return (
    <section
      id="support"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-stone-950 py-24 md:py-32 border-x-2 border-white select-none"
    >
      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        
        {/* 상단 타이틀 */}
        <div className="mb-14 border-b border-white/10 pb-8 text-center">
          <div className="inline-flex flex-col items-center">
            <span className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-amber-400/80">
              Support & Partnership
            </span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              사역 후원
            </h2>
            <div className="mt-3 h-0.5 w-12 bg-amber-500 relative overflow-hidden">
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/80 to-transparent animate-pulse" />
            </div>
          </div>
          
          <p className="mt-5 font-sans text-sm md:text-base font-light tracking-wide text-stone-200/90 leading-relaxed">
            한국본회퍼연구소의 학술 연구와 문서 선교 사역은<br className="hidden sm:inline" />
            동역자 여러분의 기도와 소중한 후원으로 이어집니다.
          </p>
        </div>

        {/* 후원 안내 카드 */}
        <div
          className={`rounded-3xl border border-white/15 bg-stone-900/40 p-8 sm:p-12 backdrop-blur-md shadow-2xl transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-block rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 font-mono text-xs font-medium text-amber-300">
                후원 계좌 안내
              </span>
              <div className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
                {bankName} <span className="font-mono text-amber-400">{accountNumber}</span>
              </div>
              <div className="font-sans text-sm text-stone-300">
                예금주: <strong className="text-white font-medium">{accountHolder}</strong>
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/20 hover:bg-amber-500 hover:text-stone-950 px-6 py-3.5 text-sm font-semibold text-amber-300 transition-all duration-200 shadow-md active:scale-95"
            >
              <span>{copied ? "계좌번호 복사됨 ✓" : "계좌번호 복사하기"}</span>
            </button>
          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-center text-xs font-sans text-stone-400/80 leading-relaxed">
            보내주신 후원금은 본회퍼 원전 번역 및 연구 서적 출판, 학술 세미나 사역을 위해 투명하고 정직하게 사용됩니다.
          </div>
        </div>

      </div>
    </section>
  )
}
