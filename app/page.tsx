"use client"
export const dynamic = 'force-dynamic';
import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { QuoteSection } from "@/components/sections/quote-section"
import { AboutSection } from "@/components/sections/about-section"
import { ResearchSection } from "@/components/sections/research-section"
import { PublicationsSection } from "@/components/sections/publications-section"
import { ScheduleSection } from "@/components/sections/schedule-section"
import { SupportSection } from "@/components/sections/support-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <QuoteSection />
      <AboutSection />
      <ResearchSection />
      <PublicationsSection />
      <ScheduleSection />
      <SupportSection />
      <Footer />
    </main>
  )
}
