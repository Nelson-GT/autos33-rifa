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
    title: "Compra tu Auto",
    description: "Encuentra el vehículo perfecto en nuestro catálogo de autos verificados.",
    icon: ShoppingCart,
    image: "/compra.jpg",
    buttonText: "Ver Catálogo",
    accion: 1,
  },
  {
    id: 2,
    title: "Vende tu Auto",
    description: "Vende tu vehículo de forma rápida y segura con nuestro servicio especializado.",
    icon: DollarSign,
    image: "/vende.jpg",
    buttonText: "Vender Ahora",
    accion: 2,
  },
  {
    id: 3,
    title: "Consigna con Nosotros",
    description: "Deja tu auto en consignación y nosotros nos encargamos de todo el proceso de venta.",
    icon: Handshake,
    image: "/consigna.jpg",
    buttonText: "Consignar",
    accion: 3,
  },
]

interface consignacionData {
  marca: string,
  modelo: string,
  año: string,
  descripcion: string,
  precio: string,
}

export function ServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const [showModalConsignar, setShowModalConsignar] = useState(false);
  const [showModalVender, setShowModalVender] = useState(false);
  const [showModalComprar, setShowModalComprar] = useState(false);
  const [consignacionData, setConsignacionData] = useState<consignacionData>({
      marca: "",
      modelo: "",
      año: "",
      descripcion: "",
      precio: "",
    })

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

  const funcionesServicios = (valor:number) => {
    if (valor === 1) {
      window.open(`https://www.instagram.com/autos33_/`,
                  "_blank",
                  "noopener,noreferrer"
                  );
      
    } else if (valor === 2) {
      window.open(
                  "https://api.whatsapp.com/send?phone=584140405551",
                  "_blank",
                  "noopener,noreferrer"
                  );
    } else if (valor === 3) {
      setShowModalConsignar(true);
    }
  }
  return (
    <section id="servicios" className="my-16 py-8 md:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Compra, Vende y Consigna con Nosotros</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos servicios completos para todas tus necesidades automotrices con la confianza y seguridad que
            mereces.
          </p>
        </div>

        {/* Desktop Slider */}
        <div className="hidden md:block relative">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {services.map((service) => (
                <div key={service.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-0">
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className="relative h-64 md:h-80">
                          <img
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            className="w-full h-full object-cover rounded-l-lg"
                          />
                        </div>
                        <div className="p-8 flex flex-col justify-center">
                          <div className="flex items-center mb-4">
                            <service.icon className="h-8 w-8 text-primary mr-3" />
                            <h3 className="text-2xl font-bold text-card-foreground">{service.title}</h3>
                          </div>
                          <p className="text-muted-foreground mb-6 text-lg leading-relaxed">{service.description}</p>
                          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-fit" onClick={() => {funcionesServicios(service.accion);}}
                          >
                            {service.buttonText}
                          </Button>
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
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-border ml-2"
            onClick={goToPrevious}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white border-border mr-2"
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

        {/* Mobile Grid */}
        <div className="md:hidden grid gap-6">
          {services.map((service) => (
            <Card key={service.id} className="bg-card border-border shadow-lg">
              <CardContent className="p-0">
                <div className="relative h-48">
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <service.icon className="h-6 w-6 text-primary mr-2" />
                    <h3 className="text-xl font-bold text-card-foreground">{service.title}</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full" onClick={() => {funcionesServicios(service.accion);}}>
                    {service.buttonText}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {/* Modal para rechazar */}
      {showModalConsignar && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm">
          <div className="flex flex-col item-center justify-center bg-white rounded-lg shadow-lg p-8 max-w-sm w-full mx-5">
            <p className="text-center mb-6 font-semibold text-black text-lg">
              Escriba los datos de su Vehículo
            </p>
            <div className="">
              <Label htmlFor="name" >Marca del Vehículo *</Label>
              <Input
                id="name"
                type="text"
                value={consignacionData.marca}
                onChange={(e) => setConsignacionData({ ...consignacionData, marca: e.target.value })}
                required
                placeholder="Toyota"
                className=" mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="name" >Modelo del Vehículo *</Label>
              <Input
                id="name"
                type="text"
                value={consignacionData.modelo}
                onChange={(e) => setConsignacionData({ ...consignacionData, modelo: e.target.value })}
                required
                placeholder="Yaris"
                className=" mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="name" >Descripción del Vehículo *</Label>
              <Input
                id="name"
                type="text"
                value={consignacionData.descripcion}
                onChange={(e) => setConsignacionData({ ...consignacionData, descripcion: e.target.value })}
                required
                placeholder="100 MIL Kilómetros Recorrido, 1 Dueño"
                className="mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="name" >Año del Vehículo *</Label>
              <Input
                id="name"
                type="month"
                value={consignacionData.año}
                onChange={(e) => setConsignacionData({ ...consignacionData, año: e.target.value })}
                required
                placeholder="100 MIL Kilómetros Recorrido, 1 Dueño"
                className="mt-2"
              />
            </div>
            <div className="">
              <Label htmlFor="name" >Precio del Vehículo ($)*</Label>
              <Input
                id="name"
                type="number"
                value={consignacionData.precio}
                onChange={(e) => setConsignacionData({ ...consignacionData, precio: e.target.value.toString() })}
                required
                placeholder="1000"
                className="mt-2"
              />
            </div>
            <div className="flex justify-between items-center mt-5">
              <Button
                className="w-2/5 bg-gray-400 hover:bg-gray-500 rounded shadow-lg"
                onClick={() => {setShowModalConsignar(false);}}
              >
                <span className="font-bold text-">Volver</span>
              </Button>
              <Button
                className="w-2/5 bg-green-400 hover:bg-green-500 rounded shadow-lg"
                onClick={() => {setShowModalConsignar(false);
                  const telefono ="584140405551" /*"584143497259*/; /* 584140405551 */
                  const mensaje = encodeURIComponent(
                  `Hola, Quiero Consignar con ustedes.\n\n` +
                  `Marca: ${consignacionData.marca}\n` +
                  `Modelo: ${consignacionData.modelo}\n` +
                  `Descripción: ${consignacionData.descripcion}\n` +
                  `Año: ${consignacionData.año}\n` +
                  `Precio tentativo: ${consignacionData.precio}\n`
                  );
                  window.open(
                  `https://api.whatsapp.com/send?phone=${telefono} &text=${mensaje}`,
                  "_blank",
                  "noopener,noreferrer"
                  );
                }}
              >
                <span className="font-bold text-">Continuar</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
