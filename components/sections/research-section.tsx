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
    <section id="research" ref={sectionRef} className="relative overflow-hidden bg-muted py-20 md:py-28">
      {/* Background Elements */}
      <div className="pointer-events-none absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-primary/5" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[300px] w-[300px] rounded-full bg-secondary/5" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`mb-16 text-center transition-all duration-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold text-primary md:text-4xl">연구활동</h2>
          <div className="mx-auto h-0.5 w-16 overflow-hidden bg-accent">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-4 text-lg text-muted-foreground">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
        </div>

        {/* Loading State */}
        {isLoading && allPosts.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <span className="ml-3 text-muted-foreground">블로그 글을 불러오는 중...</span>
          </div>
        )}

        {/* Error State */}
        {error && allPosts.length === 0 && (
          <div className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">{error}</p>
            <a
              href={`https://blog.naver.com/${blogId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-all duration-300 hover:scale-105"
            >
              블로그에서 직접 보기
            </a>
          </div>
        )}

        {/* Blog Posts Grid */}
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
            className={`grid gap-6 md:grid-cols-2 lg:grid-cols-3 transition-opacity duration-300 select-none ${
              isAnimating ? "opacity-0" : "opacity-100"
            } ${isDragging ? "cursor-grabbing" : isExpanded && totalPages > 1 ? "cursor-grab" : ""}`}
          >
            {displayPosts.map((post, index) => {
              const postDate = new Date(post.pubDate)
              const colorStyle = accentColors[index % 3]
              const shouldShow = !isExpanded || index <= expandAnimationIndex || index < 3

              return (
                <a
                  key={post.link + index}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group block transition-all ease-out hover:scale-[1.02] hover:-translate-y-1 ${
                    shouldShow 
                      ? "translate-y-0 opacity-100 scale-100 duration-500" 
                      : "translate-y-8 opacity-0 scale-95 duration-300"
                  } ${isVisible ? "" : "translate-y-10 opacity-0"}`}
                  style={{ 
                    transitionDelay: isExpanded ? "0ms" : `${index * 100}ms`,
                  }}
                >
                  <div className={`relative h-full overflow-hidden rounded-xl ${colorStyle.bg} p-6 shadow-sm ring-1 ring-border/50 transition-all duration-300 hover:shadow-lg hover:ring-border`}>
                    {/* Color accent bar on top */}
                    <div className={`absolute left-0 top-0 h-1 w-full ${colorStyle.bar}`} />
                    
                    <h3 className="mb-3 line-clamp-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                      {post.title}
                    </h3>
                    <p className="mb-3 text-sm text-accent">
                      {postDate.toLocaleDateString("ko-KR", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                    <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {formatDescription(post.description)}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        )}

        {/* Show More / Collapse Button */}
        {allPosts.length > 3 && (
          <div className="mt-10 text-center">
            {!isExpanded ? (
              <button
                onClick={handleShowMore}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-primary bg-transparent px-6 py-3 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground hover:scale-105"
              >
                더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
                className="inline-flex items-center gap-2 rounded-lg border-2 border-muted-foreground/30 bg-transparent px-6 py-3 font-medium text-muted-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:scale-105"
              >
                접기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
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
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={goToPrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
            <span className="text-lg font-medium text-foreground">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 rounded-lg border border-primary bg-card px-4 py-2 font-medium text-primary transition-all duration-300 hover:bg-primary hover:text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50"
            >
              다음
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
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
