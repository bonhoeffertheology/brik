"use client";
import { useState, useRef } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-0 bottom-0 z-40 px-4 text-white hover:text-amber-500 transition-all duration-300 flex items-center justify-center font-thin text-7xl md:text-9xl cursor-pointer";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const touchStart = useRef(0);

  const rotate = (dir: 1 | -1) => {
    setActiveIdx(null);
    setCurrentIndex((prev) => (prev + dir + books.length) % books.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => (touchStart.current = e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEnd = e.changedTouches[0].clientX;
    if (touchStart.current - touchEnd > 50) rotate(1);
    else if (touchEnd - touchStart.current > 50) rotate(-1);
  };

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">출판물</h2>
          {/* CSS 애니메이션 적용된 노란색 바 */}
          <div className="w-16 h-1 bg-amber-500 mx-auto mb-6 transition-all duration-1000 ease-in-out" />
          <p className="text-stone-300 font-sans text-sm md:text-base">한국본회퍼연구소가 엄선하여 선보이는 저서들을 만나보십시오.</p>
        </div>

        <div 
          className="relative flex justify-center items-center h-[500px] w-full max-w-4xl mx-auto touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            
            const onClick = () => {
              if (offset === 1) rotate(1);
              else if (offset === books.length - 1) rotate(-1);
              else setActiveIdx(activeIdx === i ? null : i);
            };

            const xOffset = offset === 1 ? 300 : offset === books.length - 1 ? -300 : 0;
            const scale = isCenter ? 1 : 0.8;
            const opacity = isCenter ? 1 : 0.7;
            const zIndex = isCenter ? 10 : 1;

            return (
              <div 
                key={book.title}
                className="absolute transition-all duration-500 ease-out w-[220px] h-[340px] md:w-[260px] md:h-[420px] cursor-pointer"
                style={{ transform: `translateX(${xOffset}px) scale(${scale})`, opacity, zIndex }}
                onClick={onClick}
              >
                <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover shadow-2xl" />
                <div className={`absolute inset-0 bg-stone-900/90 flex flex-col items-center justify-center gap-4 p-6 transition-opacity duration-300 ${isCenter && activeIdx === i ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <p className="text-white text-sm font-serif text-center">{book.title}</p>
                  <a href={book.purchaseLink} target="_blank" className={btnClass}>종이책</a>
                  {book.ebookLink && <a href={book.ebookLink} target="_blank" className={btnClass}>E-Book</a>}
                </div>
              </div>
            );
          })}
          
          <button onClick={() => rotate(-1)} className={navBtnClass + " left-0 md:-left-14"}>‹</button>
          <button onClick={() => rotate(1)} className={navBtnClass + " right-0 md:-right-14"}>›</button>
        </div>
      </div>
    </section>
  );
}
