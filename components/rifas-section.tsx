"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, DollarSign, Banknote } from "lucide-react"
import Link from "next/link"

const rifas = [
  {
    id: 1, 
    title: "Ford Ka 2007",
    description:
      "Año 2007  con 150 MIL Kilómetros  Recorrido, 3 Dueños, Transmisión Sincronico, Cauchos Nuevos, Todos Sus documentos en Regla",
    price: "500",
    gameDate: "30 de Septiembre, 2025",
    image: "/fordKa.jpg",
    status: "Activa",
    ticketsSold: 1250,
    totalTickets: 2000,
  },
  {
    id: 2,
    title: "Elantra 1.6 2011",
    description: "Año 2011 Con 180 MIl Kilómetros Recorrido, 3 Dueños, Transmisión Automático, Cauchos Nuevos, Todos Sus documentos en Regla.",
    price: "400",
    gameDate: "31 de Octubre, 2025",
    image: "/elantra16.jpg",
    status: "Activa",
    ticketsSold: 890,
    totalTickets: 1500,
  },
  {
    id: 3,
    title: "Tacoma TRD Sport 2017",
    description:
      "Año 2017 Con 131 MIl Kilómetros Recorrido, 5 Dueños, Transmisión Automática 4X4, Cauchos Nuevos, Todos Sus documentos en Regla.",
    price: "600",
    gameDate: "31 de Diciembre, 2025",
    image: "/tacoma.jpg",
    status: "Próximamente",
    ticketsSold: 0,
    totalTickets: 1000,
  },
]

export function RifasSection() {
  return (
    <section id="rifas" className="my-16 py-8 md:py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Rifas Disponibles</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Participa en nuestras rifas activas y ten la oportunidad de ganar increíbles vehículos.
          </p>
        </div>

        <div className="space-y-8">
          {rifas.map((rifa) => (
            <Card
              key={rifa.id}
              className="bg-card border-border shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="p-0">
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-64 lg:h-80">
                    <img
                      src={rifa.image || "/placeholder.svg"}
                      alt={rifa.title}
                      className="w-full h-full object-cover rounded-l-lg lg:rounded-l-lg lg:rounded-r-none rounded-r-lg lg:rounded-tr-none"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge
                        variant={rifa.status === "Activa" ? "default" : "secondary"}
                        className={rifa.status === "Activa" ? "bg-primary text-primary-foreground" : ""}
                      >
                        {rifa.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl lg:text-3xl font-bold text-card-foreground mb-3">{rifa.title}</h3>
                      <p className="text-muted-foreground mb-6 text-base lg:text-lg leading-relaxed">
                        {rifa.description}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div className="flex items-center space-x-2">
                          <Banknote className="h-5 w-5 text-primary" />
                          <span className="text-card-foreground">
                            <span className="font-bold text-xl">{rifa.price} Bs </span> por boleto
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">{rifa.gameDate}</span>
                        </div>
                        
                        {/*
                        <div className="flex items-center space-x-2 sm:col-span-2">
                          <Trophy className="h-5 w-5 text-primary" />
                          <span className="text-muted-foreground">
                            {rifa.ticketsSold} / {rifa.totalTickets} boletos vendidos
                          </span>
                        </div>
                        */}
                      </div>

                      {/* Progress bar */}
                      {/**/}
                      <div className="mb-6">
                        <div className="flex justify-between text-sm text-muted-foreground mb-2">
                          <span>Progreso de venta</span>
                          <span>{Math.round((rifa.ticketsSold / rifa.totalTickets) * 100)}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(rifa.ticketsSold / rifa.totalTickets) * 100}%` }}
                          />
                        </div>
                      </div>
                      {/**/}
                    </div>

                    <Link href={`/rifa/${rifa.id}`}>
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-3"
                        disabled={rifa.status === "Próximamente"}
                      >
                        {rifa.status === "Próximamente" ? "Próximamente" : "Comprar Boletos"}
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
