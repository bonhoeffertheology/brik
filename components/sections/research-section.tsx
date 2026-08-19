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
  
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const blogId = "jelsayou"

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
    }

    const updateParallax = () => {
      const ease = 0.08
      animatedY += (targetY - animatedY) * ease
      bg.style.transform = `translate3d(0, ${animatedY}%, 0)`
      animationFrameId = requestAnimationFrame(updateParallax)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()
    animationFrameId = requestAnimationFrame(updateParallax)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  const handleToggleExpand = () => {
    if (isExpanded) {
      setIsExpanded(false)
      setTimeout(() => {
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start"
        })
      }, 50)
    } else {
      setIsExpanded(true)
    }
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
    return text.length > 100 ? text.substring(0, 100) + "..." : text
  }

  // 상위 6개(가로 3 × 세로 2 카드)와 추가 글 분리
  const mainCards = allPosts.slice(0, 6)
  const extendedPosts = allPosts.slice(6)

  return (
    <section 
      id="research" 
      ref={sectionRef} 
      className="relative w-full overflow-hidden py-24 md:py-32 border-x-2 border-white select-none"
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes customShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
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
      <div className="absolute inset-0 bg-stone-950/35 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 상단 타이틀 구역 (화면 중앙 정렬) */}
        <div className="mb-14 border-b border-white/10 pb-8 text-center">
          <div className="inline-flex flex-col items-center">
            <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">
              연구활동
            </h2>
            <div className="mt-3 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
              <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
            </div>
          </div>
          <p className="mt-4 font-sans text-sm md:text-base font-light tracking-wide text-stone-200/90">
            본회퍼의 신학과 사상을 연구하고 나눕니다
          </p>
        </div>

        {/* 로딩 / 에러 */}
        {isLoading && allPosts.length === 0 && (
          <div className="text-center text-white/80 py-16 font-sans">블로그 데이터를 불러오는 중입니다...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-amber-400 py-16 font-sans">{error}</div>
        )}

        {/* 1. 기본 3열 × 2행 (총 6개) 주요 카드 그리드 */}
        {mainCards.length > 0 && (
          <div className={`research-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 ${isVisible ? "visible" : ""}`}>
            {mainCards.map((post, index) => (
              <a 
                key={index} 
                href={post.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex flex-col justify-between rounded-2xl bg-stone-900/40 hover:bg-stone-900/70 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl border border-white/15 hover:border-amber-400/60 motion-card min-h-[220px]"
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
                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-sans tracking-wider text-stone-400">
                  <span className="font-medium text-stone-300 group-hover:text-amber-300 transition-colors">한국본회퍼연구소장</span>
                  <span className="text-stone-400/80">{formatDate(post.pubDate)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 2. '더보기' 활성화 시 펼쳐지는 아카이브 리스트 */}
        {isExpanded && extendedPosts.length > 0 && (
          <div className="mt-8 rounded-2xl bg-stone-900/30 backdrop-blur-md border border-white/10 p-4 sm:p-6 divide-y divide-white/5 animate-fadeIn">
            <div className="pb-3 px-3 text-xs font-sans font-medium text-amber-400/90 tracking-wider">
              이전 연구활동 목록 ({extendedPosts.length})
            </div>
            
            <div className="divide-y divide-white/5">
              {extendedPosts.map((post, index) => {
                const reverseNumber = allPosts.length - (index + 6);
                
                return (
                  <a
                    key={index}
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 py-3.5 px-3 rounded-xl hover:bg-white/5 transition-all duration-200"
                  >
                    {/* 역순 번호 & 제목 (모바일 2줄 표시) */}
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <span className="text-amber-500/70 text-xs font-mono shrink-0 pt-0.5 sm:pt-0">
                        {String(reverseNumber).padStart(2, '0')}
                      </span>
                      <h4 className="font-serif text-[15px] font-medium text-stone-200 group-hover:text-amber-300 transition-colors line-clamp-2 sm:line-clamp-1 break-keep leading-snug">
                        {post.title}
                      </h4>
                    </div>

                    {/* 날짜 및 바로가기 */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 text-xs font-sans text-stone-400/80 pl-7 sm:pl-0">
                      <span>{formatDate(post.pubDate)}</span>
                      <span className="text-stone-400 group-hover:text-amber-300 group-hover:translate-x-0.5 transition-all">
                        →
                      </span>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. 더보기 / 접기 토글 버튼 */}
        {allPosts.length > 6 && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleToggleExpand} 
              className="inline-flex items-center gap-2.5 rounded-xl border border-white/20 bg-black/25 backdrop-blur-md px-8 py-3 text-sm font-medium text-white hover:bg-amber-500 hover:text-stone-950 hover:border-amber-500 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-sm"
            >
              <span>{isExpanded ? "목록 접기" : `더보기 (${extendedPosts.length}개 더보기)`}</span>
              <span className="text-xs transition-transform duration-300">
                {isExpanded ? "▲" : "▼"}
              </span>
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
