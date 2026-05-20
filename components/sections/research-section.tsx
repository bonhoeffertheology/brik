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

  const loadBlogPosts = useCallback(async () => {
    try {
      const rssUrl = `https://rss.blog.naver.com/jelsayou.xml`
      const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`)
      const text = await response.text()
      const parser = new DOMParser()
      const xmlDoc = parser.parseFromString(text, "text/xml")
      const items = Array.from(xmlDoc.querySelectorAll("item")).map((item) => ({
        title: item.querySelector("title")?.textContent || "제목 없음",
        link: item.querySelector("link")?.textContent || "#",
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent || "",
      }))
      setAllPosts(items)
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

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
      {/* 강제 배경 설정 */}
      <div className="absolute inset-0 z-0 bg-stone-900">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-fixed"
          style={{ backgroundImage: "url('/images/back2.png')" }}
        />
        <div className="absolute inset-0 bg-black/70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className={`mb-20 text-center transition-opacity duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <h2 className="text-3xl font-bold text-white mb-4">연구활동</h2>
          <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
        </div>

        {isLoading ? (
          <div className="text-center text-white">로딩 중...</div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {displayPosts.map((post, i) => (
              <a key={i} href={post.link} target="_blank" rel="noopener noreferrer" 
                 className="bg-white p-8 rounded-2xl shadow-xl transition-transform hover:scale-105">
                <h3 className="font-bold text-lg text-black">{post.title}</h3>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
