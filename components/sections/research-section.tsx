"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

// 빌드 에러를 방지하기 위해 애니메이션에 사용되지 않는 accentColors는 제거했습니다.
const POSTS_PER_PAGE = 3
const CACHE_KEY = "brik_blog_cache"
const CACHE_DURATION = 10 * 60 * 1000 // 10분 캐시

export function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Swipe & Drag State (기존 로직 보존)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [mouseStart, setMouseStart] = useState<number | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const blogId = "jelsayou"
  const minSwipeDistance = 50

  // 로컬 스토리지 캐시 관리 로직
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
      // 캐시 에러 무시
    }
    return null
  }, [])

  const setCachedPosts = useCallback((posts: BlogPost[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }))
    } catch {
      // 캐시 에러 무시
    }
  }, [])

  // Naver RSS 파싱
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
        throw new Error("블로그 데이터를 파싱할 수 없습니다.")
      }
    } catch (err) {
      console.error("블로그 로딩 실패:", err)
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
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // 더보기 여부에 따라 3개 또는 전체 표기
  const displayPosts = isExpanded ? allPosts : allPosts.slice(0, 3)

  // Touch & Mouse 드래그/스와이프 제어 로직 (기존 로직 보존)
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
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) setIsExpanded(false)
  }

  const onMouseDown = (e: React.MouseEvent) => {
    setMouseStart(e.clientX)
    setIsDragging(true)
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (isDragging) e.preventDefault()
  }

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    const distance = mouseStart - e.clientX
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) setIsExpanded(false)
    setMouseStart(null)
    setIsDragging(false)
  }

  // HTML 태그 제거 및 글자수 제한 함수
  const formatDescription = (html: string) => {
    const text = html.replace(/<[^>]*>/g, "")
    return text.length > 100 ? text.substring(0, 100) + "..." : text
  }

  return (
    <section 
      id="research" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden py-24 md:py-32"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* 고정 배경 패럴렉스 효과 레이어: 확실한 적용을 위해 CSS 직접 선언 */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/back2.png')",
            backgroundAttachment: "fixed"
          }}
        />
        {/* 어두운 오버레이 레이어: 텍스트 가독성 확보 */}
        <div className="absolute inset-0 bg-black/65" />
      </div>

      {/* 실 콘텐츠 레이어 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 애니메이션 효과가 적용된 섹션 헤더 */}
        <div className={`mb-20 text-center transition-all duration-1000 transform ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">연구활동</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500">
            <div className="h-full w-full animate-shimmer bg-gradient-to-r from-transparent via-white/80 to-transparent" />
          </div>
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
        </div>

        {/* 로딩 및 에러 핸들링 상태 표기 */}
        {isLoading && allPosts.length === 0 && (
          <div className="text-center text-white py-16">블로그 데이터를 불러오는 중입니다...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-amber-400 py-16">{error}</div>
        )}

        {/* 연구글 카드 그리드 리스트: 호버 시 애니메이션 효과 추가 */}
        {allPosts.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post, index) => (
              <a 
                key={index} 
                href={post.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex flex-col rounded-2xl bg-white/95 p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 duration-300"
              >
                <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest">RESEARCH</span>
                <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 line-clamp-2">{post.title}</h3>
                <p className="mt-2 font-sans text-sm text-stone-600 leading-relaxed line-clamp-3">
                  {formatDescription(post.description)}
                </p>
              </a>
            ))}
          </div>
        )}

        {/* 애니메이션 효과가 적용된 제어 버튼 */}
        {allPosts.length > 3 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="rounded-xl border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-all duration-300 transform hover:scale-105 active:scale-95"
            >
              {isExpanded ? "접기" : "연구글 더보기"}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
