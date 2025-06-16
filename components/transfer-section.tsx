"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { QrCode, Copy, CreditCard, Phone, Building } from "lucide-react"
import { useState } from "react"

export function TransferSection() {
  const [copied, setCopied] = useState<string | null>(null)

  const bankInfo = {
    bank: "Banco de Bogotá",
    accountType: "Cuenta de Ahorros",
    accountNumber: "123-456789-01",
    accountHolder: "Fundación COAR",
    nit: "900.123.456-7",
    phone: "+57 300 123 4567",
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(null), 2000)
  }

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
                  <span className="text-sm font-medium text-gray-600">Titular</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountHolder, "holder")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.accountHolder}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">NIT</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.nit, "nit")}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900">{bankInfo.nit}</p>
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
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="h-24 w-24 text-gray-400" />
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Escanea el código QR para acceder rápidamente a los datos bancarios
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-gray-900">Contacto</span>
                  </div>
                  <p className="text-gray-700">{bankInfo.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">WhatsApp disponible para confirmar tu pago</p>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3 mb-2">
                    <Building className="h-5 w-5 text-yellow-600" />
                    <span className="font-medium text-gray-900">Importante</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    Después de realizar la transferencia, envía el comprobante por WhatsApp indicando el número que
                    deseas reservar.
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
