"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, User, CreditCard, CheckCircle, AlertCircle, Copy, Check, Download, Share} from "lucide-react"
import ShareTicketButton from "@/components/ShareTicketButton"
import GenerarPDF from "@/components/generarPdf"
import Link from "next/link"
import Image from "next/image"
import { supabase } from "@/lib/supabase-client" 
import SHA256 from "crypto-js/sha256"
import { useToast } from "@/hooks/use-toast";

interface Rifa {
  id: number
  titulo: string
  precio: number
  foto: string
  fecha_culminacion: string
}

interface PurchaseFlowProps {
  rifa: Rifa
}

interface BuyerData {
  name: string
  cedulaPrefijo: string,
  cedula: string
  email: string
  phonePrefix: string
  phoneNumber: string
  ticketQuantity: number
}

interface PaymentData {
  reference: string
  bank: string
  senderPhone: string
  prefijoTelefono: string
  senderCedula: string
  cedulaPrefijo: string
}

const phonePrefixes = [
  { value: "0412", label: "0412" },
  { value: "0422", label: "0422" },
  { value: "0414", label: "0414" },
  { value: "0424", label: "0424" },
  { value: "0416", label: "0416" },
  { value: "0426", label: "0426" },
]

const banks = [
  { value: "0156", label: "100% BANCO" },
  { value: "0172", label: "BANCAMIGA BANCO UNIVERSAL, C.A." },
  { value: "0171", label: "BANCO ACTIVO" },
  { value: "0114", label: "BANCARIBE" },
  { value: "0128", label: "BANCO CARONÍ" },
  { value: "0175", label: "BANCO DIGITAL DE LOS TRABAJADORES, BANCO UNIVERSAL" },
  { value: "0115", label: "BANCO EXTERIOR" },
  { value: "0151", label: "BANCO FONDO COMÚN" },
  { value: "0105", label: "BANCO MERCANTIL" },
  { value: "0191", label: "BANCO NACIONAL DE CREDITO" },
  { value: "0138", label: "BANCO PLAZA" },
  { value: "0137", label: "BANCO SOFITASA" },
  { value: "0163", label: "BANCO DEL TESORO" },
  { value: "0102", label: "BANCO DE VENEZUELA" },
  { value: "0104", label: "BANCO VENEZOLANO DE CREDITO" },
  { value: "0168", label: "BANCRECER" },
  { value: "0177", label: "BANFANB" },
  { value: "0134", label: "BANESCO" },
  { value: "0146", label: "BANGENTE" },
  { value: "0174", label: "BANPLUS" },
  { value: "0108", label: "BBVA PROVINCIAL" },
  { value: "0157", label: "DELSUR BANCO UNIVERSAL" },
  { value: "0601", label: "INSTITUTO MUNICIPAL DE CREDITO POPULAR" },
  { value: "0178", label: "N58 BANCO DIGITAL BANCO MICROFINANCIERO S A" },
  { value: "0169", label: "R4 BANCO MICROFINANCIERO C.A." },
];

export function PurchaseFlow({ rifa }: PurchaseFlowProps) {
  const [urlTickets, setUrlTickets] = useState("https://yagxdejizsbugjdfqgva.supabase.co/storage/v1/object/sign/archivos/boletos_rifa_prueba.pdf?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV8wZjNkNzEyMC0wYzExLTQ2M2YtYTdhNi03MzUxMjkwZWEwMmMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJhcmNoaXZvcy9ib2xldG9zX3JpZmFfcHJ1ZWJhLnBkZiIsImlhdCI6MTc1ODA2Mzc0OCwiZXhwIjo0OTExNjYzNzQ4fQ.bouSoA_AVqUZgbN84vKnCrPhnrJJ25gY-O0ajh0pru4")
  const [loadingDescargaTickets, setloadingDescargaTickets] = useState(false);
  const [Feedback, setFeedback] = useState("");
  const [idReserva, setIdReserva] = useState("");
  const [BoletosReservadosLista, setBoletosReservadosLista] = useState<any[]>([]);

  const handleGenerarPDF = async () => {
    setloadingDescargaTickets(true);

    const ticketNumbersFormatted = ticketNumbers.map(num => num.toString().padStart(4, "0"));
    // Los datos que le pasarás a tu API para generar el PDF
    const pdfData = {
      nombreRifa: rifa.titulo,
      fechaJuego: rifa.fecha_culminacion,
      cedula: `${buyerData.cedulaPrefijo}${buyerData.cedula}`,
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
      link.download = `boletos_${buyerData.cedulaPrefijo}${buyerData.cedula}_${rifa.titulo}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      alert('Error al generar el PDF. Por favor, inténtalo de nuevo.');
    } finally {
      setloadingDescargaTickets(false);
    }
  };

  const [modalConfirmacionCompra, setmodalConfirmacionCompra] = useState(false);
  const [currentStep, setCurrentStep] = useState(1)
  const [copied, setCopied] = useState(false)
  const [buyerData, setBuyerData] = useState<BuyerData>({
    name: "",
    cedulaPrefijo: "V-",
    cedula: "",
    email: "",
    phonePrefix: "0412",
    phoneNumber: "",
    ticketQuantity: 2,
  })
  const [paymentData, setPaymentData] = useState<PaymentData>({
    reference: "",
    bank: "",
    senderPhone: "",
    prefijoTelefono: "0412",
    senderCedula: "",
    cedulaPrefijo: "V-",
  })
  const [ticketNumbers, setTicketNumbers] = useState<number[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const totalAmount = buyerData.ticketQuantity * rifa.precio

  const cambiarValorCantidadBoletos = (valor:string) => {
    const value = valor;
    let newQuantity;

    if (value === "") {
      newQuantity = 0;
    } else {
      newQuantity = Number.parseInt(value);
      if (buyerData.ticketQuantity === 0 && newQuantity > 0 && newQuantity <= 100) {
        newQuantity = newQuantity;
      }
    }
    if (newQuantity >= 0 && newQuantity <= 100){
      setBuyerData({...buyerData, ticketQuantity: newQuantity,});
    }
  }
  
  async function reservarBoletos(cantidad:number, id_rifa:number) {
    const { data: boletos, error: errorBoletos } = await 
    supabase.rpc("boletos_aleatorios", {limite : cantidad, p_id_rifa : id_rifa});
    if (errorBoletos || !boletos || boletos.length < cantidad) {
      setFeedback("No hay suficientes boletos disponibles en este momento, por favor, Intentelo denuevo más tarde");
      return false;
    }
    const ids = boletos.map((b: { id: number }) => b.id);
    const id_aux = SHA256(ids.join(",")).toString();
    setIdReserva(id_aux);

    const { data, error } = await supabase.rpc('reservar_boletos', {
      p_ids: ids,
      p_id_reserva: id_aux,
    });
    if (error) {
      setFeedback("Error al reservar los boletos, por favor, Intentelo denuevo más tarde");
      return false;
    } else {
      setFeedback("");
      return true;
    }
  }

  const validateBuyerData = async () => {
    const newErrors: Record<string, string> = {}

    if (!buyerData.name.trim()) newErrors.name = "El nombre es requerido"
    if (!buyerData.cedula.trim()) newErrors.cedula = "La cédula es requerida"
    if (!buyerData.email.trim()) newErrors.email = "El correo es requerido"
    if (!buyerData.phonePrefix) newErrors.phonePrefix = "El prefijo es requerido"
    if (!buyerData.phoneNumber.trim()) newErrors.phoneNumber = "El número es requerido"
    if (buyerData.ticketQuantity < 1 || buyerData.ticketQuantity > 100) {
      newErrors.ticketQuantity = "Cantidad debe estar entre 1 y 100"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (buyerData.email && !emailRegex.test(buyerData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

    // Cedula validation (basic)
    if (buyerData.cedula && buyerData.cedulaPrefijo) {
      const cedulaFormateada = `${buyerData.cedulaPrefijo}${buyerData.cedula}`;
      if (!cedulaFormateada.match(/^[VE]-?\d{7,8}$/i)) {
        newErrors.cedula = "Formato: V-12345678 o E-12345678"
      }
    }

    setErrors(newErrors)
    const respuestaBoletos = await reservarBoletos(buyerData.ticketQuantity, rifa.id);
    return (Object.keys(newErrors).length === 0 && respuestaBoletos);
  }

  const validatePaymentData = () => {
    const newErrors: Record<string, string> = {}

    if (!paymentData.reference.trim()) newErrors.reference = "La referencia es requerida"
    if (!paymentData.bank) newErrors.bank = "El banco es requerido"
    if (!paymentData.senderPhone.trim()) newErrors.senderPhone = "El teléfono es requerido"
    if (!paymentData.senderCedula.trim()) newErrors.senderCedula = "La cédula es requerida"

    // Reference validation (basic)
    if (paymentData.reference && paymentData.reference.length < 6) {
      newErrors.reference = "La referencia debe tener al menos 6 dígitos"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBuyerDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await validateBuyerData();
    if (isValid) {
      setCurrentStep(2)
    }
  }

  async function fetchBoletos() {
    if (idReserva) {
      const { data, error } = await supabase
        .from('Boletos')
        .select('id, id_rifa, numero_boleto')
        .eq('id_reserva', idReserva);

      if (error) {
        setFeedback("No se pudieron cargar los boletos de la reserva.");
        return null; // Retorna null en caso de error
      }

      if (data && data.length > 0) {
        return data;
      }
    }
    return null;
  }

  async function finalizarCompraBoleto(ids_numbers:number[]) {
    const { error } = await supabase
      .from("Boletos")
      .update({
        estado: "ocupado",
        fecha_compra: new Date().toISOString(),
        nombre_comprador: buyerData.name,
        cedula_comprador: `${buyerData.cedulaPrefijo}${buyerData.cedula}`,
        telefono_comprador: `${buyerData.phonePrefix}${buyerData.phoneNumber}`,
        correo_comprador: buyerData.email,
        id_reserva : null,
      })
      .in("id", ids_numbers)
      .eq("estado", "reservado");

      if (error) {
        setFeedback("Error al confirmar el pago. Por favor, intenta de nuevo.")
        return false;
      } else {
        setFeedback("");
        return true;
      }
    }

  const handlePaymentSubmit: (e: React.FormEvent) => Promise<void> = async (e) => {
      e.preventDefault();
      if (validatePaymentData()) {
          
          const boletosData = await fetchBoletos(); 

          if (!boletosData || boletosData.length === 0) {
              setFeedback("Error: No se obtuvieron los boletos reservados.");
              return;
          }
          setBoletosReservadosLista(boletosData);
          const numbers = boletosData.map(boleto => boleto.numero_boleto);
          const ids_numbers = boletosData.map(boleto => boleto.id);
          
          const respuestaCompra = await finalizarCompraBoleto(ids_numbers);
          setTicketNumbers(numbers);
          setmodalConfirmacionCompra(true);
          {/* 
          paso 3 en cuarentena 

          setCurrentStep(3);
          */}
      }
  }

  const copyTicketNumbers = () => {
    const numbersText = ticketNumbers.map((n) => n.toString().padStart(4, "0")).join(", ")
    navigator.clipboard.writeText(numbersText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {step === 1 && <User className="h-4 w-4" />}
              {step === 2 && <CreditCard className="h-4 w-4" />}
              {step === 3 && <CheckCircle className="h-4 w-4" />}
            </div>
            {step < 3 && <div className={`w-12 h-0.5 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="h-5 w-5 text-primary" />
          <span>Datos del Comprador</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBuyerDataSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="">
              <Label htmlFor="name" >Nombre Completo *</Label>
              <Input
                id="name"
                type="text"
                value={buyerData.name}
                onChange={(e) => setBuyerData({ ...buyerData, name: e.target.value })}
                required
                placeholder="Ingresa tu nombre completo"
                className={errors.name ? "border-red-500 mt-2" : " mt-2"}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
            <div>
              <Label htmlFor="cedula">Cédula de Identidad *</Label>
              <div className="flex flex-row gap-1">
                <Select
                  value={buyerData.cedulaPrefijo}
                  onValueChange={(value) => setBuyerData({ ...buyerData, cedulaPrefijo: value })}
                  required
                >
                  <SelectTrigger className={errors.phonePrefix ? "border-red-500 mt-2" : " mt-2"}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key={"V"} value={"V-"}>
                      {"V"}
                    </SelectItem>
                    <SelectItem key={"E"} value={"E-"}>
                      {"E"}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="cedula"
                  type="text"
                  value={buyerData.cedula}
                  onChange={(e) => setBuyerData({ ...buyerData, cedula: e.target.value })}
                  required
                  maxLength={8}
                  minLength={7}
                  placeholder="12345678"
                  className={errors.cedula ? "border-red-500 mt-2" : " mt-2"}
                />
              </div>
              {errors.cedula && <p className="text-red-500 text-sm mt-1">{errors.cedula}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Correo Electrónico *</Label>
            <Input
              id="email"
              type="email"
              value={buyerData.email}
              onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
              required
              placeholder="tu@email.com"
              className={errors.email ? "border-red-500 mt-2" : " mt-2"}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="phonePrefix">Prefijo *</Label>
              <Select
                value={buyerData.phonePrefix}
                onValueChange={(value) => setBuyerData({ ...buyerData, phonePrefix: value })}
                required
              >
                <SelectTrigger className={errors.phonePrefix ? "border-red-500 mt-2" : " mt-2"}>
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {phonePrefixes.map((prefix) => (
                    <SelectItem key={prefix.value} value={prefix.value}>
                      {prefix.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.phonePrefix && <p className="text-red-500 text-sm mt-1">{errors.phonePrefix}</p>}
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="phoneNumber">Número de Teléfono *</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={buyerData.phoneNumber}
                onChange={(e) => setBuyerData({ ...buyerData, phoneNumber: e.target.value })}
                required
                maxLength={7}
                minLength={7}
                placeholder="1234567"
                className={errors.phoneNumber ? "border-red-500 mt-2" : " mt-2"}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="ticketQuantity">Cantidad de Boletos (1-100) *</Label>
            <Input
              id="ticketQuantity"
              type="text"
              minLength={1}
              maxLength={3}
              value={buyerData.ticketQuantity}
              onChange={(e) => {
                const value = e.target.value;
                cambiarValorCantidadBoletos(value);
              }}
              required
              className={errors.ticketQuantity ? "border-red-500 mt-2" : " mt-2"}
            />
            {errors.ticketQuantity && <p className="text-red-500 text-sm mt-1">{errors.ticketQuantity}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 w-full justify-between">
              <Button type="button" className="w-2/7" variant={buyerData.ticketQuantity === 1 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 1,})}>1</Button>
              <Button type="button" className="font-bold w-2/7" variant={buyerData.ticketQuantity === 2 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 2,})}>2</Button>
              <Button type="button" className="font-bold w-2/7" variant={buyerData.ticketQuantity === 5 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 5,})}>5</Button>
            </div>
            <div className="flex flex-row gap-2 w-full justify-between">
              <Button type="button" className="font-bold w-2/7" variant={buyerData.ticketQuantity === 10 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 10,})}>10</Button>
              <Button type="button" className="font-bold w-2/7" variant={buyerData.ticketQuantity === 20 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 20,})}>20</Button>
              <Button type="button" className="font-bold w-2/7" variant={buyerData.ticketQuantity === 50 ? "default" : "seleccion"} onClick={() => setBuyerData({...buyerData, ticketQuantity: 50,})}>50</Button>
            </div>
            <div className="flex flex-row gap-2 w-full justify-between">
              <Button type="button" className="font-bold w-5/11" variant={buyerData.ticketQuantity === 0 ? "bloqueado" : "outline2"} onClick={() => {const value = (buyerData.ticketQuantity - 1).toString(); cambiarValorCantidadBoletos(value);}}>-</Button>
              <Button type="button" className="font-bold w-5/11" variant={buyerData.ticketQuantity === 100 ? "bloqueado" : "outline2"} onClick={() => {const value = (buyerData.ticketQuantity + 1 ).toString(); cambiarValorCantidadBoletos(value);}}>+</Button>
            </div>
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-semibold">Total a pagar:</span>
              <span className="text-2xl font-bold text-primary">{totalAmount}Bs</span>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {buyerData.ticketQuantity} boleto{buyerData.ticketQuantity > 1 ? "s" : ""} × {rifa.precio}Bs c/u
            </p>
          </div>
          <div className="flex flex-row text-md text-red-500 font-medium justify-center items-center">
            <span>{Feedback}</span>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Continuar al Pago
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-primary" />
          <span>Datos del Pago Móvil</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800 mb-1">Datos para el pago:</h3>
              <p className="text-sm text-blue-700 mb-2">
                <strong>Banco:</strong> R4 BANCO MICROFINANCIERO
                <br />
                <strong>Teléfono:</strong> 0424-1234567
                <br />
                <strong>Cédula:</strong> {buyerData.cedulaPrefijo}{buyerData.cedula}
                <br />
                <strong>Monto:</strong> {totalAmount}Bs
              </p>
            </div>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg mb-6">
          <h3 className="font-semibold mb-2">Resumen de la compra:</h3>
          <p className="text-sm text-muted-foreground">
            {buyerData.ticketQuantity} boleto{buyerData.ticketQuantity > 1 ? "s" : ""} para {rifa.titulo}
          </p>
          <p className="text-xl font-bold text-primary">{totalAmount}Bs</p>
        </div>

        <form onSubmit={handlePaymentSubmit} className="space-y-6">
          <div>
            <Label htmlFor="reference">Número de Referencia *</Label>
            <Input
              id="reference"
              type="text"
              value={paymentData.reference}
              onChange={(e) => setPaymentData({ ...paymentData, reference: e.target.value })}
              required
              placeholder="123456789"
              className={errors.reference ? "border-red-500" : ""}
            />
            {errors.reference && <p className="text-red-500 text-sm mt-1">{errors.reference}</p>}
          </div>

          <div>
            <Label htmlFor="bank">Banco Emisor *</Label>
            <Select
              value={paymentData.bank}
              onValueChange={(value) => setPaymentData({ ...paymentData, bank: value })}
              required
            >
              <SelectTrigger className={errors.bank ? "border-red-500" : ""}>
                <SelectValue placeholder="Seleccionar banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank.value} value={bank.value}>
                    {bank.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.bank && <p className="text-red-500 text-sm mt-1">{errors.bank}</p>}
          </div>

          <div>
            <Label htmlFor="senderPhone">Teléfono Emisor *</Label>
              <div className="flex flex-row gap-1">
                <Select
                  value={paymentData.prefijoTelefono}
                  onValueChange={(value) => setPaymentData({ ...paymentData, prefijoTelefono: value })}
                  required
                >
                  <SelectTrigger className={errors.phonePrefix ? "border-red-500 mt-2" : " mt-2"}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectContent>
                      {phonePrefixes.map((prefix) => (
                        <SelectItem key={prefix.value} value={prefix.value}>
                          {prefix.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectContent>
                </Select>
                <Input
                  id="senderPhone"
                  type="text"
                  value={paymentData.senderPhone}
                  onChange={(e) => setPaymentData({ ...paymentData, senderPhone: e.target.value })}
                  required
                  maxLength={7}
                  minLength={7}
                  placeholder="1234567"
                  className={errors.cedula ? "border-red-500 mt-2" : " mt-2"}
                />
              </div>
            {errors.senderPhone && <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>}
          </div>
          <div>
            <Label htmlFor="senderPhone">Cédula del Emisor *</Label>
              <div className="flex flex-row gap-1">
                <Select
                  value={paymentData.cedulaPrefijo}
                  onValueChange={(value) => setPaymentData({ ...paymentData, cedulaPrefijo: value })}
                  required
                >
                  <SelectTrigger className={errors.phonePrefix ? "border-red-500 mt-2" : " mt-2"}>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectContent>
                      <SelectItem key={"V"} value={"V-"}>
                        {"V"}
                      </SelectItem>
                      <SelectItem key={"E"} value={"E-"}>
                        {"E"}
                      </SelectItem>
                  </SelectContent>
                  </SelectContent>
                </Select>
                <Input
                  id="senderPhone"
                  type="text"
                  value={paymentData.senderCedula}
                  onChange={(e) => setPaymentData({ ...paymentData, senderCedula: e.target.value })}
                  required
                  maxLength={8}
                  minLength={7}
                  placeholder="12345678"
                  className={errors.cedula ? "border-red-500 mt-2" : " mt-2"}
                />
              </div>
            {errors.senderPhone && <p className="text-red-500 text-sm mt-1">{errors.senderPhone}</p>}
          </div>
          <div className="flex flex-row text-md text-red-500 font-medium justify-center items-center">
            <span>{Feedback}</span>
          </div>
          <div className="flex space-x-4">
            <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="flex-1">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Verificar Pago
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )

  const renderStep3 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-2 text-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span>¡Compra Exitosa!</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h3 className="font-semibold text-green-800 mb-2">Pago Verificado</h3>
          <p className="text-green-700">Tu pago ha sido procesado exitosamente</p>
        </div>

        <div className="bg-muted p-4 rounded-lg">
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <h3 className="font-semibold">Tus Números de Boletos:</h3>
            <div className="flex flex-col mt-2 gap-2">
              <div className="flex flex-col md:flex-row gap-2">
              
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
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Compar Boletos</h1>
        <p className="text-muted-foreground">{rifa.titulo}</p>
      </div>

      {renderStepIndicator()}

      <div className="grid lg:grid-cols-3 gap-8"> 
        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        {/* Sidebar */}
        <div>
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <img
                  src={rifa.foto || "/placeholder.svg"}
                  alt={rifa.titulo}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold">{rifa.titulo}</h3>
                <p className="text-sm text-muted-foreground">{rifa.precio}Bs por boleto</p>
              </div>

              {currentStep < 3 && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Cantidad:</span>
                    <span className="font-semibold">
                      {buyerData.ticketQuantity} boleto{buyerData.ticketQuantity > 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Precio unitario:</span>
                    <span>{rifa.precio}Bs</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">{totalAmount}Bs</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      {modalConfirmacionCompra && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div
            className="absolute inset-x-0 z-0 flex items-center justify-center"
            style={{
              transform:
              typeof window !== "undefined" && window.innerWidth < 768
                ? "translateY(-10rem)"
                : "translateY(-8rem)",
            }}
            >
            <div className="w-80 h-80 sm:w-96 sm:h-96 md:w-[400px] md:h-[400px] relative">
              <Image
              src="/modelo2.png"
              alt="Compra realizada exitosamente"
              layout="fill"
              objectFit="contain"
              />
            </div>
            </div>
          
          {/* La tarjeta del modal permanece centrada de forma independiente */}
          <div className="relative z-10 w-11/12 max-w-md mx-auto text-center rounded-2xl bg-white/95 shadow-2xl overflow-hidden animate-fade-in">
            
            <div className="py-6 px-6">
              <div className="hidden md:block">
                <h2 className="text-4xl font-extrabold text-green-600 mb-2 animate-bounce-in">
                  🎉 ¡Felicidades! 🎉
                </h2>
              </div>
              <div className="sm:block md:hidden">
                <h2 className="text-4xl font-extrabold text-green-600 mb-2 animate-bounce-in">
                  ¡Felicidades!<br></br>🎉🎉 
                </h2>
              </div>
              <p className="text-gray-700 text-lg mb-2 font-medium">
                Tu compra de los boletos ha sido exitosa,
                <br />
                ¡ Mucha suerte en la Rifa !
              </p>
              <button
                onClick={() => {
                  setmodalConfirmacionCompra(false);
                  window.location.href = `/boletos/${rifa.id}/${buyerData.cedulaPrefijo}${buyerData.cedula}`;
                }}
                className="px-6 py-2 font-bold text-white bg-green-500 rounded-full hover:bg-green-600 transition-colors duration-200 shadow-md"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}
