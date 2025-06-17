"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Copy, CreditCard, Phone, Building, Mail, MessageCircle } from "lucide-react"
import { useState } from "react"
import dynamic from "next/dynamic"
import QRCode from "react-qr-code"

export function TransferSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const bankInfo = {
    company: "Austral Motos Spa",
    rut: "77.692.562-4",
    bank: "Banco Santander",
    accountType: "Cuenta Corriente",
    accountNumber: "0-000-9351320-7",
    email: "yeanlara.ceo@berasantiago.net",
    phone: "+56957226277",
    contactEmail: "bruno.zeroleft@gmail.com",
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

  const openWhatsApp = () => {
    const message = "Hola! Quiero confirmar mi pago del sorteo Great 53."
    const whatsappUrl = `https://wa.me/${bankInfo.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  const qrValue = `Empresa: Austral Motos Spa\nRUT: 77.692.562-4\nBanco: Santander\nTipo de cuenta: Corriente\nNúmero de cuenta: 0-000-9351320-7\nEmail: yeanlara.ceo@berasantiago.net`;

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Información de Pago</h2>
          <p className="text-lg text-gray-600">Realiza tu transferencia y reserva tu número</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Información bancaria */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-6 w-6" />
                <span>Datos Bancarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Empresa</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.company, "company")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.company}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">RUT</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.rut, "rut")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.rut}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Banco</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.bank, "bank")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.bank}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Tipo de Cuenta</span>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.accountType}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Número de Cuenta</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountNumber, "account")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900 text-lg">{bankInfo.accountNumber}</p>
                {copied === "account" && <p className="text-green-600 text-sm mt-1">¡Copiado!</p>}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Email Bancario</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.email, "email")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Código QR y contacto */}
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <QrCode className="h-6 w-6" />
                <span>Código QR y Contacto</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block mb-4">
                  <QRCode value={qrValue} size={200} />
                </div>
                <p className="text-sm text-gray-600">
                  Escanea el código QR para acceder rápidamente a los datos bancarios
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <MessageCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-gray-900">WhatsApp</span>
                    </div>
                    <Button 
                      onClick={openWhatsApp}
                      variant="outline" 
                      size="sm"
                      className="bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Abrir WhatsApp
                    </Button>
                  </div>
                  <p className="text-gray-700">{bankInfo.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">Haz clic en el botón para abrir WhatsApp y confirmar tu pago</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Email de Contacto</span>
                  </div>
                  <p className="text-gray-700">{bankInfo.contactEmail}</p>
                  <p className="text-sm text-gray-600 mt-1">Email disponible para consultas</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Importante</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Después de realizar la transferencia, envía el comprobante por WhatsApp.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
