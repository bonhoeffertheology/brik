"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

const CACHE_KEY = "brik_blog_cache_stable_v6"
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
        if (Date.now() - timestamp < CACHE_DURATION && Array.isArray(posts) && posts.length > 0) {
          return posts as BlogPost[]
        }
      }
    } catch {
      /* 무시 */
    }
    return null
  }, [])

  const setCachedPosts = useCallback((posts: BlogPost[]) => {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ posts, timestamp: Date.now() }))
    } catch {
      /* 무시 */
    }
  }, [])

  const decodeHtml = (text: string) => {
    try {
      const parser = new DOMParser()
      const dom = parser.parseFromString(`<!doctype html><body>${text}`, "text/html")
      return dom.body.textContent || ""
    } catch {
      return text.replace(/<[^>]*>/g, "").trim()
    }
  }

  const parseXML = useCallback((xmlText: string): BlogPost[] | null => {
    try {
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")
      if (xmlDoc.querySelector("parsererror")) return null

      const items = xmlDoc.querySelectorAll("item")
      if (items.length === 0) return null

      return Array.from(items).map((item) => {
        const rawTitle = item.querySelector("title")?.textContent || "제목 없음"
        const rawDesc = item.querySelector("description")?.textContent || ""
        const link = item.querySelector("link")?.textContent || `https://blog.naver.com/${blogId}`
        const pubDate = item.querySelector("pubDate")?.textContent || new Date().toISOString()

        return {
          title: decodeHtml(rawTitle),
          link: link.trim(),
          description: decodeHtml(rawDesc),
          pubDate: pubDate.trim(),
        }
      })
    } catch {
      return null
    }
  }, [blogId])

  const fetchWithTimeout = async (url: string, timeout = 5000): Promise<Response> => {
    const controller = new AbortController()
    const id = setTimeout(() => controller.abort(), timeout)
    try {
      const res = await fetch(url, { signal: controller.signal })
      clearTimeout(id)
      return res
    } catch (e) {
      clearTimeout(id)
      throw e
    }
  }

  const loadBlogPosts = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    const cached = getCachedPosts()
    if (cached) {
      setAllPosts(cached)
      setIsLoading(false)
    }

    const rssUrl = `https://rss.blog.naver.com/${blogId}.xml?count=30`

    // 1. Next.js 내부 API 라우트 우선 확인
    try {
      const localRes = await fetchWithTimeout("/api/blog-rss", 2500)
      if (localRes.ok) {
        const text = await localRes.text()
        const parsed = parseXML(text)
        if (parsed && parsed.length > 0) {
          setAllPosts(parsed)
          setCachedPosts(parsed)
          setIsLoading(false)
          return
        }
      }
    } catch {
      /* 다음 단계 진행 */
    }

    // 2. rss2json API 시도
    try {
      const jsonRes = await fetchWithTimeout(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`,
        4500
      )
      if (jsonRes.ok) {
        const data = await jsonRes.json()
        if (data.status === "ok" && Array.isArray(data.items) && data.items.length > 0) {
          const parsed: BlogPost[] = data.items.map((item: any) => ({
            title: decodeHtml(item.title || "제목 없음"),
            link: item.link || `https://blog.naver.com/${blogId}`,
            description: decodeHtml(item.description || ""),
            pubDate: item.pubDate || new Date().toISOString(),
          }))
          setAllPosts(parsed)
          setCachedPosts(parsed)
          setIsLoading(false)
          return
        }
      }
    } catch {
      /* 다음 단계 진행 */
    }

    // 3. allorigins 프록시 시도
    try {
      const allOriginsRes = await fetchWithTimeout(
        `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}&timestamp=${Date.now()}`,
        5000
      )
      if (allOriginsRes.ok) {
        const data = await allOriginsRes.json()
        if (data.contents) {
          const parsed = parseXML(data.contents)
          if (parsed && parsed.length > 0) {
            setAllPosts(parsed)
            setCachedPosts(parsed)
            setIsLoading(false)
            return
          }
        }
      }
    } catch {
      /* 다음 단계 진행 */
    }

    // 4. codetabs 프록시 시도
    try {
      const codetabsRes = await fetchWithTimeout(
        `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`,
        5000
      )
      if (codetabsRes.ok) {
        const xmlText = await codetabsRes.text()
        const parsed = parseXML(xmlText)
        if (parsed && parsed.length > 0) {
          setAllPosts(parsed)
          setCachedPosts(parsed)
          setIsLoading(false)
          return
        }
      }
    } catch {
      /* 실패 시 캐시 데이터 유지 */
    }

    if (!cached) {
      setError("글 목록을 불러오는 중 문제가 발생했습니다.")
      setIsLoading(false)
    }
  }, [blogId, getCachedPosts, setCachedPosts, parseXML])

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

      targetY = -20 + progress * 40
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
          block: "start",
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
      return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`
    } catch {
      return ""
    }
  }

  const formatDescription = (text: string) => {
    const clean = text.replace(/<[^>]*>/g, "").trim()
    return clean.length > 95 ? clean.substring(0, 95) + "..." : clean
  }

  const mainCards = allPosts.slice(0, 6)
  const extendedPosts = allPosts.slice(6)

  return (
    <section
      id="research"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-24 md:py-32 border-x-2 border-white select-none"
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
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

        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-card-appear {
          animation: fadeInScale 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `,
        }}
      />

      {/* 패럴렉스 배경 레이어 */}
      <div className="absolute inset-x-0 top-[-20%] h-[140%] z-0 will-change-transform" ref={bgRef}>
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('images/back21.png')` }}
        />
      </div>
      <div className="absolute inset-0 bg-stone-950/15 backdrop-blur-[0.5px] z-0 pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* 상단 타이틀 구역 */}
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

        {/* 1. 기본 상위 6개 주요 카드 그리드 */}
        {mainCards.length > 0 && (
          <div
            className={`research-grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2 ${
              isVisible ? "visible" : ""
            }`}
          >
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
                  <h3 className="font-serif text-[16.5px] font-bold leading-snug text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="mt-3 font-serif text-[13px] font-light leading-relaxed text-stone-300/85 line-clamp-3">
                    {formatDescription(post.description)}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-sans tracking-wider text-stone-400">
                  <span className="font-medium text-stone-300 group-hover:text-amber-300 transition-colors">
                    한국본회퍼연구소장
                  </span>
                  <span className="text-stone-400/80">{formatDate(post.pubDate)}</span>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* 2. '더보기' 활성화 시 펼쳐지는 추가 카드 배너 그리드 + '더 많은 글들' 카드 */}
        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="mb-6 px-1 text-xs font-sans font-medium text-amber-400/90 tracking-wider">
              이전 글 목록 ({extendedPosts.length})
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {extendedPosts.map((post, index) => (
                <a
                  key={`ext-${index}`}
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="animate-card-appear group flex flex-col justify-between rounded-2xl bg-stone-900/40 hover:bg-stone-900/70 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl border border-white/15 hover:border-amber-400/60 min-h-[220px] transition-all duration-300 transform hover:-translate-y-1.5"
                  style={{
                    animationDelay: `${(index % 6) * 0.05}s`,
                  }}
                >
                  <div className="flex-1">
                    <h3 className="font-serif text-[16.5px] font-bold leading-snug text-stone-100 group-hover:text-amber-300 transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="mt-3 font-serif text-[13px] font-light leading-relaxed text-stone-300/85 line-clamp-3">
                      {formatDescription(post.description)}
                    </p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-sans tracking-wider text-stone-400">
                    <span className="font-medium text-stone-300 group-hover:text-amber-300 transition-colors">
                      한국본회퍼연구소장
                    </span>
                    <span className="text-stone-400/80">{formatDate(post.pubDate)}</span>
                  </div>
                </a>
              ))}

              {/* 동일한 모양의 '더 많은 글들' 바로가기 배너 카드 */}
              <a
                href={`https://blog.naver.com/${blogId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="animate-card-appear group flex flex-col justify-between rounded-2xl bg-stone-900/50 hover:bg-amber-950/30 backdrop-blur-md p-6 shadow-lg hover:shadow-2xl border border-amber-500/30 hover:border-amber-400 min-h-[220px] transition-all duration-300 transform hover:-translate-y-1.5"
                style={{
                  animationDelay: `${(extendedPosts.length % 6) * 0.05}s`,
                }}
              >
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                    <h3 className="font-serif text-lg font-bold text-amber-300 group-hover:text-amber-200 transition-colors">
                      더 많은 글들
                    </h3>
                  </div>
                  <p className="mt-3 font-serif text-[13px] font-light leading-relaxed text-stone-300/85">
                    한국본회퍼연구소 공식 블로그에서 연구소의 전체 글들을 모두 확인하실 수 있습니다.
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 text-xs font-sans tracking-wider text-amber-400 group-hover:text-amber-300">
                  <span className="font-medium">공식 블로그 바로가기</span>
                  <span className="text-base group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>
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
