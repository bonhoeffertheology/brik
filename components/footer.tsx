"use client"

import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-primary py-12 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 text-lg font-bold">한국본회퍼연구소</h4>
            <p className="text-sm leading-relaxed opacity-80">
              디트리히 본회퍼의 신학과 삶을 연구하며, 교회의 밝은 미래를 열어갑니다.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold">주소</h4>
            <p className="mb-2 text-sm leading-relaxed opacity-80">서울시 마포구 잔다리로 6</p>
            <p className="text-sm leading-relaxed opacity-80">
              Jandari-ro 6, Mapo-gu, Seoul, Republic of Korea
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold">연구소 정보</h4>
            <p className="mb-1 text-sm leading-relaxed opacity-80">대표자: 양석진</p>
            <p className="text-sm leading-relaxed opacity-80">이메일: jelsayou@naver.com</p>
          </div>
          <div>
            <h4 className="mb-4 text-lg font-bold">소셜 미디어</h4>
            {/* 소셜 미디어 아이콘 영역 */}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-white/20 pt-8 text-sm opacity-80">
          <p>&copy; 2022 한국본회퍼연구소. All rights reserved.</p>
          <Link href="/admin" className="text-xs text-transparent select-none cursor-default">관리자</Link>
        </div>
      </div>
    </footer>
  )
}
