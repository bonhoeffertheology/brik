"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

const POSTS_PER_PAGE = 9
const CACHE_KEY = "brik_blog_cache"
const CACHE_DURATION = 10 * 60 * 1000 // 10분 캐시

export function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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

  useEffect(() => {
    loadBlogPosts()
  }, [loadBlogPosts])

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

  const displayPosts = isExpanded
    ? allPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE)
    : allPosts.slice(0, 3)

  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
    sectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  const handleShowMore = () => {
    setIsExpanded(true)
    setCurrentPage(1)
  }

  const handleCollapse = () => {
    setIsExpanded(false)
    setCurrentPage(1)
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  // Touch & Mouse Swipe Handlers
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
    if (isExpanded && totalPages > 1) {
      if (distance > minSwipeDistance && currentPage < totalPages) handlePageChange(currentPage + 1)
      if (distance < -minSwipeDistance && currentPage > 1) handlePageChange(currentPage - 1)
    }
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
    if (isExpanded && totalPages > 1) {
      if (distance > minSwipeDistance && currentPage < totalPages) handlePageChange(currentPage + 1)
      if (distance < -minSwipeDistance && currentPage > 1) handlePageChange(currentPage - 1)
    }
    setMouseStart(null)
    setIsDragging(false)
  }

  // HTML 태그 제거 및 글자수 제한 안전 장치
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
      {/* 고정 배경 패럴렉스 레이어 (연구활동 섹션 스코프 내 작동) */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center
