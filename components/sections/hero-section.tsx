"use client";

import Link from "next/link";
import openBg from "@/public/images/open.png";
import { useEffect, useState, useRef } from "react";

export function HeroSection() {
  const [isMounted, setIsMounted] = useState(false);

  // 패럴렉스 트래킹을 위한 DOM 참조(Ref) 생성
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);

  // 1. 페이지 로드 시 진입 애니메이션 작동 트리거
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 2. 외부 라이브러리 없는 순수 자바스크립트 고성능 패럴렉스 엔진
  useEffect(() => {
    const section = sectionRef.current;
    const bg = bgRef.current;
    if (!section || !bg) return;

    let animatedY = -15; // 현재 브라우저가 그리고 있는 배경 Y축 오프셋 (%)
    let targetY = -15;   // 실제 스크롤 값에 의해 도달해야 할 목표 위치 (%)
    let animationFrameId: number;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // 성능 최적화: 히어로 섹션이 화면 상단 밖으로 완전히 나가면 연산을 멈춥니다.
      if (rect.bottom < 0) return;

      // 섹션이 화면에서 움직이는 정밀 진행도 계산 (0: 정지 상태 ~ 1: 완전히 위로 사라짐)
      const totalDistance = windowHeight + rect.height;
      const scrolledDistance = windowHeight - rect.top;
      const progress = Math.min(Math.max(scrolledDistance / totalDistance, 0), 1);

      // 사용자가 화면을 내릴수록 배경 레이어는 -15%에서 +15% 방향인 위쪽으로 정밀하게 슬라이딩합니다.
      targetY = -15 + (progress * 30);
    };

    // 주사율 동기화 및 부드러운 감속(관성) 구현
    const updateParallax = () => {
      const ease = 0.07; // 낮을수록 묵직하고 고급스러운 여운을 주며 따라옵니다.
      
      animatedY += (targetY - animatedY) * ease;

      // GPU 레이어를 타는 translate3d를 인라인 스타일로 실시간 주입
      bg.style.transform = `translate3d(0, ${animatedY}%, 0)`;

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    // 스크롤 이벤트 바인딩 (passive 옵션으로 모바일 스크롤 끊김 최소화)
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // 초기 영점 맞춤
    animationFrameId = requestAnimationFrame(updateParallax);

    // 컴포넌트 해제 시 이벤트 가비지 컬렉션 및 애니메이션 프레임 완전 리셋
    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    // sectionRef를 걸어 전체 화면 스크롤의 높이값 기준점을 제공합니다.
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-gradient-to-br from-primary to-secondary pt-20 text-white"
    >
      {/* [패럴렉스 보충 레이어] 기존 bg-fixed 및 획일적인 클래스를 걷어내고 유동 레이어로 변경했습니다.
        - h-[130%]와 top-[-15%] 공간 버퍼를 두어, 배경이 스크롤에 맞춰 유연하게 수직 이동할 때 
          하단 그라데이션 베이스가 찢어지거나 빈 공간이 노출되지 않도록 마진 레이아웃을 완전히 방어했습니다.
        - `will-change-transform` 속성으로 모바일 디바이스 환경에서도 버벅임 없는 주사율을 유지시킵니다.
      */}
      <div
        ref={bgRef}
        className={`absolute inset-x-0 top-[-15%] h-[130%] bg-cover bg-center transition-opacity duration-1000 will-change-transform ${
          isMounted ? "opacity-50" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url(${openBg.src})`,
        }}
      />
      
      {/* Animated Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-primary/20" 
      />
      
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="max-w-3xl">
          
          {/* 2. 메인 타이틀 문구 */}
          <h1
            className={`mb-6 font-serif text-4xl font-bold leading-relaxed md:text-5xl lg:text-6xl text-shadow transform transition-all duration-1000 ease-out ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            오늘 우리에게
            <br />
            예수 그리스도는 누구신가?
          </h1>

          {/* 3. 서브 설명 문구 */}
          <p 
            className={`mb-8 text-lg leading-relaxed text-white/90 md:text-xl transform transition-all duration-1000 ease-out delay-300 ${
              isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            한국본회퍼연구소는 본회퍼가 던진 이 질문에 대답하기 위해, 오늘날 교회가 걸어가야 할 바른 길을 제시하고, 예수
            그리스도의 참된 제자들을 양성하는 일에 기여하고 있습니다.
          </p>

          {/* 4. 하단 버튼 배너 (각 버튼마다 딜레이를 다르게 주어 순차적으로 등장) */}
          <div className="flex flex-wrap gap-4">
            {/* 버튼 ①: 연구소 알아보기 */}
            <Link
              href="#about"
              onClick={(e) => scrollToSection(e, "#about")}
              className={`btn-primary rounded-lg bg-accent px-6 py-3 font-medium text-white transition-all duration-700 ease-out hover:-translate-y-0.5 hover:shadow-lg ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isMounted ? "500ms" : "0ms" }}
            >
              연구소 알아보기
            </Link>

            {/* 버튼 ②: 출판물 보기 */}
            <Link
              href="#publications"
              onClick={(e) => scrollToSection(e, "#publications")}
              className={`rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all duration-700 ease-out hover:bg-white/20 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isMounted ? "700ms" : "0ms" }}
            >
              출판물 보기
            </Link>

            {/* 버튼 ③: 후원하기 */}
            <Link
              href="#support"
              onClick={(e) => scrollToSection(e, "#support")}
              className={`rounded-lg border border-white/20 bg-white/10 px-6 py-3 font-medium backdrop-blur-sm transition-all duration-700 ease-out hover:bg-white/20 ${
                isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: isMounted ? "900ms" : "0ms" }}
            >
              후원하기
            </Link>
          </div>

        </div>
      </div>
      
    </section>
  );
}
