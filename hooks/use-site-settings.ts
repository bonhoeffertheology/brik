"use client"

import useSWR from "swr"

export interface Publication {
  title: string
  author: string
  publisher: string
  description: string
  link: string
  image: string
  bgColor?: string
}

export interface ScheduleItem {
  title: string
  date: string
  time: string
  description: string
}

export interface SiteSettings {
  heroBackgroundImage: string
  scheduleBackgroundImage: string
  publications: Publication[]
  schedules: ScheduleItem[]
}

const DEFAULT_PUBLICATIONS: Publication[] = [
  {
    title: "하나님과 함께",
    author: "양석진",
    publisher: "한국본회퍼연구소",
    description: "본회퍼의 신학을 통해 공적신학의 통전적인 기초를 확립한 저자의 논문을 책으로 출판하였습니다.",
    image: "/images/with-god.png",
    link: "https://smartstore.naver.com/bonhoeffer/products/6989986386",
    bgColor: "bg-primary",
  },
  {
    title: "옥중서간",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "감옥에서 쓴 편지들로, 고난 속에서도 빛나는 신앙의 깊이를 보여줍니다.",
    image: "",
    link: "",
    bgColor: "bg-secondary",
  },
  {
    title: "윤리학",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "그리스도인의 윤리적 삶과 책임에 대한 본회퍼의 심오한 통찰을 담고 있습니다.",
    image: "",
    link: "",
    bgColor: "bg-accent",
  },
  {
    title: "나를 따르라",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "값싼 은혜와 값비싼 은혜, 그리고 제자도의 의미를 깊이 탐구합니다.",
    image: "",
    link: "",
    bgColor: "bg-primary",
  },
  {
    title: "신도의 공동생활",
    author: "디트리히 본회퍼",
    publisher: "한국본회퍼연구소 역",
    description: "그리스도인 공동체의 본질과 신앙 공동체 안에서의 삶을 다룹니다.",
    image: "",
    link: "",
    bgColor: "bg-secondary",
  },
]

const DEFAULT_SCHEDULES: ScheduleItem[] = [
  {
    title: "본회퍼 신학 세미나",
    date: "2026-04-15",
    time: "오후 2시",
    description: "\"현대 사회에서의 본회퍼 윤리학\"을 주제로 진행되는 학술 세미나입니다.",
  },
  {
    title: "연구소 정기 모임",
    date: "2026-05-22",
    time: "오후 3시",
    description: "연구원들이 모여 최근 연구 성과를 공유하고 토론하는 정기 모임입니다.",
  },
  {
    title: "국제 본회퍼 학술대회",
    date: "2026-07-10",
    time: "3일간",
    description: "국내외 본회퍼 연구자들이 모이는 대규모 국제 학술대회가 개최됩니다.",
  },
]

const DEFAULT_SETTINGS: SiteSettings = {
  heroBackgroundImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f611e1d5-0001-0004-0000-000000830848_w860_r1.3848631239935587_fpx36.05_fpy49.92-INRBZp1L4itOUClsuExfCnSbgoHFRn.webp",
  scheduleBackgroundImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bonhoeffer-1jb4fMPafMzS3QzfVJe1Sgol4zpTUg.jpg",
  publications: DEFAULT_PUBLICATIONS,
  schedules: DEFAULT_SCHEDULES,
}

const STORAGE_KEY = "bonhoeffer-site-settings"

function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return { 
        ...DEFAULT_SETTINGS, 
        ...parsed,
        publications: parsed.publications?.length > 0 ? parsed.publications : DEFAULT_PUBLICATIONS,
        schedules: parsed.schedules?.length > 0 ? parsed.schedules : DEFAULT_SCHEDULES,
      }
    }
  } catch (e) {
    console.error("Failed to parse stored settings:", e)
  }
  return DEFAULT_SETTINGS
}

function saveSettings(settings: SiteSettings): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
}

export function useSiteSettings() {
  const { data: settings, mutate } = useSWR<SiteSettings>(
    "site-settings",
    () => getStoredSettings(),
    {
      fallbackData: DEFAULT_SETTINGS,
      revalidateOnFocus: false,
    }
  )

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings!, ...newSettings }
    saveSettings(updated)
    await mutate(updated, false)
    return updated
  }

  const resetSettings = async () => {
    saveSettings(DEFAULT_SETTINGS)
    await mutate(DEFAULT_SETTINGS, false)
    return DEFAULT_SETTINGS
  }

  return {
    settings: settings || DEFAULT_SETTINGS,
    updateSettings,
    resetSettings,
    DEFAULT_PUBLICATIONS,
    DEFAULT_SCHEDULES,
  }
}
