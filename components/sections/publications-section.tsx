"use client";
import { useState, useRef } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-0 bottom-0 z-40 px-4 text-white hover:text-amber-500 transition-all duration-300 flex items-center justify-center font-extralight text-7xl md:text-9xl cursor-pointer";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const rotate = (dir: 1 | -1) => {
    setActiveIdx(null);
    setCurrentIndex((prev) => (prev + dir + books.length) % books.length);
  };

  return (
    <section className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40" style={{ backgroundImage: `url(${hero2Bg.src})` }} />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">엄선하여 선보이는 저서들을 만나보십시오</p>
        </div>

        <div className="relative flex justify-center items-center h-[500px] w-full max-w-4xl mx-auto touch-pan-y">
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            const xOffset = offset === 1 ? 300 : offset === books.length - 1 ? -300 : 0;
            const scale = isCenter ? 1 : 0.8;
            const opacity = isCenter ? 1 : 0.9;
            const zIndex = isCenter ? 10 : 1;
            const isActive = isCenter && activeIdx === i;

            const onClick = () => {
              if (offset === 1) rotate(1);
              else if (offset === books.length - 1) rotate(-1);
              else setActiveIdx(activeIdx === i ? null : i);
            };

            return (
              <div 
                key={book.title}
                className="absolute transition-all duration-500 ease-out w-[220px] h-[380px] md:w-[260px] md:h-[460px] cursor-pointer"
                style={{ transform: `translateX(${xOffset}px) scale(${scale})`, opacity, zIndex }}
                onClick={onClick}
              >
                {/* 이미지 영역 */}
                <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden shadow-2xl">
                  <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover" />
                  
                  {/* 음영 영역: isActive 상태에 따라 translate-y 값을 실시간으로 조절 */}
                  <div className={`absolute left-0 top-0 w-full h-full bg-stone-900/90 flex flex-col items-center justify-center gap-4 p-6 transition-transform duration-700 ease-in-out ${isActive ? "translate-y-0" : "translate-y-full"}`}>
                    <p className="text-white text-sm font-serif text-center">{book.title}</p>
                    <a href={book.purchaseLink} target="_blank" className={btnClass}>종이책</a>
                    {book.ebookLink && <a href={book.ebookLink} target="_blank" className={btnClass}>E-Book</a>}
                  </div>
                </div>
                
                {/* 하단 문구 영역: 이미지와 별도로 움직임 */}
                <div className={`mt-4 w-full transition-opacity duration-500 ease-in-out ${isCenter ? "opacity-100" : "opacity-0"}`}>
                  <p className="text-stone-400 text-[13px] md:text-sm text-center font-sans">
                    책을 클릭하시면 구매하실 수 있습니다.
                  </p>
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
