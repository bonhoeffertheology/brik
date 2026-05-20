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
    className="relative w-full overflow-hidden py-24 md:py-32"
  >
    {/* 배경 이미지 레이어: 화면 전체를 덮도록 설정 */}
    <div className="absolute inset-0 z-0">
      <img 
        src="/images/back2.png" 
        alt="배경" 
        className="w-full h-full object-cover object-center"
      />
      {/* 어두운 오버레이 레이어 */}
      <div className="absolute inset-0 bg-black/60" />
    </div>

    {/* 콘텐츠 영역: 기존 로직을 모두 복원 */}
    <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      
      {/* 섹션 헤더 */}
      <div className={`mb-20 text-center transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
        <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">연구활동</h2>
        <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500">
          <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
        </div>
        <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
      </div>

      {/* 블로그 데이터 로딩/에러 처리 로직 */}
      {isLoading && allPosts.length === 0 && (
        <div className="flex items-center justify-center py-16 text-white">로딩 중...</div>
      )}

      {/* 블로그 포스트 그리드 (복원된 핵심 로직) */}
      {allPosts.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {displayPosts.map((post, index) => (
            <a key={index} href={post.link} target="_blank" rel="noopener noreferrer" className="group flex flex-col rounded-2xl bg-white/95 p-8 shadow-lg hover:shadow-2xl transition-all">
              <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest">RESEARCH</span>
              <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 line-clamp-2">{post.title}</h3>
              <p className="mt-2 text-sm text-stone-600 line-clamp-3">{post.description}</p>
            </a>
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {allPosts.length > 3 && (
        <div className="mt-12 text-center">
          <button onClick={isExpanded ? handleCollapse : handleShowMore} className="rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-all">
            {isExpanded ? "접기" : "더보기"}
          </button>
        </div>
      )}
    </div>
  </section>
)
