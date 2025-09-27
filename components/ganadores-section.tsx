"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { supabase } from "@/lib/supabase-client" 

interface Ganador {
  id: number
  titulo: string
  foto_url: string
}

export function GanadoresSection() {
  const [ganadores, setGanadores] = useState<Ganador[]>([]) 
  const [isLoading, setIsLoading] = useState(true) 
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchGanadores = async () => {
      setIsLoading(true)
      const { data, error } = await supabase
        .from("Ganadores")
        .select("id, titulo, foto_url")
        .eq("estado", true) 
        .order("id", { ascending: false }) 

      if (error) {
        console.error("Error al obtener los ganadores:", error)
      } else if (data) {
        setGanadores(data as Ganador[])
      }
      setIsLoading(false)
    }

    fetchGanadores()
  }, [])

  useEffect(() => {
    if (isAutoPlaying && ganadores.length > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % ganadores.length)
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying, ganadores.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000) 
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? ganadores.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % ganadores.length
    goToSlide(newIndex)
  }

  if (isLoading) {
    return (
      <section className="py-20 flex justify-center items-center">
        <p className="text-xl text-gray-700">Cargando ganadores...</p>
      </section>
    )
  }

  if (ganadores.length === 0) {
    return (
      <section className="py-20 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">¡Tu serás el siguiente Ganador!</h2>
        <p className="text-lg text-muted-foreground">
          Actualmente no hay ganadores activos para mostrar. ¡Sé el primero en aparecer aquí!
        </p>
      </section>
    )
  }

  return (
    <section id="ganadores" className="relative overflow-hidden my-16 py-8 md:py-16">

      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-40 h-80 bg-red-500 rounded-xl transform rotate-12 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-red-500 rounded-full transform -rotate-6 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-40 bg-red-500 rounded-xl transform -rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 container mx-auto text-center px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">¡Tu serás el siguiente Ganador!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los sueños se hacen realidad. Inspírate con las historias de nuestros ganadores y visualiza el momento en que serás uno de ellos.
            </p>
          </div>

          {/* Slider */}
          <div className=" md:block relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {ganadores.map((ganador) => (
                  <div key={ganador.id} className="w-full flex-shrink-0 px-4">
                    <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm sm:max-w-md mx-auto">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          {/* Contenedor de la imagen responsivo */}
                          <div className="relative md:h-80">
                            <picture>
                              <source
                                srcSet={ganador.foto_url}
                                media="(min-width: 640px)"
                              />
                              <img
                                src={ganador.foto_url}
                                alt={ganador.titulo}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                            </picture>
                          </div>
                          {/* Contenedor del texto responsivo */}
                          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">
                              {ganador.titulo}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons (Solo se muestran si hay más de un ganador) */}
            {ganadores.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white md:bg-gray-200 md:hover:bg-gray-300 border-border"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white md:bg-gray-200 md:hover:bg-gray-300 border-border"
                  onClick={goToNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}

            {/* Dots indicator (Solo se muestran si hay más de un ganador) */}
            {ganadores.length > 1 && (
              <div className="flex justify-center mt-6 space-x-2">
                {ganadores.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                      index === currentIndex ? "bg-primary" : "bg-gray-200"
                    }`}
                    onClick={() => goToSlide(index)}
                  />
                ))}
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  )
}
