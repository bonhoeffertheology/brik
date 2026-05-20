"use client"

const staticPublications = [
  {
    id: "pub-1",
    title: "하나님과 함께 (초판)",
    author: "양석진",
    publisher: "한국본회퍼연구소",
    description: "본회퍼의 신학을 통해 공적신학의 통전적인 기초를 확립한 저자의 논문을 책으로 출판하였습니다.",
    image: "/brik/images/with.jpg",
    link: "https://smartstore.naver.com/bonhoeffer/products/6989986386"
  },
  {
    id: "pub-2",
    title: "그리스도를 따라서 Vol. 1",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소",
    description: "제자도에 대한 본회퍼의 탁월한 통찰을 만나보실 수 있습니다. 이번에 새롭게 번역하고 출판하게 되었습니다.",
    image: "/brik/images/vol1.jpg",
    link: "https://product.kyobobook.co.kr/detail/S000219852719"
  },
  {
    id: "pub-3",
    title: "하나님과 함께 (전면개정판)",
    author: "양석진",
    publisher: "한국본회퍼연구소",
    description: "<하나님과 함께>를 전면개정하여 새롭게 만나보실 수 있습니다.",
    image: "/brik/images/withr.jpg",
    link: "https://ebook-product.kyobobook.co.kr/dig/epd/ebook/E000012896681"
  }
]

export function PublicationsSection() {
  return (
    <section id="publications" className="w-full py-24 md:py-32 bg-stone-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-20 text-center">
          <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            연구소 출판물
          </h2>
          <div className="mx-auto h-0.5 w-12 bg-amber-500" />
          <p className="mt-5 font-sans text-base font-light tracking-wide text-stone-600">
            한국본회퍼연구소에서 발행한 도서와 연구 자료들을 소개합니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {staticPublications.map((pub) => (
            <div key={pub.id} className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <a href={pub.link} target="_blank" rel="noopener noreferrer" className="relative block aspect-[3/4] overflow-hidden bg-stone-100">
                <img src={pub.image} alt={pub.title} className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </a>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-stone-500">
                  <span>{pub.author} 지음</span>
                  <span>{pub.publisher}</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-stone-900 line-clamp-1">{pub.title}</h3>
                <p className="mt-3 flex-1 font-sans text-sm font-light leading-relaxed text-stone-600 line-clamp-3">{pub.description}</p>
                <div className="mt-6">
                  <a href={pub.link} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 hover:text-stone-900">
                    자세히 보기 / 구매하기
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
