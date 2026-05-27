"use client";
import { useState, useRef } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { title: string; imageSrc: string; purchaseLink: string; ebookLink?: string }

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-0 bottom-0 z-40 px-4 text-white hover:text-amber-500 transition-all duration-300 flex items-center justify-center font-extralight text-7xl md:text-9xl cursor-pointer";

// **1. 애니메이션 클래스를 상수로 정의** (참고: Tailwind config에 등록해야 작동합니다)
// tailwind.config.ts의 theme.extend에 아래 애니메이션을 등록해야 합니다.
// animation: {
//   'slide-up': 'slideUp 0.6s ease-out forwards',
//   'slide-down': 'slideDown 0.6s ease-out forwards',
// },
// keyframes: {
//   slideUp: {
//     '0%': { transform: 'translateY(100%)' },
//     '100%': { transform: 'translateY(0%)' },
//   },
//   slideDown: {
//     '0%': { transform: 'translateY(0%)' },
//     '100%': { transform: 'translateY(100%)' },
//   },
// }
const slideUpClass = "animate-slide-up";
const slideDownClass = "animate-slide-down";

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

            const onClick = () => {
              if (offset === 1) rotate(1);
              else if (offset === books.length - 1) rotate(-1);
              else setActiveIdx(activeIdx === i ? null : i);
            };

            // **2. 현재 책의 음영 애니메이션 상태 결정**
            const isCurrentActive = isCenter && activeIdx === i;
            const shadowAnimationClass = activeIdx === i ? (isCurrentActive ? slideUpClass : slideDownClass) : "";

            return (
              <div 
                key={book.title}
                className="absolute transition-all duration-500 ease-out w-[220px] h-[380px] md:w-[260px] md:h-[460px] cursor-pointer"
                style={{ transform: `translateX(${xOffset}px) scale(${scale})`, opacity, zIndex }}
                onClick={onClick}
              >
                {/* 이미지 영역: 여기 안에 음영이 들어갑니다. */}
                <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden shadow-2xl">
                  <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover" />
                  
                  {/* **3. 음영 영역 (Overlay): 이미지 위에 겹치고, 애니메이션 클래스를 받음** */}
                  <div className={`absolute bottom-0 left-0 w-full h-full bg-stone-950/80 transform translate-y-full ${shadowAnimationClass}`}></div>
                </div>
                
                {/* 하단 문구 영역: (이전 수정 유지) activeIdx와 독립적으로 작동 */}
                <div className={`mt-4 w-full transition-opacity duration-500 ease-in-out ${isCenter ? "opacity-100" : "opacity-0"}`}>
                  <p className="text-stone-400 text-[13px] md:text-sm text-center font-sans">
                    책을 클릭하시면 구매하실 수 있습니다.
                  </p>
                </div>

                {/* 구매 상세 정보: 음영 애니메이션과 함께 나타나도록 opacity만 제어 */}
                <div className={`absolute top-0 left-0 w-full h-[340px] md:h-[420px] flex flex-col items-center justify-center gap-4 p-6 transition-opacity duration-600 ease-in-out ${isCurrentActive ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
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
