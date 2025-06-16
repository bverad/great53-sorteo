import { Suspense } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { PrizeSection } from "@/components/prize-section"
import { NumbersSection } from "@/components/numbers-section"
import { TransferSection } from "@/components/transfer-section"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <PrizeSection />
        <Suspense fallback={<div className="flex justify-center p-8">Cargando números...</div>}>
          <NumbersSection />
        </Suspense>
        <TransferSection />
      </main>
      <Footer />
    </div>
  )
}
