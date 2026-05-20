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
          return posts
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

  const displayPosts = allPosts

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX) }
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX) }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) setIsExpanded(false)
  }
  const onMouseDown = (e: React.MouseEvent) => { setMouseStart(e.clientX); setIsDragging(true) }
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) e.preventDefault() }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    const distance = mouseStart - e.clientX
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) setIsExpanded(false)
    setMouseStart(null); setIsDragging(false)
  }

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
      {/* 스타일 태그: 고품격 학술 카드 디자인 및 타이포그래피 (격조 있는 명조 기반) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes cardFadeInUp {
          0% { opacity: 0; transform: translateY(30px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
        }
        /* 공백문자 안전 인코딩 처리된 패럴렉스 배경 (유지) */
        .parallax-bg-fixed {
          background-image: url('images/Front%20%26%20back%20cover.webp');
          background-attachment: fixed;
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
        }
        .research-grid-container {
          transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 580px; /* 카드가 더 격식 있게 커져서 기본 높이를 살짝 높임 */
        }
        .research-grid-container.expanded {
          max-height: 4000px;
        }
        .motion-card {
          opacity: 0;
        }
        .research-grid-container.visible .motion-card {
          animation: cardFadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 768px) {
          .parallax-bg-fixed {
            background-attachment: scroll;
          }
          .research-grid-container {
            max-height: 1800px;
          }
          .research-grid-container.expanded {
            max-height: 8000px;
          }
        }
      `}} />

      {/* 패럴렉스 이미지 배경 레이어 */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 w-full h-full parallax-bg-fixed" />
        <div className="absolute inset-0 bg-stone-900/50" />
      </div>

      {/* 내부 콘텐츠 실체 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* 격조 있는 고딕 헤더 디자인 (유지) */}
        <div 
          className="mb-20 text-center transition-all duration-1000 transform"
          style={{
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            opacity: isVisible ? 1 : 0
          }}
        >
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">연구활동</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
        </div>

        {/* 로딩 및 에러 처리 */}
        {isLoading && allPosts.length === 0 && (
          <div className="text-center text-white/70 py-16 font-sans">블로그 데이터를 불러오는 중입니다...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-amber-400 py-16 font-sans">{error}</div>
        )}

        {/* 연구 목록 카드 그리드: 전문적인 학술 카드 디자인 기반 */}
        {allPosts.length > 0 && (
          <div className={`research-grid-container grid gap-8 md:grid-cols-2 lg:grid-cols-3 overflow-hidden ${isVisible ? "visible" : ""} ${isExpanded ? "expanded" : ""}`}>
            {displayPosts.map((post, index) => {
              const isHidden = !isExpanded && index >= 3;
              return (
                <a 
                  key={index} 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col rounded-3xl bg-stone-50/95 p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-stone-200/50 hover:border-amber-700/50 motion-card"
                  style={{
                    animationDelay: `${(index % 3) * 0.15}s`,
                    display: isHidden ? "none" : "flex",
                  }}
                >
                  {/* 제목: 더 묵직하고 고풍스러운 명조체 기반 (예: Noto Serif KR, Batang) */}
                  <h3 className="font-serif text-xl font-extrabold leading-tight text-stone-950 group-hover:text-amber-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  
                  {/* 본문: 가독성 좋은 전문적인 웹 명조체 기반 */}
                  <p className="mt-5 flex-1 font-serif text-base font-light leading-relaxed text-stone-700 line-clamp-4">
                    {formatDescription(post.description)}
                  </p>

                  {/* 하단 세부 정보 영역: 고딕으로 가볍게 처리하여 균형 유지 */}
                  <div className="mt-8 flex items-center justify-between border-t border-stone-200/50 pt-5 text-xs text-stone-500 font-sans tracking-wide">
                    <span>{pub.publisher} (Bonhoeffer Theology)</span>
                    <span>{pub.author || '연구소'}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* 더보기 버튼 (유지) */}
        {allPosts.length > 3 && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="rounded-xl border border-white/30 bg-white/5 px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-stone-950 transition-all duration-300 transform hover:scale-102 active:scale-98 shadow-sm"
            >
              {isExpanded ? "연구글 접기" : "연구글 더보기"}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
