

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { Certificadores } from "@/components/certificadores"
import { RifasSection } from "@/components/rifas-section"
import { GanadoresSection } from "@/components/ganadores-section"
import { TerminosModal } from "@/components/terminosModal"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function HomePage() {
  
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <TerminosModal />
        <HeroSection />
        <Certificadores />
        <RifasSection />
        <GanadoresSection />
      </main> 
      <Footer />
    </div>
  )
}
