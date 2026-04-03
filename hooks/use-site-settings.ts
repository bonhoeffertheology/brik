"use client"

import useSWR from "swr"

export interface SiteSettings {
  heroBackgroundImage: string
  scheduleBackgroundImage: string
}

const DEFAULT_SETTINGS: SiteSettings = {
  heroBackgroundImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f611e1d5-0001-0004-0000-000000830848_w860_r1.3848631239935587_fpx36.05_fpy49.92-INRBZp1L4itOUClsuExfCnSbgoHFRn.webp",
  scheduleBackgroundImage: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bonhoeffer-1jb4fMPafMzS3QzfVJe1Sgol4zpTUg.jpg",
}

const STORAGE_KEY = "bonhoeffer-site-settings"

function getStoredSettings(): SiteSettings {
  if (typeof window === "undefined") return DEFAULT_SETTINGS
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
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
  }
}
