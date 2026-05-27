"use client";
import { useState, useRef, useEffect } from "react";
import hero2Bg from "@/public/images/hero3.png";

interface PublicationBook { 
  title: string; 
  imageSrc: string; 
  purchaseLink: string; 
  ebookLink?: string; 
}

const btnClass = "w-full max-w-[120px] py-2 text-center font-sans text-xs font-medium text-white bg-transparent border border-white/80 rounded-md hover:bg-white hover:text-slate-900 transition-all duration-300";
const navBtnClass = "absolute top-0 bottom-0 z-40 px-4 text-white/50 hover:text-amber-500 hover:opacity-100 transition-all duration-300 flex items-center justify-center font-extralight text-7xl md:text-9xl cursor-pointer";

export function PublicationsSection() {
  const books: PublicationBook[] = [
    { title: "그리스도를 따라서 Vol. 1", imageSrc: "images/vol1.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000219852719/" },
    { title: "하나님과 함께 (전면개정판)", imageSrc: "images/withr.jpg", purchaseLink: "https://product.kyobobook.co.kr/detail/S000220042568/", ebookLink: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681" },
    { title: "하나님과 함께 (초판)", imageSrc: "images/with.jpg", purchaseLink: "https://smartstore.naver.com/bonhoeffer/products/6989986386/", ebookLink: "https://jelsayou.upaper.kr/content/1153861" }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  // 패럴렉스 제어를 위한 독립된 DOM 참조(Ref) 추가
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // [보충 내용] 외부 라이브러리(GSAP) 없는 순수 자바스크립트 관성 패럴렉스 엔진
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    let animatedY = -20; // 현재 브라우저에 렌더링 중인 배경 Y축 위치 (%)
    let targetY = -20;   // 실제 스크롤 위치에 따라 도달해야 하는 목표 위치 (%)
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 성능 최적화: 섹션이 화면 밖에 완전히 벗어나 있으면 연산을 건너뜁니다.
      if (rect.bottom < 0 || rect.top > windowHeight) return;

      // 섹션이 화면 밑에서 나타나서 위로 사라질 때까지의 정밀 진행도 계산 (0 ~ 1)
      const totalDistance = windowHeight + rect.height;
      const scrolledDistance = windowHeight - rect.top;
      const progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1);

      // 화면을 내리면(스크롤 다운) 진행도(progress)가 커지며 배경이 -20%에서 +20% 쪽으로 서서히 올라갑니다.
      targetY = -20 + (progress * 40);
    };

    // 선형 보간법(Lerp)과 하드웨어 주사율을 동기화하여 미끄러지는 감속을 만드는 함수
    const updateParallax = () => {
      const ease = 0.08; // 이 값이 낮을수록 달린 첵 사이트 특유의 묵직하고 우아한 이동이 연출됩니다.
      
      animatedY += (targetY - animatedY) * ease;

      // 뚝뚝 끊기는 CSS top 대신 GPU 레이어를 타는 translate3d를 인라인으로 주입합니다.
      bg.style.transform = `translate3d(0, ${animatedY}%, 0)`;

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // 스크롤 리스너 등록 (passive 옵션으로 모바일 스크롤 최적화)
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 진입 시 배경 위치 영점 조절
    animationFrameId = requestAnimationFrame(updateParallax);

    // 컴포넌트 해제 시 리스너 및 애니메이션 루프 완벽 리셋 (메모리 누수 차단)
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const rotate = (dir: 1 | -1) => {
    setActiveIdx(null);
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
    // sectionRef를 연결하여 스크롤 트래킹의 정밀한 기준점 역할을 수행하도록 합니다.
    <section ref={sectionRef} className="relative w-full overflow-hidden py-24 md:py-32 bg-stone-900">
      
      {/* [패럴렉스 보충 레이어] 기존 bg-fixed div를 대체합니다.
        - h-[140%]와 top-[-20%]의 스케일 버퍼를 둠으로써, 배경이 상하로 유연하게 슬라이딩할 때 
          뒷배경의 검은색 여백이 찢어져 노출되는 현상을 완벽하게 구조적으로 차단합니다.
        - will-change-transform 속성으로 브라우저에게 이 레이어가 상시 가속 레이어임을 인지시킵니다.
      */}
      <div 
        ref={bgRef}
        className="absolute inset-x-0 top-[-20%] h-[140%] bg-cover bg-center opacity-40 will-change-transform" 
        style={{ backgroundImage: `url(${hero2Bg.src})` }} 
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">출판물</h2>
          <div className="mx-auto h-0.5 w-12 overflow-hidden bg-amber-500 relative">
            <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          </div>
          {/* 완벽하게 유지된 타이틀 하단 문구 */}
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-200">엄선하여 선보이는 저서들을 만나보십시오</p>
        </div>

        <div 
          className="relative flex justify-center items-center h-[500px] w-full max-w-4xl mx-auto touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {books.map((book, i) => {
            const offset = (i - currentIndex + books.length) % books.length;
            const isCenter = offset === 0;
            const xOffset = offset === 1 ? 300 : offset === books.length - 1 ? -300 : 0;
            const scale = isCenter ? 1 : 0.8;
            const zIndex = isCenter ? 10 : 1;
            const isActive = isCenter && activeIdx === i;

            return (
              <div key={book.title} className="absolute transition-all duration-500 ease-out w-[220px] h-[380px] md:w-[260px] md:h-[460px] cursor-pointer"
                style={{ transform: `translateX(${xOffset}px) scale(${scale})`, zIndex }}
                onClick={() => {
                  if (offset === 1) rotate(1);
                  else if (offset === books.length - 1) rotate(-1);
                  else setActiveIdx(activeIdx === i ? null : i);
                }}>
                <div className="relative w-full h-[340px] md:h-[420px] overflow-hidden shadow-2xl">
                  <img src={book.imageSrc} alt={book.title} className="w-full h-full object-cover" />
                  <div className={`absolute left-0 top-0 w-full h-full bg-stone-900/90 flex flex-col items-center justify-center gap-4 p-6 transition-transform duration-700 ease-in-out ${isActive ? "translate-y-0" : "translate-y-full"}`}>
                    <p className="text-white text-sm font-serif text-center">{book.title}</p>
                    <a href={book.purchaseLink} target="_blank" rel="noopener noreferrer" className={btnClass}>종이책</a>
                    {book.ebookLink && <a href={book.ebookLink} target="_blank" rel="noopener noreferrer" className={btnClass}>E-Book</a>}
                  </div>
                </div>
                {/* 완벽하게 유지된 도서 하단 안내 문구 */}
                <div className={`mt-4 w-full transition-opacity duration-500 ease-in-out ${isCenter ? "opacity-100" : "opacity-0"}`}>
                  <p className="font-sans text-base font-light tracking-wide text-stone-200 text-center leading-relaxed">책을 클릭하시면<br />구매하실 수 있습니다</p>
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
