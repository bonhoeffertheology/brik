"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import {
  Building2,
  Quote,
  BookOpen,
  Calendar,
  Heart,
  Settings,
  LogOut,
  Download,
  Upload,
  ImageIcon,
  Trash2,
  Edit,
  Plus,
  X,
  Menu,
  ChevronLeft,
} from "lucide-react"
import { useSiteSettings, type Publication, type ScheduleItem } from "@/hooks/use-site-settings"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

// Storage keys
const STORAGE_KEYS = {
  intro: "brik_intro",
  quote: "brik_quote",
  support: "brik_support",
  footer: "brik_footer",
}

type Section = "intro" | "quote" | "publications" | "schedule" | "support" | "footer" | "parallax" | "settings"

const sectionInfo: Record<Section, { title: string; desc: string }> = {
  intro: { title: "연구소 소개 관리", desc: "메인 페이지의 연구소 소개 섹션을 편집합니다." },
  quote: { title: "명언 관리", desc: "메인 페이지에 표시되는 본회퍼 명언을 편집합니다." },
  publications: { title: "출판물 관리", desc: "출판물 목록을 추가, 수정, 삭제합니다." },
  schedule: { title: "연구일정 관리", desc: "연구일정을 추가, 수정, 삭제합니다." },
  support: { title: "후원안내 관리", desc: "후원 안내 내용과 계좌 정보를 편집합니다." },
  footer: { title: "푸터 정보 관리", desc: "푸터에 표시되는 정보를 편집합니다." },
  parallax: { title: "배경 이미지 관리", desc: "패럴랙스 스크롤링 배경 이미지를 관리합니다." },
  settings: { title: "설정", desc: "관리자 계정 및 시스템 설정을 관리합니다." },
}

export default function AdminDashboard() {
  const router = useRouter()
  const { settings, updateSettings, resetSettings, DEFAULT_PUBLICATIONS, DEFAULT_SCHEDULES } = useSiteSettings()
  const [activeSection, setActiveSection] = useState<Section>("intro")
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Form states
  const [introData, setIntroData] = useState({
    heroTitle: "",
    heroDescription: "",
    aboutParagraph1: "",
    aboutParagraph2: "",
  })
  const [quoteData, setQuoteData] = useState({ quoteText: "", quoteSource: "" })
  const [publications, setPublications] = useState<Publication[]>(settings.publications || [])
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(settings.schedules || [])
  const [supportData, setSupportData] = useState({
    supportIntro: "",
    supportUsage: "",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
  })
  const [footerData, setFooterData] = useState({
    footerIntro: "",
    addressKo: "",
    addressEn: "",
    representative: "",
    footerEmail: "",
  })
  const [parallaxData, setParallaxData] = useState({
    heroBackgroundImage: "",
    scheduleBackgroundImage: "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Modal states
  const [pubModal, setPubModal] = useState(false)
  const [schedModal, setSchedModal] = useState(false)
  const [editPubIndex, setEditPubIndex] = useState(-1)
  const [editSchedIndex, setEditSchedIndex] = useState(-1)
  const [pubForm, setPubForm] = useState<Publication>({
    title: "",
    author: "",
    publisher: "",
    description: "",
    link: "",
    image: "",
    bgColor: "bg-primary",
  })
  const [schedForm, setSchedForm] = useState<ScheduleItem>({
    title: "",
    date: "",
    time: "",
    description: "",
  })

  // Check authentication
  useEffect(() => {
    const session = sessionStorage.getItem("brik_admin_session")
    if (!session) {
      router.push("/admin/login")
    }
  }, [router])

  // Load data
  const loadSectionData = useCallback((section: Section) => {
    if (typeof window === "undefined") return

    switch (section) {
      case "intro": {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.intro) || "null")
        if (data) setIntroData(data)
        break
      }
      case "quote": {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.quote) || "null")
        if (data) setQuoteData(data)
        break
      }
      case "publications": {
        setPublications(settings.publications || DEFAULT_PUBLICATIONS)
        break
      }
      case "schedule": {
        setScheduleItems(settings.schedules || DEFAULT_SCHEDULES)
        break
      }
      case "support": {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.support) || "null")
        if (data) setSupportData(data)
        break
      }
      case "footer": {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.footer) || "null")
        if (data) setFooterData(data)
        break
      }
      case "parallax": {
        setParallaxData({
          heroBackgroundImage: settings.heroBackgroundImage,
          scheduleBackgroundImage: settings.scheduleBackgroundImage,
        })
        break
      }
    }
  }, [settings])

  useEffect(() => {
    loadSectionData(activeSection)
  }, [activeSection, loadSectionData])

  // Toast notification
  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem("brik_admin_session")
    router.push("/admin/login")
  }

  // Save functions
  const saveIntro = () => {
    localStorage.setItem(STORAGE_KEYS.intro, JSON.stringify(introData))
    showToast("연구소 소개가 저장되었습니다.")
  }

  const saveQuote = () => {
    localStorage.setItem(STORAGE_KEYS.quote, JSON.stringify(quoteData))
    showToast("명언이 저장되었습니다.")
  }

  const saveSupport = () => {
    localStorage.setItem(STORAGE_KEYS.support, JSON.stringify(supportData))
    showToast("후원안내가 저장되었습니다.")
  }

  const saveFooter = () => {
    localStorage.setItem(STORAGE_KEYS.footer, JSON.stringify(footerData))
    showToast("푸터 정보가 저장되었습니다.")
  }

  const saveParallax = async () => {
    await updateSettings(parallaxData)
    showToast("배경 이미지가 저장되었습니다.")
  }

  const resetParallax = async () => {
    const defaultSettings = await resetSettings()
    setParallaxData({
      heroBackgroundImage: defaultSettings.heroBackgroundImage,
      scheduleBackgroundImage: defaultSettings.scheduleBackgroundImage,
    })
    showToast("기본값으로 복원되었습니다.")
  }

  // Publication management
  const openPubModal = (index = -1) => {
    setEditPubIndex(index)
    if (index >= 0) {
      setPubForm(publications[index])
    } else {
      setPubForm({ title: "", author: "", publisher: "", description: "", link: "", image: "", bgColor: "bg-primary" })
    }
    setPubModal(true)
  }

  const savePub = async () => {
    const newPubs = [...publications]
    if (editPubIndex >= 0) {
      newPubs[editPubIndex] = pubForm
    } else {
      newPubs.push(pubForm)
    }
    setPublications(newPubs)
    await updateSettings({ publications: newPubs })
    setPubModal(false)
    showToast("출판물이 저장되었습니다.")
  }

  const deletePub = async (index: number) => {
    if (confirm("이 출판물을 삭제하시겠습니까?")) {
      const newPubs = publications.filter((_, i) => i !== index)
      setPublications(newPubs)
      await updateSettings({ publications: newPubs })
      showToast("출판물이 삭제되었습니다.")
    }
  }

  // Schedule management
  const openSchedModal = (index = -1) => {
    setEditSchedIndex(index)
    if (index >= 0) {
      setSchedForm(scheduleItems[index])
    } else {
      setSchedForm({ title: "", date: "", time: "", description: "" })
    }
    setSchedModal(true)
  }

  const saveSched = async () => {
    const newScheds = [...scheduleItems]
    if (editSchedIndex >= 0) {
      newScheds[editSchedIndex] = schedForm
    } else {
      newScheds.push(schedForm)
    }
    setScheduleItems(newScheds)
    await updateSettings({ schedules: newScheds })
    setSchedModal(false)
    showToast("일정이 저장되었습니다.")
  }

  const deleteSched = async (index: number) => {
    if (confirm("이 일정을 삭제하시겠습니까?")) {
      const newScheds = scheduleItems.filter((_, i) => i !== index)
      setScheduleItems(newScheds)
      await updateSettings({ schedules: newScheds })
      showToast("일정이 삭제되었습니다.")
    }
  }

  // Password change
  const changePassword = () => {
    const admin = JSON.parse(localStorage.getItem("brik_admin") || "{}")

    if (passwordData.currentPassword !== admin.password) {
      showToast("현재 비밀번호가 올바르지 않습니다.", "error")
      return
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("새 비밀번호가 일치하지 않습니다.", "error")
      return
    }
    if (passwordData.newPassword.length < 4) {
      showToast("비밀번호는 4자 이상이어야 합니다.", "error")
      return
    }

    admin.password = passwordData.newPassword
    localStorage.setItem("brik_admin", JSON.stringify(admin))
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
    showToast("비밀번호가 변경되었습니다.")
  }

  // Data reset
  const resetAllData = async () => {
    if (confirm("정말로 모든 데이터를 초기화하시겠습니까?\n이 작업은 되돌릴 수 없습니다.")) {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key)
      })
      await resetSettings()
      setPublications(DEFAULT_PUBLICATIONS)
      setScheduleItems(DEFAULT_SCHEDULES)
      showToast("모든 데이터가 초기화되었습니다.")
      loadSectionData("intro")
    }
  }

  // Backup
  const handleBackup = () => {
    const backup: Record<string, unknown> = {}
    Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
      backup[name] = JSON.parse(localStorage.getItem(key) || "null")
    })
    backup.parallax = parallaxData
    backup.publications = publications
    backup.schedules = scheduleItems

    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `brik_backup_${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)

    showToast("백업 파일이 다운로드됩니다.")
  }

  // Restore
  const handleRestore = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const backup = JSON.parse(ev.target?.result as string)
        Object.entries(STORAGE_KEYS).forEach(([name, key]) => {
          if (backup[name]) {
            localStorage.setItem(key, JSON.stringify(backup[name]))
          }
        })
        if (backup.parallax) {
          setParallaxData(backup.parallax)
        }
        if (backup.publications) {
          setPublications(backup.publications)
        }
        if (backup.schedules) {
          setScheduleItems(backup.schedules)
        }
        await updateSettings({
          ...backup.parallax,
          publications: backup.publications || DEFAULT_PUBLICATIONS,
          schedules: backup.schedules || DEFAULT_SCHEDULES,
        })
        showToast("데이터가 복원되었습니다.")
        loadSectionData(activeSection)
      } catch {
        showToast("올바른 백업 파일이 아닙니다.", "error")
      }
    }
    reader.readAsText(file)
    e.target.value = ""
  }

  // Image preview handler
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setter(ev.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const sidebarItems: { section: Section; icon: React.ReactNode; label: string }[] = [
    { section: "intro", icon: <Building2 className="h-5 w-5" />, label: "연구소 소개" },
    { section: "quote", icon: <Quote className="h-5 w-5" />, label: "명언 관리" },
    { section: "publications", icon: <BookOpen className="h-5 w-5" />, label: "출판물 관리" },
    { section: "schedule", icon: <Calendar className="h-5 w-5" />, label: "연구일정 관리" },
    { section: "support", icon: <Heart className="h-5 w-5" />, label: "후원안내 관리" },
    { section: "parallax", icon: <ImageIcon className="h-5 w-5" />, label: "배경 이미지" },
    { section: "settings", icon: <Settings className="h-5 w-5" />, label: "설정" },
  ]

  return (
    <div className="flex min-h-screen bg-muted">
      {/* Mobile menu button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-primary p-2 text-white shadow-lg lg:hidden"
      >
        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-primary text-white transition-transform lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-4">
          <div className="mb-2 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <span className="text-xs font-bold">BRIK</span>
            </div>
            <div>
              <h1 className="font-bold">관리자 대시보드</h1>
              <p className="text-xs opacity-70">한국본회퍼연구소</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2">
          {sidebarItems.map((item) => (
            <button
              key={item.section}
              onClick={() => {
                setActiveSection(item.section)
                setMobileMenuOpen(false)
              }}
              className={`flex w-full items-center gap-3 rounded-r-lg border-l-[3px] px-4 py-3 text-left transition-all ${
                activeSection === item.section
                  ? "border-l-white bg-white/10"
                  : "border-l-transparent hover:bg-white/10"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto border-t border-white/20 p-4">
          <Link
            href="/"
            className="block px-4 py-2 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            메인 페이지 보기
          </Link>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm opacity-70 transition-opacity hover:opacity-100"
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:ml-64 lg:p-8">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="pl-12 lg:pl-0">
            <h2 className="text-2xl font-bold text-foreground">{sectionInfo[activeSection].title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{sectionInfo[activeSection].desc}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleBackup}>
              <Download className="mr-2 h-4 w-4" />
              데이터 백업
            </Button>
            <label>
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  데이터 복원
                </span>
              </Button>
              <input type="file" accept=".json" onChange={handleRestore} className="hidden" />
            </label>
          </div>
        </header>

        {/* Content Sections */}
        {activeSection === "intro" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>히어로 섹션</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">메인 제목</label>
                  <Input
                    value={introData.heroTitle}
                    onChange={(e) => setIntroData({ ...introData, heroTitle: e.target.value })}
                    placeholder="오늘 우리에게 예수 그리스도는 누구신가?"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">메인 설명</label>
                  <textarea
                    value={introData.heroDescription}
                    onChange={(e) => setIntroData({ ...introData, heroDescription: e.target.value })}
                    placeholder="한국본회퍼연구소는..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연구소 소개 본문</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">소개 문단 1</label>
                  <textarea
                    value={introData.aboutParagraph1}
                    onChange={(e) => setIntroData({ ...introData, aboutParagraph1: e.target.value })}
                    placeholder="한국본회퍼연구소는 디트리히 본회퍼의..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">소개 문단 2</label>
                  <textarea
                    value={introData.aboutParagraph2}
                    onChange={(e) => setIntroData({ ...introData, aboutParagraph2: e.target.value })}
                    placeholder="우리는 학술 연구, 번역 출판..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveIntro}>변경사항 저장</Button>
          </div>
        )}

        {activeSection === "quote" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>본회퍼 명언</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">명언 내용</label>
                  <textarea
                    value={quoteData.quoteText}
                    onChange={(e) => setQuoteData({ ...quoteData, quoteText: e.target.value })}
                    placeholder="값비싼 은혜란..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">출처</label>
                  <Input
                    value={quoteData.quoteSource}
                    onChange={(e) => setQuoteData({ ...quoteData, quoteSource: e.target.value })}
                    placeholder="- 디트리히 본회퍼, '나를 따르라' 중에서"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveQuote}>변경사항 저장</Button>
          </div>
        )}

        {activeSection === "publications" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">출판물 목록</h3>
              <Button onClick={() => openPubModal()}>
                <Plus className="mr-2 h-4 w-4" />새 출판물 추가
              </Button>
            </div>

            {publications.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">등록된 출판물이 없습니다.</Card>
            ) : (
              <div className="space-y-4">
                {publications.map((pub, index) => (
                  <Card key={index} className="flex gap-4 p-4">
                    {pub.image ? (
                      <div className="relative h-28 w-20 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image src={pub.image} alt={pub.title} fill className="object-cover" unoptimized />
                      </div>
                    ) : (
                      <div className="h-28 w-20 flex-shrink-0 rounded-lg bg-muted" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-bold">{pub.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {pub.author} | {pub.publisher}
                      </p>
                      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pub.description}</p>
                    </div>
                    <div className="flex flex-shrink-0 gap-2">
                      <Button variant="outline" size="sm" onClick={() => openPubModal(index)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deletePub(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeSection === "schedule" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">연구일정 목록</h3>
              <Button onClick={() => openSchedModal()}>
                <Plus className="mr-2 h-4 w-4" />새 일정 추가
              </Button>
            </div>

            {scheduleItems.length === 0 ? (
              <Card className="p-8 text-center text-muted-foreground">등록된 일정이 없습니다.</Card>
            ) : (
              <div className="space-y-4">
                {scheduleItems.map((item, index) => {
                  const date = new Date(item.date)
                  const day = date.getDate()
                  const month = date.getMonth() + 1

                  return (
                    <Card key={index} className="flex gap-4 border-l-4 border-l-primary p-4">
                      <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                        <div className="text-2xl font-bold">{day || "-"}</div>
                        <div className="text-xs">{month || "-"}월</div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold">{item.title}</h4>
                        <p className="text-sm text-accent">
                          {item.date} · {item.time}
                        </p>
                        <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <div className="flex flex-shrink-0 gap-2">
                        <Button variant="outline" size="sm" onClick={() => openSchedModal(index)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => deleteSched(index)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {activeSection === "support" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>후원안내 내용</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">소개 문구</label>
                  <textarea
                    value={supportData.supportIntro}
                    onChange={(e) => setSupportData({ ...supportData, supportIntro: e.target.value })}
                    placeholder="한국본회퍼연구소는..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">사용처 안내</label>
                  <textarea
                    value={supportData.supportUsage}
                    onChange={(e) => setSupportData({ ...supportData, supportUsage: e.target.value })}
                    placeholder="학술 연구, 번역 및 출판..."
                    className="min-h-[120px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>후원 계좌 정보</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">은행명</label>
                  <Input
                    value={supportData.bankName}
                    onChange={(e) => setSupportData({ ...supportData, bankName: e.target.value })}
                    placeholder="신한은행"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">계좌번호</label>
                  <Input
                    value={supportData.accountNumber}
                    onChange={(e) => setSupportData({ ...supportData, accountNumber: e.target.value })}
                    placeholder="100-036-033601"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">예금주</label>
                  <Input
                    value={supportData.accountHolder}
                    onChange={(e) => setSupportData({ ...supportData, accountHolder: e.target.value })}
                    placeholder="한국본회퍼연구소"
                  />
                </div>
              </CardContent>
            </Card>

            <Button onClick={saveSupport}>변경사항 저장</Button>
          </div>
        )}

        {activeSection === "parallax" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>히어로 섹션 배경</CardTitle>
                <CardDescription>
                  메인 페이지 상단의 히어로 섹션에 표시되는 패럴랙스 배경 이미지입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  {parallaxData.heroBackgroundImage && (
                    <Image
                      src={parallaxData.heroBackgroundImage}
                      alt="히어로 배경 미리보기"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/60 via-secondary/50 to-primary/70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-white drop-shadow-lg">히어로 섹션 미리보기</span>
                  </div>
                </div>
                <Input
                  type="url"
                  placeholder="이미지 URL을 입력하세요"
                  value={parallaxData.heroBackgroundImage}
                  onChange={(e) =>
                    setParallaxData({ ...parallaxData, heroBackgroundImage: e.target.value })
                  }
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>연구일정 섹션 배경</CardTitle>
                <CardDescription>연구일정 섹션에 표시되는 패럴랙스 배경 이미지입니다.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                  {parallaxData.scheduleBackgroundImage && (
                    <Image
                      src={parallaxData.scheduleBackgroundImage}
                      alt="연구일정 배경 미리보기"
                      fill
                      className="object-cover opacity-30"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-semibold text-primary drop-shadow-lg">연구일정 섹션 미리보기</span>
                  </div>
                </div>
                <Input
                  type="url"
                  placeholder="이미지 URL을 입력하세요"
                  value={parallaxData.scheduleBackgroundImage}
                  onChange={(e) =>
                    setParallaxData({ ...parallaxData, scheduleBackgroundImage: e.target.value })
                  }
                  className="font-mono text-sm"
                />
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button onClick={saveParallax}>설정 저장</Button>
              <Button variant="outline" onClick={resetParallax}>
                기본값으로 복원
              </Button>
            </div>
          </div>
        )}

        {activeSection === "settings" && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>관리자 비밀번호 변경</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">현재 비밀번호</label>
                  <Input
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    placeholder="현재 비밀번호"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">새 비밀번호</label>
                  <Input
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    placeholder="새 비밀번호"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">새 비밀번호 확인</label>
                  <Input
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="새 비밀번호 확인"
                  />
                </div>
                <Button onClick={changePassword}>비밀번호 변경</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>데이터 초기화</CardTitle>
                <CardDescription>
                  모든 수정된 콘텐츠를 기본값으로 되돌립니다. 이 작업은 되돌릴 수 없습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={resetAllData}>
                  모든 데이터 초기화
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Publication Modal */}
      {pubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">출판물 {editPubIndex >= 0 ? "수정" : "추가"}</h3>
              <button onClick={() => setPubModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">제목</label>
                <Input
                  value={pubForm.title}
                  onChange={(e) => setPubForm({ ...pubForm, title: e.target.value })}
                  placeholder="책 제목"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">저자</label>
                <Input
                  value={pubForm.author}
                  onChange={(e) => setPubForm({ ...pubForm, author: e.target.value })}
                  placeholder="저자명"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">출판사</label>
                <Input
                  value={pubForm.publisher}
                  onChange={(e) => setPubForm({ ...pubForm, publisher: e.target.value })}
                  placeholder="출판사"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">설명</label>
                <textarea
                  value={pubForm.description}
                  onChange={(e) => setPubForm({ ...pubForm, description: e.target.value })}
                  placeholder="책 설명"
                  className="min-h-[100px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">구매 링크 (선택사항)</label>
                <Input
                  type="url"
                  value={pubForm.link}
                  onChange={(e) => setPubForm({ ...pubForm, link: e.target.value })}
                  placeholder="https://smartstore.naver.com/..."
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  링크를 입력하면 책 표지를 클릭했을 때 해당 페이지로 이동합니다.
                </p>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">배경색 (이미지가 없을 때 표시)</label>
                <select
                  value={pubForm.bgColor || "bg-primary"}
                  onChange={(e) => setPubForm({ ...pubForm, bgColor: e.target.value })}
                  className="w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                >
                  <option value="bg-primary">파랑 (Primary)</option>
                  <option value="bg-secondary">청록 (Secondary)</option>
                  <option value="bg-accent">갈색 (Accent)</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">표지 이미지</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, (val) => setPubForm({ ...pubForm, image: val }))}
                  className="w-full"
                />
                {pubForm.image && (
                  <div className="relative mt-2 h-36 w-24 overflow-hidden rounded-lg">
                    <Image src={pubForm.image} alt="표지 미리보기" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={savePub}>
                저장
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setPubModal(false)}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      {schedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-card p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">연구일정 {editSchedIndex >= 0 ? "수정" : "추가"}</h3>
              <button onClick={() => setSchedModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">일정 제목</label>
                <Input
                  value={schedForm.title}
                  onChange={(e) => setSchedForm({ ...schedForm, title: e.target.value })}
                  placeholder="일정 제목"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">날짜</label>
                <Input
                  type="date"
                  value={schedForm.date}
                  onChange={(e) => setSchedForm({ ...schedForm, date: e.target.value })}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">시간</label>
                <Input
                  value={schedForm.time}
                  onChange={(e) => setSchedForm({ ...schedForm, time: e.target.value })}
                  placeholder="오후 2시"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">설명</label>
                <textarea
                  value={schedForm.description}
                  onChange={(e) => setSchedForm({ ...schedForm, description: e.target.value })}
                  placeholder="일정 설명"
                  className="min-h-[100px] w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary"
                />
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="flex-1" onClick={saveSched}>
                저장
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => setSchedModal(false)}>
                취소
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 animate-in slide-in-from-right rounded-lg px-6 py-4 font-medium text-white shadow-lg ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
