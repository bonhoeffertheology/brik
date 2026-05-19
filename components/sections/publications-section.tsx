"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSiteSettings, type Publication } from "@/hooks/use-site-settings"

const bgColors = ["bg-primary", "bg-secondary", "bg-accent"]

function BookIcon() {
  return (
    <svg className="h-16 w-16 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  )
}

export function PublicationsSection() {
  
  const staticPublications = [
    {
      id: "pub-1",
      title: "하나님과 함께 (초판)",
      author: "양석진",
      publisher: "한국본회퍼연구소",
      description: "본회퍼의 신학을 통해 공적신학의 통전적인 기초를 확립한 저자의 논문을 책으로 출판하였습니다.",
      image: "/brik/images/vol1.jpg",
      link: "https://smartstore.naver.com/bonhoeffer/products/6989898386"
    },
    {
      id: "pub-2",
      title: "그리스도를 따라서 Vol. 1",
      author: "디트리히 본회퍼",
      publisher: "한국본회퍼연구소",
      description: "제자도에 대한 본회퍼의 탁월한 통찰을 만나보실 수 있습니다. 이번에 새롭게 번역하고 출판하게 되었습니다.",
      image: "/brik/images/with.jpg",
      link: ""
    },
    {
      id: "pub-3",
      title: "하나님과 함께 (전면개정판)",
      author: "양석진",
      publisher: "한국본회퍼연구소",
      description: "<하나님과 함께>를 전면개정하여 새롭게 만나보실 수 있습니다.",
      image: "/brik/images/withr.jpg",
      link: ""
    }
  ];

  return (
    <section className="py-20 bg-background" id="publications">
      <div className="container px-4 mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground font-serif">
            연구소 출판물
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            한국본회퍼연구소에서 발행한 도서와 연구 자료들을 소개합니다.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {staticPublications.map((pub, index) => (
            <div
              key={pub.id}
              className="group block overflow-hidden rounded-xl bg-card shadow-md ring-1 ring-border/50 transition-all duration-500 hover:-translate-y-1 cursor-pointer"
              onClick={() => pub.link && window.open(pub.link, '_blank')}
            >
              <div className="relative flex aspect-[2/3] items-center justify-center overflow-hidden bg-muted">
                {pub.image ? (
                  <img
                    src={pub.image}
                    alt={pub.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <span className="text-lg font-serif text-muted-foreground px-4 text-center">{pub.title}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg text-left font-bold text-foreground transition-colors group-hover:text-primary line-clamp-1">
                  {pub.title}
                </h3>
                <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="truncate">{pub.author}</span>
                  <span>|</span>
                  <span className="truncate">{pub.publisher}</span>
                </div>
                <p className="text-sm text-left leading-relaxed text-muted-foreground line-clamp-2">
                  {pub.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
