"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

const accentColors = [
  { bar: "bg-primary", bg: "bg-gradient-to-br from-primary/[0.03] to-primary/[0.08]" },
  { bar: "bg-secondary", bg: "bg-gradient-to-br from-secondary/[0.03] to-secondary/[0.08]" },
  { bar: "bg-accent", bg: "bg-gradient-to-br from-accent/[0.03] to-accent/[0.08]" }
]
const POSTS_PER_PAGE = 9
const CACHE_KEY = "brik_blog_cache"
const CACHE_DURATION = 10 * 60 * 1000 // 10분 캐시

export function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandAnimationIndex, setExpandAnimationIndex] = useState(-1)
  
  // Swipe state
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const blogId = "jelsayou"
  const minSwipeDistance = 50

  // Get cached posts from localStorage
  const getCachedPosts = useCallback((): BlogPost[] | null => {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { posts, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION && posts.length > 0) {
          return posts
        }
      }
    } catch {
      // Ignore cache errors
    }
    return null
  }, [])

  // Set cached posts to localStorage
  const setCachedPosts = useCallback((posts: BlogPost[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }))
    } catch {
      // Ignore cache errors
    }
  }, [])

  // Parse RSS XML to blog posts
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
    } catch {
      return null
    }
  }, [blogId])

  // Fetch with timeout
  const fetchWithTimeout = useCallback(async (url: string, timeout = 5000): Promise<string> => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const response = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      if (!response.ok) throw new Error("Response not OK")
      const text = await response.text()
      if (!text.includes("<item>")) throw new Error("No items")
      return text
    } catch (e) {
      clearTimeout(id)
      throw e
    }
  }, [])

  // Load blog posts from RSS
  const loadBlogPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // 1) Check cached data first
    const cached = getCachedPosts()
    if (cached) {
      setAllPosts(cached)
      setIsLoading(false)
    }

    // 2) Fetch fresh data from network using multiple CORS proxies
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
        throw new Error("블로그 데이터를 불러올 수 없습니다")
      }
    } catch (err) {
      console.error("블로그 글 로딩 실패:", err)
      if (!cached) {
        setError("최신 글을 불러오는 중 문제가 발생했습니다.")
        setIsLoading(false)
      }
    }
  }, [blogId, getCachedPosts, setCachedPosts, fetchWithTimeout, parseRSS])

  // Initialize
  useEffect(() => {
    loadBlogPosts()
  }, [loadBlogPosts])

  // Intersection Observer for reveal animation
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

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE)

  // Get posts to display based on current state
  const displayPosts = isExpanded
    ? allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
    : allPosts.slice(0, 3)

  const handlePageChange = useCallback((newPage: number) => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      setIsAnimating(false)
      // Scroll to section top
      sectionRef.current?.scrollIntoView({ behavior: "smooth" })
    }, 300)
  }, [])

  const handleShowMore = () => {
    setIsExpanded(true)
    setCurrentPage(1)
    setExpandAnimationIndex(0)
    
    // Animate items appearing one by one
    const totalItems = Math.min(allPosts.length, POSTS_PER_PAGE)
    for (let i = 0; i <= totalItems; i++) {
      setTimeout(() => {
        setExpandAnimationIndex(i)
      }, i * 120)
    }
  }

  const handleCollapse = () => {
    // Animate items disappearing in reverse
    const currentDisplayCount = displayPosts.length
    for (let i = currentDisplayCount; i >= 0; i--) {
      setTimeout(() => {
        setExpandAnimationIndex(i - 1)
        if (i === 0) {
          setIsExpanded(false)
          setCurrentPage(1)
          sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
        }
      }, (currentDisplayCount - i) * 80)
    }
  }

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1)
    }
  }, [currentPage, handlePageChange])

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1)
    }
  }, [currentPage, totalPages, handlePageChange])

  // Keyboard arrow navigation
  useEffect(() => {
    if (!isExpanded) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && currentPage > 1) {
        handlePageChange(currentPage - 1)
      } else if (e.key === "ArrowRight" && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isExpanded, currentPage, totalPages, handlePageChange])

  // Touch swipe handlers
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isExpanded && totalPages > 1) {
      if (isLeftSwipe && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      } else if (isRightSwipe && currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    }
  }

  // Mouse drag handlers
  const onMouseDown = (e: React.MouseEvent) => {
    setMouseStart(e.clientX)
    setIsDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    // Prevent text selection while dragging
    e.preventDefault()
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) {
      setIsDragging(false)
      return
    }
    
    const distance = mouseStart - e.clientX
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance
    
    if (isExpanded && totalPages > 1) {
      if (isLeftSwipe && currentPage < totalPages) {
        handlePageChange(currentPage + 1)
      } else if (isRightSwipe && currentPage > 1) {
        handlePageChange(currentPage - 1)
      }
    }
    
    setMouseStart(null)
    setIsDragging(false)
  }

  const onMouseLeave = () => {
    setMouseStart(null)
    setIsDragging(false)
  }

  // Format description - strip HTML tags and truncate
  const formatDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "")
    return text.length > 100 ? text.substring(0, 100) + "..." : text
  }

 return (
   <section 
  id="research" 
  ref={sectionRef} 
  className="relative overflow-hidden bg-fixed bg-center bg-no-repeat bg-cover py-24 md:py-32"
  style={{ backgroundImage: "url('/images/back2.jpg')" }}
>
      {/* Background Elements - 은은하고 깊이감 있는 프리미엄 아카이브 무드 */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/3 opacity-[0.4]" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-secondary/3 opacity-[0.4]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* 배경 이미지 위에 어두운 톤을 깔아 텍스트 가독성을 완벽하게 보장합니다 */}
<div className="absolute inset-0 bg-black/50 z-0" />
        {/* Section Header */}
        <div
          className={`mb-20 text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-foreground sm:text-4xl">연구활동</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-600/60">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-5 font-sans text-base font-light tracking-wide text-muted-foreground">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
        </div>

        {/* Loading State */}
        {isLoading && allPosts.length === 0 && (
          <div className="flex items-center justify-center py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-700 border-t-transparent" />
            <span className="ml-3 font-sans text-sm font-light text-muted-foreground">블로그 글을 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && allPosts.length === 0 && (
          <div className="py-16 text-center">
            <p className="mb-5 font-sans text-sm text-muted-foreground">{error}</p>
            <a
              href={`https://blog.naver.com/${blogId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-xl bg-amber-800 px-6 py-3 font-sans text-sm font-medium text-white shadow-sm transition-all duration-300 hover:bg-amber-900 hover:scale-105"
            >
              블로그에서 직접 보기
            </a>
          </div>
        )}

        {/* Blog Posts Grid - 프리미엄 오리지널 격자 디자인 인터랙션 */}
        {allPosts.length > 0 && (
          <div
            ref={gridRef}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
            className={`grid gap-8 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-500 select-none ${
              isAnimating ? "opacity-0" : "opacity-100"
            } ${isDragging ? "cursor-grabbing" : isExpanded && totalPages > 1 ? "cursor-grab" : ""}`}
          >
            {displayPosts.map((post, index) => {
              const postDate = new Date(post.pubDate)
              const shouldShow = !isExpanded || index <= expandAnimationIndex || index < 3

              // 제목에서 에피소드 번호 패턴 검출 로직 보완
              const epMatch = post.title.match(/EPISODE\s*\d+/i) || post.description.match(/EPISODE\s*\d+/i)
              const cleanEpisode = epMatch ? epMatch[0].toUpperCase() : "RESEARCH"
              
              // 제목 및 본문 텍스트 내 중복 텍스트 파싱 처리
              const cleanTitle = post.title.replace(/<[^>]*>/g, "").replace(/EPISODE\s*\d+\s*/i, "").trim()

              return (
                <a
                  key={post.link + index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-card p-8 ring-1 ring-border/40 transition-all ease-out hover:-translate-y-2 hover:shadow-[0_22px_50px_rgba(139,92,26,0.06)] ${
                    shouldShow 
                      ? "translate-y-0 opacity-100 scale-100 duration-500" 
                      : "translate-y-8 opacity-0 scale-95 duration-300"
                  } ${isVisible ? "" : "translate-y-10 opacity-0"}`}
                  style={{ 
                    transitionDelay: isExpanded ? "0ms" : `${index * 80}ms`,
                  }}
                >
                  {/* 고급스러운 오렌지-브라운 상단 액센트 라인 모션 효과 */}
                  <div className="absolute top-0 left-0 h-[3px] w-0 bg-amber-700/50 transition-all duration-500 group-hover:w-full" />
                  
                  <div>
                    {/* 카드 메타 영역: 아카이브 넘버링 배지와 세련된 날짜 표현 */}
                    <div className="mb-5 flex items-center justify-between">
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-amber-900 font-serif ring-1 ring-stone-200/60">
                        {cleanEpisode}
                      </span>
                      <span className="text-xs font-light text-muted-foreground/70 font-sans">
                        {postDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                      </span>
                    </div>
                    
                    {/* 명조 서체(font-serif) 결을 입힌 진중한 아카데믹 타이틀 */}
                    <h3 className="mb-4 font-serif text-lg font-bold leading-snug tracking-tight text-foreground transition-colors duration-300 group-hover:text-amber-800 line-clamp-2">
                      {cleanTitle}
                    </h3>

                    {/* 가독성을 높인 본문 요약 단락 */}
                    <p className="font-sans text-sm font-light leading-relaxed text-muted-foreground/90 line-clamp-4">
                      {formatDescription(post.description).replace(/EPISODE\s*\d+\s*/i, "")}
                    </p>
                  </div>

                  {/* 하단 디테일 링크 시각 효과 포인트 */}
                  <div className="mt-6 flex items-center gap-1.5 text-xs font-medium text-amber-800/0 opacity-0 transition-all duration-500 transform -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-amber-800 font-sans">
                    자세히 읽기 <span className="text-sm transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Show More / Collapse Button */}
        {allPosts.length > 3 && (
          <div className="mt-12 text-center">
            {!isExpanded ? (
              <button
                onClick={handleShowMore}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-800/40 bg-transparent px-6 py-3 font-sans text-sm font-medium text-amber-900 transition-all duration-300 hover:bg-amber-800 hover:text-white hover:scale-105 shadow-sm"
              >
                더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleCollapse}
                className="inline-flex items-center gap-2 rounded-xl border border-muted-foreground/20 bg-transparent px-6 py-3 font-sans text-sm font-medium text-muted-foreground transition-all duration-300 hover:border-amber-800 hover:text-amber-900 hover:scale-105 shadow-sm"
              >
                접기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform duration-300"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Pagination - only visible when expanded */}
        {isExpanded && totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-5">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-1.5 rounded-xl border border-amber-800/30 bg-card px-4 py-2 font-sans text-xs font-medium text-amber-900 transition-all duration-300 hover:bg-amber-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/xl"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              이전
            </button>
            <span className="font-serif text-sm font-medium text-foreground tracking-wide">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 rounded-xl border border-amber-800/30 bg-card px-4 py-2 font-sans text-xs font-medium text-amber-900 transition-all duration-300 hover:bg-amber-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40 shadow-sm"
            >
              다음
              <svg
                xmlns="http://www.w3.org/2000/xl"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
