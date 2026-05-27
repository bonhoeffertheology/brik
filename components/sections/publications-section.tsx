"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import hero2Bg from "@/public/images/hero3.png"; // 경로 확인 필요

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-1/2 -translate-y-1/2 z-30 p-4 text-white/50 hover:text-white transition-all duration-300 flex items-center justify-center font-light text-7xl md:text-9xl cursor-pointer";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const rotate = (dir: 1 | -1) => {
    setCurrentIndex((prev) => (prev + dir + books.length) % books.length);
  };

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl font-bold text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto mt-4 h-0.5 w-12 bg-amber-500 relative overflow-hidden">
            <motion.div className="absolute inset-0 bg-white/80" animate={{ x: ["-100%", "100%"] }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} />
          </div>
        </div>

        <div className="relative flex justify-center items-center h-[500px] w-full max-w-3xl mx-auto">
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            
            // 위치 계산: 중앙은 0, 오른쪽은 300, 왼쪽은 -300
            const xOffset = offset === 1 ? 300 : offset === books.length - 1 ? -300 : 0;
            const opacity = isCenter ? 1 : 0.4;
            const scale = isCenter ? 1.1 : 0.8;

            return (
              <motion.div 
                key={book.title}
                animate={{ x: xOffset, scale, opacity, zIndex: isCenter ? 10 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 25 }}
                className="absolute w-[260px] h-[420px]"
              >
                <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover shadow-2xl rounded-lg" />
              </motion.div>
            );
          })}
          
          <button onClick={() => rotate(-1)} className={navBtnClass + " -left-16"}>‹</button>
          <button onClick={() => rotate(1)} className={navBtnClass + " -right-16"}>›</button>
        </div>
      </div>
    </section>
  );
}
