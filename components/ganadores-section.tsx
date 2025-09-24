"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, ShoppingCart, DollarSign, Handshake } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const services = [
  {
    id: 1,
    title: "Ganador de la Terios 2007",
    description: "Encuentra el vehículo perfecto en nuestro catálogo de autos verificados.",
    icon: ShoppingCart,
    image: "/compra.jpg",
    buttonText: "Ver Catálogo",
    accion: "setShowModalComprar(true);",
    imagenHorizontal: "/ganador1horizontal.jpg",
    imagenVertical: "/ganador1vertical.jpg",
  },
  {
    id: 2,
    title: "¡ Felicidades a los Gandores !",
    description: "Vende tu vehículo de forma rápida y segura con nuestro servicio especializado.",
    icon: DollarSign,
    image: "/vende.jpg",
    buttonText: "Vender Ahora",
    accion: "setShowModalVender(true);",
    imagenHorizontal: "/ganador2horizontal.jpg",
    imagenVertical: "/ganador2vertical.jpg",
  },
  {
    id: 3,
    title: "Ganadores Rifa Marzo / 2025",
    description: "Deja tu auto en consignación y nosotros nos encargamos de todo el proceso de venta.",
    icon: Handshake,
    image: "/consigna.jpg",
    buttonText: "Consignar",
    accion: "setShowModalConsignar(true);",
    imagenHorizontal: "/ganador3horizontal.jpg",
    imagenVertical: "/ganador3vertical.jpg",
  },
  {
    id: 4,
    title: "¡ Juega con nosotros !",
    description: "Deja tu auto en consignación y nosotros nos encargamos de todo el proceso de venta.",
    icon: Handshake,
    image: "/consigna.jpg",
    buttonText: "Consignar",
    accion: "setShowModalConsignar(true);",
    imagenHorizontal: "/ganador4horizontal.jpg",
    imagenVertical: "/ganador4vertical.jpg",
  },
]

interface consignacionData {
  marca: string,
  modelo: string,
  año: string,
  descripcion: string,
  precio: string,
}

export function GanadoresSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % services.length)
      }, 4000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? services.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % services.length
    goToSlide(newIndex)
  }

  return (
    <section id="ganadores" className="relative overflow-hidden my-16 py-8 md:py-16">

      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-40 h-80 bg-red-500 opacity-80 rounded-xl transform rotate-12 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-1/4 right-1/4 w-60 h-60 bg-red-500 opacity-80 rounded-full transform -rotate-6 translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-40 bg-red-500 opacity-80 rounded-xl transform -rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      
      <div className="relative z-10 container mx-auto text-center px-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">¡Tu serás el siguiente Ganador!</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Los sueños se hacen realidad. Inspírate con las historias de nuestros ganadores y visualiza el momento en que serás uno de ellos.
            </p>
          </div>

          {/* Desktop Slider */}
          <div className=" md:block relative">
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {services.map((ganador) => (
                  <div key={ganador.id} className="w-full flex-shrink-0 px-4">
                    <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300 w-full max-w-sm sm:max-w-md mx-auto">
                      <CardContent className="p-0">
                        <div className="flex flex-col">
                          {/* Contenedor de la imagen responsivo */}
                          <div className="relative md:h-80">
                            <picture>
                              {/* Para pantallas grandes (mínimo 640px) */}
                              <source
                                srcSet={ganador.imagenHorizontal}
                                media="(min-width: 640px)"
                              />
                              {/* Para pantallas pequeñas (por defecto, para móviles) */}
                              <img
                                src={ganador.imagenVertical}
                                alt={ganador.title}
                                className="w-full h-full object-cover rounded-t-lg"
                              />
                            </picture>
                          </div>
                          {/* Contenedor del texto responsivo */}
                          <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-center">
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">
                              {ganador.title}
                            </h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons */}
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

            {/* Dots indicator */}
            <div className="flex justify-center mt-6 space-x-2">
              {services.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                    index === currentIndex ? "bg-primary" : "bg-gray-200"
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
