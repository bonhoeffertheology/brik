"use client";
import { useState } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
// navBtnClass의 위치 조절은 개별 컴포넌트에서 직접 적용합니다.
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
        <div className="relative flex justify-center items-center h-[500px] w-full max-w-4xl mx-auto">
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            
            const xOffset = offset === 1 ? 300 : offset === books.length - 1 ? -300 : 0;
            const scale = isCenter ? 1.1 : 0.8;
            const opacity = isCenter ? 1 : 0.4;
            const zIndex = isCenter ? 10 : 1;

            return (
              <div 
                key={book.title}
                className="absolute transition-all duration-500 ease-in-out w-[260px] h-[420px]"
                style={{ 
                  transform: `translateX(${xOffset}px) scale(${scale})`, 
                  opacity, 
                  zIndex 
                }}
              >
                <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover shadow-2xl rounded-lg" />
              </div>
            );
          })}
          
          {/* 여기서 -left-32, -right-32로 간격을 더 넓혔습니다 */}
          <button onClick={() => rotate(-1)} className={navBtnClass + " -left-32"}>‹</button>
          <button onClick={() => rotate(1)} className={navBtnClass + " -right-32"}>›</button>
        </div>
      </div>
    </section>
  );
}
