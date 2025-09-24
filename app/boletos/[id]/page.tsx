"use client";

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ShareButton from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Download, Share, Check, Copy} from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface Rifa {
  id: number
  title: string
  price: number
  image: string
  fecha: string
}

const rifaData = {
  1: {
    id: 1,
    title: "Ford Ka 2007",
    price: 500,
    image: "/fordKa.jpg",
    fecha: "30 de Septiembre, 2025",
  },
  2: {
    id: 2,
    title: "Elantra 1.6 2011",
    price: 400,
    image: "/elantra16.jpg",
    fecha: "31 de Octubre, 2025",
  },
  3: {
    id: 3,
    title: "Tacoma TRD Sport 2017",
    price: 600,
    image: "/tacoma.jpg",
    fecha: "31 de Diciembre, 2025",
  },
}

export default function ComprarPage({ params }: { params: { id: string } }) {

  const ticketNumbers = [
    "6512", "2055","9201", "7152", "1327",
    "0299", "4510","3909", "9927", "0761",
  ];
  const rifa = rifaData[Number(params.id) as keyof typeof rifaData]
  const [urlTickets, setUrlTickets] = useState("https://yagxdejizsbugjdfqgva.supabase.co/storage/v1/object/sign/archivos/boletos_rifa_prueba.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZjNkNzEyMC0wYzExLTQ2M2YtYTdhNi03MzUxMjkwZWEwMmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmNoaXZvcy9ib2xldG9zX3JpZmFfcHJ1ZWJhLnBkZiIsImlhdCI6MTc1ODA2Mzc0OCwiZXhwIjo0OTExNjYzNzQ4fQ.bouSoA_AVqUZgbN84vKnCrPhnrJJ25gY-O0ajh0pru4")
  const [loadingDescargaTickets, setloadingDescargaTickets] = useState(false);
  const [copied, setCopied] = useState(false)
  
  const copyTicketNumbers = () => {
    const numbersText = ticketNumbers.map((n) => n.toString().padStart(4, "0")).join(", ")
    navigator.clipboard.writeText(numbersText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGenerarPDF = async () => {
    setloadingDescargaTickets(true);
  
    const ticketNumbersFormatted = ticketNumbers.map(num => num.toString().padStart(4, "0"));
    const pdfData = {
      nombreRifa: rifa.title,
      fechaJuego: rifa.fecha,
      cedula: "V-32067861",
      boletos: ticketNumbersFormatted,
    };
  
    try {
      const response = await fetch('/api/pdf_boletos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      body: JSON.stringify(pdfData),
      });
      if (!response.ok) {
        throw new Error('Error al generar el PDF');
      }
      const blob = await response.blob();
      
      // Crea una URL para el Blob
      const url = window.URL.createObjectURL(blob);
      
      // Crea un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = url;
      link.download = `boletos_V-32067861_${rifa.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Hubo un problema con la operación de fetch:', error);
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setloadingDescargaTickets(false);
    }
  };

  if (!rifa) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Rifa no encontrada</h1>
            <p className="text-muted-foreground">La rifa que buscas no existe o ha sido removida.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
          <Navbar />
          <main className="pt-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">Boletos Comprados</h1>
                <p className="text-muted-foreground">{rifa.title}</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-center space-x-2 text-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span>¡Tus Boletos!</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center space-y-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <h3 className="font-semibold text-green-800 mb-2">Recuerda</h3>
                        <p className="text-green-700">Puedes guardar o compartir tus boletos utilizando los siguientes botones</p>
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-4">
                          <h3 className="font-semibold">Tus Números de Boletos:</h3>
                          <div className="flex flex-col mt-2 gap-2">
                            <div className="flex flex-col md:flex-row gap-2">
                            <ShareButton url={urlTickets} />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={handleGenerarPDF}
                              className="flex items-center space-x-1 bg-transparent"
                            >
                              <Download className="h-4 w-4" />
                            <span>{loadingDescargaTickets ? "Descargando..." : "Descargar"}</span>
                            </Button>
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={copyTicketNumbers}
                              className="flex items-center space-x-1 bg-transparent"
                            >
                              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                              <span>{copied ? "Copiado" : "Copiar"}</span>
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {ticketNumbers.map((number, index) => (
                            <Badge key={index} variant="outline" className="flex justify-center items-center text-lg py-2 px-3 font-mono">
                              {number.toString().padStart(4, "0")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>• Puede volver a consultar estos números con la cédula ingresada</p>
                        <p>• El sorteo se realizará en la fecha programada</p>
                        <p>• El sorteo se realiza en base a los resultados de Super Gana</p>
                        <p>• Los números de boletos se asignan automáticamente</p>
                        <p>• El primer premio será el resultado de Super Gana 10:00 p.m.</p>
                        <p>• El segundo premio será el resultado de Super Gana 4:00 p.m.</p>
                        <p>• El tercer premio será el resultado de Super Gana 1:00 p.m.</p>
                        <p>• Los ganadores serán contactados inmediatamente</p>
                        <p>• Todos los premios incluyen documentación legal</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link href={`/rifa/${rifa.id}`} className="flex-1">
                          <Button variant="outline" className="w-full bg-transparent">
                            Ver Rifa
                          </Button>
                        </Link>
                        <Link href="/" className="flex-1">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Volver al Inicio</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div>
                  <Card className="sticky top-20">
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <img
                          src={rifa.image || "/placeholder.svg"}
                          alt={rifa.title}
                          className="w-full h-32 object-cover rounded-lg mb-3"
                        />
                        <h3 className="font-semibold">{rifa.title}</h3>
                        <p className="text-sm text-muted-foreground">{rifa.price}Bs por boleto</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
          <Footer />
        </div>
  )
}
