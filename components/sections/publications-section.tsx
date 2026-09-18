"use client";
import { useState, useRef, useEffect } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { 
  title: string; 
  imageSrc: string; 
  purchaseLink?: string; 
  ebookLink?: string; 
  isOutOfPrint?: boolean;
}

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md active:bg-white active:text-slate-900 md:hover:bg-white md:hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-[41%] -translate-y-1/2 z-40 px-2 md:px-4 text-white/50 md:hover:text-amber-500 active:text-amber-500 transition-all duration-300 flex items-center justify-center font-extralight text-6xl md:text-9xl cursor-pointer h-fit select-none";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { 
      title: "그리스도를 따르라 (1권)", 
      imageSrc: "images/vol1.jpg", 
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" 
    },
    { 
      title: "그리스도를 따르라 (2권)", 
      imageSrc: "images/vol2.jpg", 
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000220871856" 
    },
    { 
      title: "하나님과 함께 (전면개정판)", 
      imageSrc: "images/withr.jpg", 
      purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", 
      ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" 
    },
    { 
      title: "하나님과 함께 (초판)", 
      imageSrc: "images/with.jpg", 
      isOutOfPrint: true 
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(1);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // 포인터 제스처 추적용
  const pointerStart = useRef<{ x: number; y: number; time: number } | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    let animatedY = -20;
    let targetY = -20;
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.bottom < 0 || rect.top > windowHeight) return;

      const totalDistance = windowHeight + rect.height;
      const scrolledDistance = windowHeight - rect.top;
      const progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1);

      targetY = -20 + (progress * 40);
    };

    const updateParallax = () => {
      const ease = 0.08;
      animatedY += (targetY - animatedY) * ease;
      bg.style.transform = `translate3d(0, ${animatedY}%, 0)`;
      animationFrameId = requestAnimationFrame(updateParallax);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const rotate = (dir: 1 | -1) => {
    setActiveIdx(null);
    setCurrentIndex((prev) => (prev + dir + books.length) % books.length);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStart.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
  };

  const handleCardPointerUp = (
    e: React.PointerEvent,
    i: number,
    offset: number,
    isCenter: boolean,
    canOpenOverlay: boolean
  ) => {
    if (!pointerStart.current) return;

    const diffX = pointerStart.current.x - e.clientX;
    const diffY = pointerStart.current.y - e.clientY;
    const duration = Date.now() - pointerStart.current.time;
    pointerStart.current = null;

    // 1. 스와이프 제스처 (좌우 이동 35px 이상)
    if (Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY)) {
      rotate(diffX > 0 ? 1 : -1);
      return;
    }

    // 2. 탭 / 클릭 제스처 (이동 거리 10px 미만 & 400ms 미만 터치) -> 1회 터치 즉시 반영
    if (Math.abs(diffX) < 10 && Math.abs(diffY) < 10 && duration < 400) {
      if (offset === 1) {
        rotate(1);
      } else if (offset === books.length - 1) {
        rotate(-1);
      } else if (isCenter && canOpenOverlay) {
        setActiveIdx((prev) => (prev === i ? null : i));
      }
    }
  };

  return (
    <section 
      ref={sectionRef} 
      id="publications" 
      className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900 scroll-mt-20 select-none"
    >
      <div 
        ref={bgRef} 
        className="absolute inset-x-0 top-[-20%] h-[140%] bg-cover bg-center opacity-40 will-change-transform" 
        style={{ backgroundImage: `url(${hero2Bg.src})` }} 
      />
      
      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-6 md:mb-16">
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판서적</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">엄선하여 선보이는 저서들을 만나보십시오</p>
        </div>

        <div className="relative flex justify-center items-center h-[480px] md:h-[580px] w-full max-w-7xl mx-auto touch-pan-y">
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            const xOffset = offset === 1 ? 320 : offset === books.length - 1 ? -320 : 0;
            const scale = isCenter ? 1 : 0.8;
            const zIndex = isCenter ? 20 : offset === 1 || offset === books.length - 1 ? 10 : 1;
            const isHidden = offset !== 0 && offset !== 1 && offset !== books.length - 1;
            const canOpenOverlay = Boolean(book.purchaseLink || book.ebookLink || book.isOutOfPrint);
            const isActive = isCenter && activeIdx === i && canOpenOverlay;

            return (
              <div 
                key={book.title} 
                className={`absolute transition-all duration-500 ease-out w-[255px] h-[440px] md:w-[316px] md:h-[540px] ${
                  isHidden ? "opacity-0 pointer-events-none" : "opacity-100"
                } ${
                  canOpenOverlay || offset !== 0 ? "cursor-pointer" : "cursor-default"
                }`}
                style={{ 
                  transform: `translate3d(${xOffset}px, 0, 0) scale(${scale})`, 
                  zIndex,
                  touchAction: "pan-y",
                  WebkitTapHighlightColor: "transparent"
                }}
                onPointerDown={handlePointerDown}
                onPointerUp={(e) => handleCardPointerUp(e, i, offset, isCenter, canOpenOverlay)}
              >
                <div className="relative w-full h-[388px] md:h-[480px] overflow-hidden shadow-2xl rounded-sm">
                  <img 
                    src={book.imageSrc} 
                    alt={book.title} 
                    className="w-full h-full object-cover pointer-events-none" 
                  />

                  {/* 오버레이 메뉴 */}
                  {canOpenOverlay && (
                    <div 
                      className={`absolute inset-0 w-full h-full bg-stone-950/95 flex flex-col items-center justify-center gap-4 p-6 transition-all duration-500 ease-in-out ${
                        isActive 
                          ? "opacity-100 translate-y-0 pointer-events-auto" 
                          : "opacity-0 translate-y-full pointer-events-none"
                      }`}
                      onPointerDown={(e) => e.stopPropagation()}
                      onPointerUp={(e) => {
                        e.stopPropagation();
                        setActiveIdx(null);
                      }}
                    >
                      <p className="text-white text-sm font-serif text-center">{book.title}</p>
                      
                      {book.isOutOfPrint ? (
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="px-3 py-1.5 font-sans text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/40 rounded-md tracking-wider">
                            절판 도서
                          </div>
                          <p className="text-xs text-stone-300 text-center leading-relaxed mt-1 font-sans font-light">
                            <br />
                            <strong className="text-white font-medium">전면개정판</strong>을 확인해 주십시오.
                          </p>
                        </div>
                      ) : (
                        <div 
                          className="flex flex-col items-center gap-3 w-full"
                          onPointerUp={(e) => e.stopPropagation()} // 링크 영역 탭 시 닫힘 방지
                        >
                          {book.purchaseLink && (
                            <a 
                              href={book.purchaseLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={btnClass}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              종이책
                            </a>
                          )}
                          {book.ebookLink && (
                            <a 
                              href={book.ebookLink} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={btnClass}
                              onPointerDown={(e) => e.stopPropagation()}
                            >
                              E-Book
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <div 
                  className={`mt-6 w-full transition-opacity duration-500 ease-out ${
                    isCenter ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: isCenter ? "500ms" : "0ms" }}
                >
                  <p className="font-sans text-sm md:text-base font-light tracking-wide text-stone-200 text-center leading-relaxed">
                    책을 클릭하시면<br />상세 정보를 확인하실 수 있습니다
                  </p>
                </div>
              </div>
            );
          })}
          
          <button 
            onClick={() => rotate(-1)} 
            className={navBtnClass + " -left-4 sm:left-2 md:-left-20"}
          >
            ‹
          </button>
          <button 
            onClick={() => rotate(1)} 
            className={navBtnClass + " -right-4 sm:right-2 md:-right-20"}
          >
            ›
          </button>
        </div> 
      </div>
    </section>
  );
}
