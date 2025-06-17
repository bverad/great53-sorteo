"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Users, CreditCard, AlertCircle } from "lucide-react"
import { useSorteoData } from "@/hooks/use-sorteo-data"
// Agregar el import del componente de sorteo
import { LotteryDraw } from "@/components/admin/lottery-draw"

export function AdminDashboard() {
  // Agregar un estado para controlar las pestañas
  const [activeTab, setActiveTab] = useState<"dashboard" | "lottery">("dashboard")
  const { numbers, updatePaymentStatus, updateReservationStatus, getStats } = useSorteoData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "reserved" | "available">("all")
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all")

  const stats = getStats()

  const filteredNumbers = useMemo(() => {
    let filtered = numbers

    if (searchTerm) {
      filtered = filtered.filter(
        (num) =>
          num.number.toString().padStart(3, "0").includes(searchTerm) ||
          (num.customerName && num.customerName.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter === "reserved") {
      filtered = filtered.filter((num) => num.isReserved)
    } else if (statusFilter === "available") {
      filtered = filtered.filter((num) => !num.isReserved)
    }

    if (paymentFilter !== "all") {
      filtered = filtered.filter((num) => num.paymentStatus === paymentFilter)
    }

    return filtered
  }, [numbers, searchTerm, statusFilter, paymentFilter])

  const exportData = () => {
    const csvContent = [
      ["Número", "Estado", "Cliente", "Pago", "Fecha"].join(","),
      ...numbers.map((num) =>
        [
          num.number.toString().padStart(3, "0"),
          num.isReserved ? "Reservado" : "Disponible",
          num.customerName || "",
          num.paymentStatus || "",
          num.reservedDate || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sorteo-great53.csv"
    a.click()
  }

  return (
    <>
      {/* Después del título "Panel Administrativo", agregar las pestañas */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 h-16 items-center">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "dashboard"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("lottery")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "lottery"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Realizar Sorteo
            </button>
          </div>
        </div>
      </div>

      {/* Reemplazar todo el contenido del div principal con contenido condicional */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "dashboard" ? (
          <>
            {/* Todo el contenido existente del dashboard */}
            {/* Estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Disponibles</p>
                      <p className="text-2xl font-bold text-green-600">{stats.available}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Reservados</p>
                      <p className="text-2xl font-bold text-blue-600">{stats.reserved}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pagados</p>
                      <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Ingresos</p>
                      <p className="text-2xl font-bold text-purple-600">${(stats.paid * 3000).toLocaleString("es-CL")}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Controles */}
            <Card className="mb-6">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filtros y Controles</span>
                  </CardTitle>
                  <Button onClick={exportData} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar número o cliente..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="available">Disponibles</SelectItem>
                      <SelectItem value="reserved">Reservados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={(value: any) => setPaymentFilter(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los pagos</SelectItem>
                      <SelectItem value="paid">Pagado</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="cancelled">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="text-sm text-gray-600 flex items-center">
                    Mostrando {filteredNumbers.length} de {numbers.length} números
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de números */}
            <Card>
              <CardHeader>
                <CardTitle>Gestión de Números</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Número</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Cliente</th>
                        {/* En la sección de thead, agregar una columna más */}
                        <th className="text-left p-2">Teléfono</th>
                        <th className="text-left p-2">Pago</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNumbers.map((num) => (
                        <tr key={num.number} className="border-b hover:bg-gray-50">
                          <td className="p-2 font-mono font-medium">{num.number.toString().padStart(3, "0")}</td>
                          <td className="p-2">
                            <Select
                              value={num.isReserved ? "reservado" : "disponible"}
                              onValueChange={async (value) => {
                                if (value === "disponible") {
                                  await updateReservationStatus(num.number, false)
                                } else {
                                  await updateReservationStatus(num.number, true, {
                                    name: num.customerName,
                                    phone: num.customerPhone,
                                    email: num.customerEmail,
                                    notes: num.customerNotes,
                                  })
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="disponible">Disponible</SelectItem>
                                <SelectItem value="reservado">Reservado</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                          <td className="p-2">{num.customerName || "-"}</td>
                          {/* En la sección de tbody, agregar la celda del teléfono */}
                          <td className="p-2 text-sm text-gray-600">{num.customerPhone || "-"}</td>
                          <td className="p-2">
                            {num.paymentStatus && (
                              <Badge
                                variant={
                                  num.paymentStatus === "paid"
                                    ? "default"
                                    : num.paymentStatus === "pending"
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {num.paymentStatus === "paid"
                                  ? "Pagado"
                                  : num.paymentStatus === "pending"
                                    ? "Pendiente"
                                    : "Cancelado"}
                              </Badge>
                            )}
                          </td>
                          <td className="p-2 text-sm text-gray-600">{num.reservedDate || "-"}</td>
                          <td className="p-2">
                            {num.isReserved && (
                              <Select
                                value={num.paymentStatus || "pending"}
                                onValueChange={(value) => updatePaymentStatus(num.number, value as any)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pendiente</SelectItem>
                                  <SelectItem value="paid">Pagado</SelectItem>
                                  <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {filteredNumbers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron números con los filtros aplicados</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <LotteryDraw />
        )}
      </div>
    </>
  )
}
