"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

const CACHE_KEY = "brik_blog_cache"
const CACHE_DURATION = 10 * 60 * 1000 // 10분

export function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const holdIntervalRef = useRef<number | null>(null)
  
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const blogId = "jelsayou"
  const minSwipeDistance = 40

  const getCachedPosts = useCallback((): BlogPost[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { posts, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION && posts.length > 0) {
          return posts as BlogPost[]
        }
      }
    } catch { /* 무시 */ }
    return null
  }, [])

  const setCachedPosts = useCallback((posts: BlogPost[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }))
    } catch { /* 무시 */ }
  }, [])

  const parseRSS = useCallback((xmlText: string): BlogPost[] | null => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")
      const items = xmlDoc.querySelectorAll("item")
      if (items.length === 0) return null

      return Array.from(items).map((item) => ({
        title: item.querySelector("title")?.textContent || "제목 없음",
        link: item.querySelector("link")?.textContent || `https://blog.naver.com/${blogId}`,
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || new Date().toISOString(),
      }))
    } catch { return null }
  }, [blogId])

  const fetchWithTimeout = useCallback(async (url: string, timeout = 5000): Promise<string> => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      if (!response.ok) throw new Error("Response not OK")
      return await response.text()
    } catch (e) {
      clearTimeout(id)
      throw e
    }
  }, [])

  const loadBlogPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    const cached = getCachedPosts()
    if (cached) {
      setAllPosts(cached)
      setIsLoading(false)
    }
    try {
      const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`
      const xmlText = await Promise.any([
        fetchWithTimeout(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`),
        fetchWithTimeout(`https://corsproxy.io/?${encodeURIComponent(rssUrl)}`),
        fetchWithTimeout(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`),
      ])
      const posts = parseRSS(xmlText)
      if (posts && posts.length > 0) {
        setAllPosts(posts)
        setCachedPosts(posts)
        setIsLoading(false)
      } else if (!cached) {
        throw new Error("파싱 불가")
      }
    } catch (err) {
      if (!cached) {
        setError("최신 글을 불러오는 중 문제가 발생했습니다.")
        setIsLoading(false)
      }
    }
  }, [blogId, getCachedPosts, setCachedPosts, fetchWithTimeout, parseRSS])

  useEffect(() => {
    loadBlogPosts()
  }, [loadBlogPosts])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // 스크롤 위치 감지 (화살표 활성화 상태 업데이트)
  const updateScrollButtons = useCallback(() => {
    const container = scrollContainerRef.current
    if (!container) return
    setCanScrollLeft(container.scrollLeft > 5)
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 5)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return
    container.addEventListener("scroll", updateScrollButtons, { passive: true })
    updateScrollButtons()
    return () => container.removeEventListener("scroll", updateScrollButtons)
  }, [updateScrollButtons, allPosts])

  // 배경 패럴렉스
  useEffect(() => {
    const section = sectionRef.current
    const bg = bgRef.current
    if (!section || !bg) return

    let animatedY = -20
    let targetY = -20
    let animationFrameId: number

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const windowHeight = window.innerHeight

      if (rect.bottom < 0 || rect.top > windowHeight) return

      const totalDistance = windowHeight + rect.height
      const scrolledDistance = windowHeight - rect.top
      const progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1)

      targetY = -20 + (progress * 40)
    };

    const updateParallax = () => {
      const ease = 0.08
      animatedY += (targetY - animatedY) * ease
      bg.style.transform = `translate3d(0, ${animatedY}%, 0)`
      animationFrameId = requestAnimationFrame(updateParallax)
    };

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    animationFrameId = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationFrameId)
    };
  }, [])

  // 데스크톱 마우스 휠 -> 부드러운 가로 스크롤
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const atLeft = container.scrollLeft <= 0
        const atRight = container.scrollLeft >= (container.scrollWidth - container.clientWidth - 1)
        
        if ((e.deltaY > 0 && !atRight) || (e.deltaY < 0 && !atLeft)) {
          e.preventDefault()
          container.scrollBy({
            left: e.deltaY * 1.5,
            behavior: "smooth"
          })
        }
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false })
    return () => container.removeEventListener("wheel", handleWheel)
  }, [])

  // 화살표 버튼 연속 스크롤 처리
  const stopHolding = useCallback(() => {
    if (holdIntervalRef.current !== null) {
      cancelAnimationFrame(holdIntervalRef.current)
      holdIntervalRef.current = null
    }
  }, [])

  const startHolding = (direction: "left" | "right") => {
    stopHolding()
    const container = scrollContainerRef.current
    if (!container) return

    const scrollSpeed = direction === "left" ? -14 : 14

    const scrollLoop = () => {
      container.scrollLeft += scrollSpeed
      updateScrollButtons()
      holdIntervalRef.current = requestAnimationFrame(scrollLoop)
    }

    holdIntervalRef.current = requestAnimationFrame(scrollLoop)
  }

  // 1회 클릭 시 스텝 이동
  const handleSingleClick = (direction: "left" | "right") => {
    const container = scrollContainerRef.current
    if (!container) return
    const scrollAmount = 370
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  // 모바일 및 마우스 제스처
  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX) }
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX) }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd || !scrollContainerRef.current) return
    const distance = touchStart - touchEnd
    if (Math.abs(distance) > minSwipeDistance) {
      scrollContainerRef.current.scrollBy({
        left: distance * 1.2,
        behavior: "smooth"
      })
    }
  }

  const onMouseDown = (e: React.MouseEvent) => { setMouseStart(e.clientX); setIsDragging(true) }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart || !scrollContainerRef.current) return
    const walk = (mouseStart - e.clientX) * 0.8
    scrollContainerRef.current.scrollLeft += walk
    setMouseStart(e.clientX)
  }
  const onMouseUp = () => { setIsDragging(false); setMouseStart(null) }

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return ""
    try {
      const d = new Date(dateString)
      if (isNaN(d.getTime())) return ""
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
    } catch {
      return ""
    }
  }

  const formatDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "")
    return text.length > 105 ? text.substring(0, 105) + "..." : text
  }

  return (
    <section 
      id="research" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden py-24 md:py-32 border-x-2 border-white select-none"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => { onMouseUp(); stopHolding(); }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
        }
        
        /* 세련된 가로 슬림 스크롤바 */
        .horizontal-scroll-container::-webkit-scrollbar {
          height: 4px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.35);
          border-radius: 9999px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.7);
        }

        .motion-card {
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
          transform: translateY(30px) translateZ(0);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                      box-shadow 0.35s cubic-bezier(0.16, 1, 0.3, 1), 
                      border-color 0.3s ease, 
                      background-color 0.3s ease,
                      opacity 0.6s ease;
        }
        
        .research-grid-container.visible .motion-card {
          opacity: 1;
          transform: translateY(0) translateZ(0);
        }
        
        .research-grid-container .motion-card:hover {
          transform: translateY(-6px) translateZ(0) !important;
        }
      `}} />

      {/* 패럴렉스 배경 레이어 */}
      <div className="absolute inset-x-0 top-[-20%] h-[140%] z-0 will-change-transform" ref={bgRef}>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('images/back21.png')` }} 
        />
      </div>
      <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 상단 타이틀 구역 (전체 화면 기준 중앙 정렬) & 우측 화살표 컨트롤러 */}
        <div className="relative mb-12 border-b border-white/10 pb-8">
          
          {/* 타이틀 및 설명 문구: 화면 전체 폭 기준 완벽한 중앙 정렬 */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              연구활동
            </h2>
            <div className="mt-3 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
              <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <p className="mt-4 font-sans text-sm md:text-base font-light tracking-wide text-stone-200/90">
              본회퍼의 신학과 사상을 연구하고 나눕니다
            </p>
          </div>

          {/* 우측 즉각 탐색 컨트롤러 (데스크톱: 우측 상단 정렬 / 모바일: 하단 중앙 정렬) */}
          {allPosts.length > 0 && (
            <div className="mt-6 flex justify-center md:mt-0 md:absolute md:right-0 md:bottom-8">
              <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-md">
                {/* 왼쪽 화살표 */}
                <button
                  type="button"
                  onClick={() => handleSingleClick("left")}
                  onMouseDown={() => startHolding("left")}
                  onMouseUp={stopHolding}
                  onMouseLeave={stopHolding}
                  onTouchStart={() => startHolding("left")}
                  onTouchEnd={stopHolding}
                  disabled={!canScrollLeft}
                  aria-label="이전 연구활동 목록 보기"
                  className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                    canScrollLeft
                      ? "text-white bg-white/10 hover:bg-amber-500 hover:text-stone-950 cursor-pointer shadow-sm"
                      : "text-white/30 cursor-not-allowed opacity-40"
                  }`}
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                {/* 오른쪽 화살표 */}
                <button
                  type="button"
                  onClick={() => handleSingleClick("right")}
                  onMouseDown={() => startHolding("right")}
                  onMouseUp={stopHolding}
                  onMouseLeave={stopHolding}
                  onTouchStart={() => startHolding("right")}
                  onTouchEnd={stopHolding}
                  disabled={!canScrollRight}
                  aria-label="다음 연구활동 목록 보기"
                  className={`flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                    canScrollRight
                      ? "text-white bg-white/10 hover:bg-amber-500 hover:text-stone-950 cursor-pointer shadow-sm"
                      : "text-white/30 cursor-not-allowed opacity-40"
                  }`}
                >
                  <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 로딩 / 에러 */}
        {isLoading && allPosts.length === 0 && (
          <div className="text-center text-white/80 py-16 font-sans">블로그 데이터를 불러오는 중입니다...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-amber-400 py-16 font-sans">{error}</div>
        )}

        {/* 연구활동 카드 리스트: 2행 가로 배치 */}
        {allPosts.length > 0 && (
          <div 
            ref={scrollContainerRef}
            className="horizontal-scroll-container overflow-x-auto px-1 py-4 transition-all duration-300 cursor-grab active:cursor-grabbing"
          >
            <div 
              className={`research-grid-container grid grid-rows-2 grid-flow-col gap-x-6 gap-y-5 min-w-max ${
                isVisible ? "visible" : ""
              }`}
            >
              {allPosts.map((post, index) => (
                <a 
                  key={index} 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col justify-between shrink-0 w-[290px] sm:w-[330px] lg:w-[360px] h-[240px] rounded-2xl bg-stone-900/40 hover:bg-stone-900/65 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl border border-white/15 hover:border-amber-400/60 motion-card z-10"
                  style={{
                    transitionDelay: isVisible ? "0s" : `${(index % 6) * 0.08}s`,
                  }}
                >
                  <div className="flex-1">
                    {/* 글 제목 */}
                    <h3 className="font-serif text-[16.5px] font-bold leading-snug text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    {/* 본문 요약 */}
                    <p className="mt-3 font-serif text-[13px] font-light leading-relaxed text-stone-300/85 line-clamp-3">
                      {formatDescription(post.description)}
                    </p>
                  </div>

                  {/* 하단 메타 정보 */}
                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-sans tracking-wider text-stone-400">
                    <span className="font-medium text-stone-300 group-hover:text-amber-300 transition-colors">한국본회퍼연구소장</span>
                    <span className="text-stone-400/80">{formatDate(post.pubDate)}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
