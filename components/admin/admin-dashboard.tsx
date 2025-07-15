"use client"

import { useState, useMemo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Download, Users, CreditCard, AlertCircle, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Loader2 } from "lucide-react"
import { useSorteoData } from "@/hooks/use-sorteo-data"
// Agregar el import del componente de sorteo
import { LotteryDraw } from "@/components/admin/lottery-draw"
import { EditCustomerModal } from "@/components/admin/edit-customer-modal"
import { MultipleNumbersParticipants } from "@/components/admin/multiple-numbers-participants"

export function AdminDashboard() {
  // Agregar un estado para controlar las pestañas
  const [activeTab, setActiveTab] = useState<"dashboard" | "lottery" | "multiple">("dashboard")
  const { numbers, updatePaymentStatus, updateReservationStatus, updateCustomerData, getStats, isLoading } = useSorteoData()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"all" | "reserved" | "available">("all")
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "pending" | "cancelled">("all")
  
  // Estados para el modal de edición
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingNumber, setEditingNumber] = useState<number | null>(null)
  const [editingCustomerData, setEditingCustomerData] = useState<{
    name: string
    phone: string
    email?: string
    notes?: string
  } | null>(null)

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(50)

  const stats = getStats()

  // Memoizar el filtrado para evitar recálculos innecesarios
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

  // Memoizar la paginación
  const paginatedNumbers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredNumbers.slice(startIndex, endIndex)
  }, [filteredNumbers, currentPage, itemsPerPage])

  // Calcular información de paginación
  const totalPages = Math.ceil(filteredNumbers.length / itemsPerPage)
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, filteredNumbers.length)

  // Resetear página cuando cambian los filtros
  const handleFilterChange = useCallback((newFilter: any, filterType: 'search' | 'status' | 'payment') => {
    setCurrentPage(1) // Resetear a la primera página
    if (filterType === 'search') setSearchTerm(newFilter)
    else if (filterType === 'status') setStatusFilter(newFilter)
    else if (filterType === 'payment') setPaymentFilter(newFilter)
  }, [])

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

  const handleEditCustomer = (number: number, customerData: any) => {
    setEditingNumber(number)
    setEditingCustomerData({
      name: customerData.customerName || "",
      phone: customerData.customerPhone || "",
      email: customerData.customerEmail || "",
      notes: customerData.customerNotes || "",
    })
    setShowEditModal(true)
  }

  const handleSaveCustomer = async (data: {
    name: string
    phone: string
    email?: string
    notes?: string
  }) => {
    if (editingNumber) {
      await updateCustomerData(editingNumber, data)
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingNumber(null)
    setEditingCustomerData(null)
  }

  // Funciones de paginación
  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  const goToFirstPage = () => goToPage(1)
  const goToLastPage = () => goToPage(totalPages)
  const goToPreviousPage = () => goToPage(currentPage - 1)
  const goToNextPage = () => goToPage(currentPage + 1)

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
            <button
              onClick={() => setActiveTab("multiple")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "multiple"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Múltiples Números
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
                      onChange={(e) => handleFilterChange(e.target.value, 'search')}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={(value: any) => handleFilterChange(value, 'status')}>
                    <SelectTrigger>
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los estados</SelectItem>
                      <SelectItem value="available">Disponibles</SelectItem>
                      <SelectItem value="reserved">Reservados</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={paymentFilter} onValueChange={(value: any) => handleFilterChange(value, 'payment')}>
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
                    Mostrando {startItem}-{endItem} de {filteredNumbers.length} números
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de números */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                <CardTitle>Gestión de Números</CardTitle>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">Mostrar:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                        setItemsPerPage(parseInt(value))
                        setCurrentPage(1)
                      }}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                          <SelectItem value="100">100</SelectItem>
                          <SelectItem value="200">200</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Número</th>
                        <th className="text-left p-2">Estado</th>
                        <th className="text-left p-2">Cliente</th>
                        <th className="text-left p-2">Teléfono</th>
                        <th className="text-left p-2">Pago</th>
                        <th className="text-left p-2">Fecha</th>
                        <th className="text-left p-2">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                            <span className="text-gray-600">Cargando datos...</span>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedNumbers.map((num) => (
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
                            <div className="flex items-center space-x-2">
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
                              {num.isReserved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditCustomer(num.number, num)}
                                  className="h-8 w-8 p-0"
                                  title="Editar datos del cliente"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                    </tbody>
                  </table>

                  {paginatedNumbers.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No se encontraron números con los filtros aplicados</p>
                    </div>
                  )}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronsLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {/* Números de página */}
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum
                          if (totalPages <= 5) {
                            pageNum = i + 1
                          } else if (currentPage <= 3) {
                            pageNum = i + 1
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i
                          } else {
                            pageNum = currentPage - 2 + i
                          }
                          
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              onClick={() => goToPage(pageNum)}
                              className="w-8 h-8 p-0"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronsRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : activeTab === "lottery" ? (
          <LotteryDraw />
        ) : (
          <MultipleNumbersParticipants numbers={numbers} />
        )}
      </div>

      {/* Modal de edición de cliente */}
      {showEditModal && editingCustomerData && editingNumber && (
        <EditCustomerModal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          customerData={editingCustomerData}
          number={editingNumber}
          onSave={handleSaveCustomer}
        />
      )}
    </>
  )
}
