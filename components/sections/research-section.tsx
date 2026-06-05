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
  const bgRef = useRef<HTMLDivElement>(null) // 💡 패럴렉스 제어용 Ref 추가
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

  // 1. 컴포넌트 등장 뷰포트 감시
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  // 💡 2. 순수 자바스크립트 관성 패럴렉스 엔진 연동 (튀는 fixed 방식 전면 교체)
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

      // 스크롤 시 -20%에서 +20% 구간을 유연하게 패럴렉스 무빙
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
        @keyframes cardFadeInUp {
          0% { opacity: 0; transform: translateY(35px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-shimmer-core {
          animation: customShimmer 2.5s infinite linear;
        }
        /* 💡 [모션 닫힘 최적화 포인트 1] 접힐 때(transition)와 펼칠 때 균일하고 부드러운 하이 엔드 트랜지션 곡선을 주어 부드럽게 축소되도록 제어 */
        .research-grid-container {
          transition: max-height 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 595px;
        }
        .research-grid-container.expanded {
          max-height: 4500px;
        }
        .motion-card {
          opacity: 0;
          transition: opacity 0.4s ease, transform 0.4s ease;
        }
        .research-grid-container.visible .motion-card {
          animation: cardFadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
              /* 💡 [모션 닫힘 최적화 포인트 2] 
                 기존 'display: none' 처리는 애니메이션을 즉시 소멸시키므로 지우고, 
                 대신 컨테이너의 max-height와 overflow-hidden으로 부드럽게 자연 압축 가림 처리되도록 구조를 개선했습니다.
              */
              return (
                <a 
                  key={index} 
                  href={post.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="group flex flex-col rounded-3xl bg-stone-50/95 p-9 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-stone-200/40 hover:border-amber-700/40 motion-card hover:z-10 will-change-transform relative"
                  style={{
                    animationDelay: isExpanded ? "0s" : `${(index % 3) * 0.15}s`,
                  }}
                >
                  {/* 제목: 중후하고 고풍스러운 고딕체 적용 */}
                  <h3 className="font-serif text-xl font-bold leading-snug text-stone-900 group-hover:text-amber-900 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  {/* 본문: 가독성이 뛰어난 학술 스타일 웹 고딕체 적용 */}
                  <p className="mt-4 flex-1 font-serif text-[15px] font-normal leading-relaxed text-stone-600 line-clamp-4">
                    {formatDescription(post.description)}
                  </p>

                  {/* 하단 영역: 단조로움을 없애는 장식선 및 데이터 표기 */}
                  <div className="mt-6 flex items-center justify-between border-t border-stone-200/60 pt-4 text-xs font-sans tracking-wider text-stone-400">
                    {/* 💡 요청 사항: 원본 명칭을 '한국본회퍼연구소장'으로 교체 완료 */}
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
              onClick={() => setIsExpanded(!isExpanded)} 
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
