import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PurchaseFlow } from "@/components/purchase-flow"

// Mock data - same as rifa details
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
        <PurchaseFlow rifa={rifa} />
      </main>
      <Footer />
    </div>
  )
}
