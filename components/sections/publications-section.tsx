"use client";
import { useState, useRef, useEffect } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { 
  title: string; 
  imageSrc: string; 
  purchaseLink?: string; 
  ebookLink?: string; 
}

/* 💡 navBtnClass: 책 표지가 15% 작아짐에 따라 버튼의 세로 정중앙 영점을 top-[41%]로 정밀 리밸런싱 */
const navBtnClass = "absolute top-[41%] -translate-y-1/2 z-40 px-2 md:px-4 text-white/50 hover:text-amber-500 hover:opacity-100 transition-all duration-300 flex items-center justify-center font-extralight text-6xl md:text-9xl cursor-pointer h-fit select-none";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { title: "그리스도를 따라서 (1권)", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { 
      title: "그리스도를 따라서 (2권)", 
      imageSrc: "images/vol2.jpg" // 링크 없음 (광고용 전용)
    },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // 순수 자바스크립트 관성 패럴렉스 엔진
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
    setCurrentIndex((prev) => (prev + dir + books.length) % books.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => touchStartX.current = e.touches[0].clientX;
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) rotate(diff > 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <section 
      ref={sectionRef} 
      id="publications"
      className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900 scroll-mt-20"
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

        <div 
          className="relative flex justify-center items-center h-[480px] md:h-[580px] w-full max-w-7xl mx-auto touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            const xOffset = offset === 1 ? 320 : offset === books.length - 1 ? -320 : 0;
            const scale = isCenter ? 1 : 0.8;
            const zIndex = isCenter ? 10 : 1;
            const hasLink = Boolean(book.purchaseLink || book.ebookLink);

            return (
              <div 
                key={book.title} 
                className={`absolute transition-all duration-500 ease-out w-[255px] h-[440px] md:w-[316px] md:h-[540px] select-none ${
                  hasLink || offset !== 0 ? "cursor-pointer" : "cursor-default"
                }`}
                style={{ 
                  transform: `translate3d(${xOffset}px, 0, 0) scale(${scale})`, 
                  zIndex,
                  transformStyle: "preserve-3d",
                  WebkitBackfaceVisibility: "hidden",
                  backfaceVisibility: "hidden"
                }}
                onClick={() => {
                  if (offset === 1) rotate(1);
                  else if (offset === books.length - 1) rotate(-1);
                  else {
                    // 구매 링크가 존재하는 도서만 새 탭 이동 (2권처럼 없으면 동작 안함)
                    const targetLink = book.purchaseLink || book.ebookLink;
                    if (targetLink) {
                      window.open(targetLink, "_blank", "noopener,noreferrer");
                    }
                  }
                }}
              >
                <div className="relative w-full h-[388px] md:h-[480px] overflow-hidden shadow-2xl" style={{ transform: "translateZ(0)" }}>
                  <img 
                    src={book.imageSrc} 
                    alt={book.title} 
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      hasLink ? "hover:scale-105" : ""
                    }`}
                    style={{ 
                      imageRendering: "-webkit-optimize-contrast",
                      WebkitTransform: "translateZ(0) scale(1.0001)",
                      transform: "translateZ(0) scale(1.0001)"
                    }}
                  />
                </div>
                
                <div 
                  className={`mt-6 w-full transition-opacity duration-500 ease-out ${
                    isCenter ? "opacity-100" : "opacity-0"
                  }`}
                  style={{ transitionDelay: isCenter ? "1000ms" : "0ms" }}
                >
                  <p className="font-sans text-sm md:text-base font-light tracking-wide text-stone-200 text-center leading-relaxed">
                    {hasLink ? (
                      <>책을 클릭하시면<br />구매 사이트로 이동합니다</>
                    ) : (
                      <>출간 예정 도서입니다</>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
          
          <button onClick={() => rotate(-1)} className={navBtnClass + " -left-4 sm:left-2 md:-left-20"}>‹</button>
          <button onClick={() => rotate(1)} className={navBtnClass + " -right-4 sm:right-2 md:-right-20"}>›</button>
        </div> 
      </div>
    </section>
  );
}
