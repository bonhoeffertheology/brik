"use client"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import hero2Bg from "@/public/images/hero3.png"

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300"
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 hover:text-white transition-all duration-300 flex items-center justify-center font-light text-7xl md:text-9xl cursor-pointer"

export function PublicationsSection() {
  const baseBooks: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ]

  const [books, setBooks] = useState(baseBooks)
  const [activeIdx, setActiveIdx] = useState<number | null>(null)

  const rotate = (dir: 1 | -1) => {
    setBooks(prev => {
      const copy = [...prev]
      if (dir === 1) copy.push(copy.shift()!)
      else copy.unshift(copy.pop()!)
      return copy
    })
  }

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-500 relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-white/80" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </div>
          <p className="mt-6 font-sans text-stone-300 font-light">한국본회퍼연구소에서 출판한 연구 자료 및 저서입니다.</p>
        </div>

        <div className="relative flex justify-center items-center h-[500px]">
          <div className="flex items-center gap-8">
            <AnimatePresence mode="popLayout">
              {books.map((book, i) => {
                const isCenter = i === 1
                return (
                  <motion.div 
                    key={book.title}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ 
                      opacity: isCenter ? 1 : 0.4, 
                      scale: isCenter ? 1.1 : 0.8,
                      x: 0
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="relative w-[260px] h-[420px] cursor-pointer"
                    onClick={() => isCenter ? setActiveIdx(activeIdx === i ? null : i) : rotate(i > 1 ? 1 : -1)}
                  >
                    <img src={book.imageSrc} alt={book.title} className="w-full h-full object-fill shadow-2xl" />
                    <div className={`absolute -inset-[2px] bg-stone-900/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 p-6 transition-opacity duration-500 ${isCenter && activeIdx === i ? "opacity-100" : "opacity-0"}`}>
                      <p className="text-white text-sm font-serif">{book.title}</p>
                      <a href={book.purchaseLink} className={btnClass}>종이책</a>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
          <button onClick={() => rotate(-1)} className={navBtnClass + " left-4"}>‹</button>
          <button onClick={() => rotate(1)} className={navBtnClass + " right-4"}>›</button>
        </div>
      </div>
    </section>
  )
}
