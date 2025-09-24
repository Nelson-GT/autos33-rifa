import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { Certificadores } from "@/components/certificadores"
import { ServicesSection } from "@/components/services-section"
import { RifasSection } from "@/components/rifas-section"
import { WaveDivider } from "@/components/wave-divider"
import { GanadoresSection } from "@/components/ganadores-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <Certificadores />
        <RifasSection />
        <GanadoresSection />
      </main> 
      <Footer />
    </div>
  )
}
