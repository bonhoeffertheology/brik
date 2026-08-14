{/* 기존: 타이틀 구역이 flex 컨테이너에서 좌측 정렬되어 바가 왼쪽으로 쏠리던 구조 */}
{/* 변경: h2와 바를 inline-flex로 묶어 글자 폭 기준으로 중앙 정렬 */}
<div className="inline-flex flex-col items-center">
  <h2 className="font-serif text-3xl font-bold tracking-tight text-white sm:text-4xl">연구활동</h2>
  <div className="mt-3 h-0.5 w-12 overflow-hidden bg-amber-500 relative">
    <div className="absolute inset-0 h-full w-full animate-shimmer-core bg-gradient-to-r from-transparent via-white/60 to-transparent" />
  </div>
</div>
