import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RifaDetails } from "@/components/rifa-details"

// Mock data - in a real app this would come from a database
const rifaData = {
  1: {
    id: 1, 
    title: "Ford Ka 2007",
    description:
      "Año 2007  con 150 MIL Kilómetros  Recorrido, 3 Dueños, Transmisión Sincronico, Cauchos Nuevos, Todos Sus documentos en Regla",
    price: 500,
    gameDate: "30 de Septiembre, 2025",
    image: "/fordKa.jpg",
    status: "Activa",
    ticketsSold: 1250,
    totalTickets: 2000,
    prizes: [
      {
        id: 1,
        title: "Primer Premio - Toyota Corolla 2024",
        description: "Vehículo completamente nuevo con garantía de fábrica por 3 años",
        image: "/fordKa.jpg",
      },
      {
        id: 2,
        title: "Segundo Premio - $500 USD",
        description: "Quinientos dólares americanos en efectivo",
        image: "/premiodinero.jpg",
      },
      {
        id: 3,
        title: "Tercer Premio - $200 USD",
        description: "Docientos dólares americanos en efectivo",
        image: "/premiodinero.jpg",
      },
    ],
  },
  2: {
    id: 2,
    title: "Elantra 1.6 2011",
    description: "Año 2011 Con 180 MIl Kilómetros Recorrido, 3 Dueños, Transmisión Automático, Cauchos Nuevos, Todos Sus documentos en Regla.",
    price: 400,
    gameDate: "31 de Octubre, 2025",
    image: "/elantra16.jpg",
    status: "Activa",
    ticketsSold: 890,
    totalTickets: 1500,
    prizes: [
      {
        id: 1,
        title: "Primer Premio - Honda Civic Sport 2024",
        description: "Vehículo deportivo con todas las características premium",
        image: "/elantra16.jpg",
      },
      {
        id: 2,
        title: "Segundo Premio - $750 USD",
        description: "Setecientos cincuenta dólares americanos en efectivo",
        image: "/premiodinero.jpg",
      },
    ],
  },
  3: {
    id: 3,
    title: "Tacoma TRD Sport 2017",
    description:
      "Año 2017 Con 131 MIl Kilómetros Recorrido, 5 Dueños, Transmisión Automática 4X4, Cauchos Nuevos, Todos Sus documentos en Regla.",
    price: 600,
    gameDate: "31 de Diciembre, 2025",
    image: "/tacoma.jpg",
    status: "Próximamente",
    ticketsSold: 0,
    totalTickets: 1000,
    prizes: [
      {
        id: 1,
        title: "Primer Premio - Chevrolet Spark 2024",
        description: "Vehículo económico perfecto para la ciudad",
        image: "/tacoma.jpg",
      },
      {
        id: 2,
        title: "Segundo Premio - $300 USD",
        description: "Trecientos dólares americanos en efectivo",
        image: "//premiodinero.jpg",
      },
    ],
  },
}

export default function RifaPage({ params }: { params: { id: string } }) {
  const rifa = rifaData[Number(params.id) as keyof typeof rifaData]

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
        <RifaDetails rifa={rifa} />
      </main>
      <Footer />
    </div>
  )
}
