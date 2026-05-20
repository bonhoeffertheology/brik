"use client"

import { useEffect, useRef, useState, useCallback } from "react"

interface BlogPost {
  title: string
  link: string
  description: string
  pubDate: string
}

export function ResearchSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [allPosts, setAllPosts] = useState<BlogPost[]>([])
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const blogId = "jelsayou"

  // 데이터 로딩 함수
  const loadBlogPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const rssUrl = `https://rss.blog.naver.com/${blogId}.xml`
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`)
      const text = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, "text/xml")
      const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => ({
        title: item.querySelector("title")?.textContent || "제목 없음",
        link: item.querySelector("link")?.textContent || `https://blog.naver.com/${blogId}`,
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
      }))
      setAllPosts(items)
    } catch (err) {
      console.error("데이터 로딩 실패:", err)
    } finally {
      setIsLoading(false)
    }
  }, [blogId])

  useEffect(() => {
    loadBlogPosts()
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true)
    }, { threshold: 0.1 })
    
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [loadBlogPosts])

  const displayPosts = isExpanded ? allPosts : allPosts.slice(0, 3)

  return (
    <section 
      id="research" 
      ref={sectionRef} 
      className="relative w-full py-24 md:py-32 overflow-hidden"
    >
      {/* 배경 레이어: 패럴랙스 효과 적용 */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: "url('/images/back2.png')",
            backgroundAttachment: "fixed",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat"
          }}
        />
        {/* 어두운 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-20 text-center transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <h2 className="mb-4 font-serif text-3xl font-bold text-white sm:text-4xl">연구활동</h2>
          <div className="mx-auto h-0.5 w-12 bg-amber-500" />
          <p className="mt-5 text-stone-200">본회퍼의 신학과 사상을 연구하고 나눕니다</p>
        </div>

        {isLoading ? (
          <div className="text-center text-white py-16">로딩 중...</div>
        ) : (
          <>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayPosts.map((post, index) => (
                <a key={index} href={post.link} target="_blank" rel="noopener noreferrer" 
                   className="group flex flex-col rounded-2xl bg-white/95 p-8 shadow-xl transition-transform hover:-translate-y-2">
                  <span className="text-[10px] font-semibold text-amber-800 uppercase tracking-widest">RESEARCH</span>
                  <h3 className="mt-4 font-serif text-lg font-bold text-stone-900 line-clamp-2">{post.title}</h3>
                  <p className="mt-2 text-sm text-stone-600 line-clamp-3">{post.description.replace(/<[^>]*>/g, "")}</p>
                </a>
              ))}
            </div>

            {allPosts.length > 3 && (
              <div className="mt-12 text-center">
                <button onClick={() => setIsExpanded(!isExpanded)} 
                        className="rounded-xl border border-white/40 bg-white/10 px-8 py-3 text-sm font-medium text-white hover:bg-white hover:text-black transition-all">
                  {isExpanded ? "접기" : "더보기"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}
