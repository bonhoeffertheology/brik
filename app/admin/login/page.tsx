"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"

const DEFAULT_ADMIN = {
  username: "admin",
  password: "brik2022",
}

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Initialize admin account if not exists
    if (!localStorage.getItem("brik_admin")) {
      localStorage.setItem("brik_admin", JSON.stringify(DEFAULT_ADMIN))
    }
    // Check if already logged in
    const session = sessionStorage.getItem("brik_admin_session")
    if (session) {
      router.push("/admin")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const adminData = JSON.parse(localStorage.getItem("brik_admin") || JSON.stringify(DEFAULT_ADMIN))

    if (username.trim() === adminData.username && password === adminData.password) {
      sessionStorage.setItem(
        "brik_admin_session",
        JSON.stringify({
          loggedIn: true,
          loginTime: new Date().toISOString(),
        })
      )
      router.push("/admin")
    } else {
      setError(true)
      setTimeout(() => setError(false), 3000)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <span className="text-sm font-bold text-white">BRIK</span>
          </div>
          <h1 className="text-2xl font-bold text-primary">관리자 로그인</h1>
          <p className="mt-2 text-sm text-muted-foreground">한국본회퍼연구소 홈페이지 관리</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-foreground">
              아이디
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border-2 border-border px-4 py-3 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="관리자 아이디를 입력하세요"
              required
              autoComplete="username"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
              비밀번호
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border-2 border-border px-4 py-3 pr-12 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                placeholder="비밀번호를 입력하세요"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="animate-shake rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              아이디 또는 비밀번호가 올바르지 않습니다.
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-3 font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-secondary hover:shadow-lg"
          >
            로그인
          </button>
        </form>

        {/* Back to Main */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:underline">
            메인 페이지로 돌아가기
          </Link>
        </div>

        {/* Default Credentials Info */}
        <div className="mt-8 rounded-lg bg-muted p-4">
          <p className="text-center text-xs text-muted-foreground">
            <strong>초기 관리자 계정</strong>
            <br />
            아이디: admin / 비밀번호: brik2022
          </p>
        </div>
      </div>
    </div>
  )
}
