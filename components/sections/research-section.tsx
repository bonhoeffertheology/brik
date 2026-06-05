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

  const displayPosts = allPosts

  const onTouchStart = (e: React.TouchEvent) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX) }
  const onTouchMove = (e: React.TouchEvent) => { setTouchEnd(e.targetTouches[0].clientX) }
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) handleToggleExpand()
  }
  const onMouseDown = (e: React.MouseEvent) => { setMouseStart(e.clientX); setIsDragging(true) }
  const onMouseMove = (e: React.MouseEvent) => { if (isDragging) e.preventDefault() }
  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDragging || !mouseStart) return
    const distance = mouseStart - e.clientX
    if (distance > minSwipeDistance && !isExpanded) setIsExpanded(true)
    if (distance < -minSwipeDistance && isExpanded) handleToggleExpand()
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
    return text.length > 110 ? text.substring(0, 110) + "..." : text
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
        .research-grid-container {
          transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 595px;
        }
        .research-grid-container.expanded {
          max-height: 4500px;
        }
        
        /* 💡 [트랜지션 완전 분리] 하드웨어 가속 및 글자 왜곡 방지 속성 설정 */
        .motion-card {
          backface-visibility: hidden;
          transform: translateY(35px);
          opacity: 0;
          
          /* 진입과 호버 복귀 시 사용될 딜레이 없는 순수 부드러운 감속 트랜지션 정의 */
          transition: transform 0.45s cubic-bezier(0.215, 0.610, 0.355, 1.000), 
                      box-shadow 0.45s cubic-bezier(0.215, 0.610, 0.355, 1.000), 
                      border-color 0.4s ease, 
                      opacity 0.6s ease;
        }
        
        /* 💡 스크롤 진입 시 원위치 상승 */
        .research-grid-container.visible .motion-card {
          opacity: 1;
          transform: translateY(0);
        }
        
        /* 💡 호버 시 부드럽게 위로 상승 (중첩 클래스로 우선순위 완전 보장) */
        .research-grid-container .motion-card:hover {
          transform: translateY(-12px) !important;
        }
        
        @media (max-width: 768px) {
          .research-grid-container {
            max-height: 1855px;
          }
          .research-grid-container.expanded {
            max-height: 9000px;
          }
        }
      `}} />

      {/* 고성능 패럴렉스 수직 무빙 백그라운드 레이어 */}
      <div className="absolute inset-x-0 top-[-20%] h-[140%] z-0 will-change-transform" ref={bgRef}>
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat" 
          style={{ backgroundImage: `url('images/back21.png')` }} 
        />
      </div>
      <div className="absolute inset-0 bg-stone-900/50 z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* 상단 타이틀 구역 */}
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

        {/* 로딩 / 에러 */}
        {isLoading && allPosts.length === 0 && (
          <div className="text-center text-white/70 py-16 font-sans">블로그 데이터를 불러오는 중입니다...</div>
        )}
        {error && !isLoading && (
          <div className="text-center text-amber-400 py-16 font-sans">{error}</div>
        )}

        {/* 연구활동 배너 그리드 목록 */}
        {allPosts.length > 0 && (
          <div className={`research-grid-container grid gap-8 md:grid-cols-2 lg:grid-cols-3 overflow-hidden pt-3 ${isVisible ? "visible" : ""} ${isExpanded ? "expanded" : ""}`}>
            {displayPosts.map((post, index) => {
              return (
                <a 
                  key={index} 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col rounded-3xl bg-stone-50/95 p-9 shadow-lg hover:shadow-2xl border border-stone-200/40 hover:border-amber-700/40 motion-card z-10 relative"
                  style={{
                    /* 💡 인라인 transitionDelay는 처음 등장(visible이 아닐 때)할 때만 순차적으로 적용되게 하고, 등장 이후에는 0s로 소멸시켜 호버 모션에 절대 간섭하지 못하게 격리했습니다. */
                    transitionDelay: isVisible ? "0s" : `${(index % 3) * 0.12}s`,
                  }}
                >
                  {/* 제목 */}
                  <h3 className="font-serif text-xl font-bold leading-snug text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* 본문 */}
                  <p className="mt-4 flex-1 font-serif text-[15px] font-normal leading-relaxed text-stone-600 line-clamp-4">
                    {formatDescription(post.description)}
                  </p>

                  {/* 하단 영역 */}
                  <div className="mt-6 flex items-center justify-between border-t border-stone-200/60 pt-4 text-xs font-sans tracking-wider text-stone-400">
                    <span className="font-medium text-stone-500 group-hover:text-amber-800 transition-colors">한국본회퍼연구소장</span>
                    <span>{formatDate(post.pubDate)}</span>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {/* 더보기 버튼 구역 */}
        {allPosts.length > 3 && (
          <div className="mt-12 text-center">
            <button 
              onClick={handleToggleExpand} 
              className="rounded-xl border border-white/30 bg-white/5 px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-stone-950 transition-all duration-300 transform hover:scale-102 active:scale-98 shadow-sm"
            >
              {isExpanded ? "접기" : "더보기"}
            </button>
          </div>
        )}

      </div>
    </section>
  )
}
