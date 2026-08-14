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
  
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const blogId = "jelsayou"
  const minSwipeDistance = 50

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

  // 데스크톱 마우스 휠을 가로 스크롤로 자연스럽게 변환
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      if (!isExpanded) return
      // 세로 휠 입력을 가로 스크롤로 전달
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        const canScrollLeft = container.scrollLeft > 0
        const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 1)
        
        if ((e.deltaY > 0 && canScrollRight) || (e.deltaY < 0 && canScrollLeft)) {
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
  }, [isExpanded])

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false)
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
      }
    } else {
      setIsExpanded(true)
    }
  }

  // 좌/우 버튼 클릭 스크롤 핸들러
  const handleScrollByStep = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    const scrollAmount = 380 // 카드 너비 + 간격 단위 이동
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    })
  }

  const displayPosts = allPosts

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX) }
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX) }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded && scrollContainerRef.current?.scrollLeft === 0) {
      handleToggleExpand()
    }
  }
  
  const onMouseDown = (e: React.MouseEvent) => { setMouseStart(e.clientX); setIsDragging(true) }
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) e.preventDefault() }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    const distance = mouseStart - e.clientX
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded && scrollContainerRef.current?.scrollLeft === 0) {
      handleToggleExpand()
    }
    setMouseStart(null); setIsDragging(false)
  }

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
      className="relative w-full overflow-hidden py-24 md:py-32 border-x-2 border-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setIsDragging(false)}
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
          height: 5px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 9999px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.4);
          border-radius: 9999px;
        }
        .horizontal-scroll-container::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.8);
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

      {/* 패럴렉스 배경 레이어 (배경 감상도 극대화) */}
      <div className="absolute inset-x-0 top-[-20%] h-[140%] z-0 will-change-transform" ref={bgRef}>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('images/back21.png')` }} 
        />
      </div>
      {/* 얇고 맑은 오버레이로 배경 시안성 극대화 */}
      <div className="absolute inset-0 bg-stone-950/30 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 상단 타이틀 구역 및 우측 상단 컨트롤 바 */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-white/10 pb-8">
          <div>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">연구활동</h2>
            <div className="mt-3 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
              <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
            <p className="mt-4 font-sans text-sm md:text-base font-light tracking-wide text-stone-200/90">
              본회퍼의 신학과 사상을 연구하고 나눕니다
            </p>
          </div>

          {/* 우측 컨트롤 바: 더보기 버튼 & 좌우 스크롤 탐색 버튼 */}
          {allPosts.length > 6 && (
            <div className="flex items-center gap-3 self-end md:self-auto">
              {/* 확장 시 나타나는 좌/우 탐색 내비게이터 (데스크톱 최적화) */}
              {isExpanded && (
                <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-md p-1 rounded-xl border border-white/15 shadow-sm">
                  <button
                    onClick={() => handleScrollByStep("left")}
                    aria-label="이전 목록 보기"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleScrollByStep("right")}
                    aria-label="다음 목록 보기"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-white/80 hover:bg-white/15 hover:text-white transition-colors"
                  >
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}

              {/* 우측 상단 더보기 / 접기 토글 버튼 */}
              <button 
                onClick={handleToggleExpand} 
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-300 transform active:scale-95 shadow-sm ${
                  isExpanded 
                    ? "bg-amber-500 text-stone-950 font-semibold hover:bg-amber-400" 
                    : "border border-white/30 bg-black/25 backdrop-blur-md text-white hover:bg-white/20 hover:border-white/50"
                }`}
              >
                <span>{isExpanded ? "접기" : "더보기"}</span>
                <span className="text-xs transition-transform duration-300">
                  {isExpanded ? "◀" : "▶"}
                </span>
              </button>
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

        {/* 글래스모피즘(반투명) 연구활동 카드 구역 */}
        {allPosts.length > 0 && (
          <div 
            ref={scrollContainerRef}
            className={`horizontal-scroll-container px-1 py-4 transition-all duration-500 ${
              isExpanded 
                ? "overflow-x-auto scroll-smooth cursor-grab active:cursor-grabbing" 
                : "overflow-hidden"
            }`}
          >
            <div 
              className={`research-grid-container grid grid-rows-2 grid-flow-col gap-x-6 gap-y-5 min-w-max ${
                isVisible ? "visible" : ""
              }`}
            >
              {displayPosts.map((post, index) => (
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
