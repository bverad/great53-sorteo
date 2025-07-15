"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Grid, List, User } from "lucide-react"
import { useSorteoData } from "@/hooks/use-sorteo-data"
import { ReserveNumberModal } from "@/components/reserve-number-modal"
import { ReserveMultipleNumbersModal } from "@/components/reserve-multiple-numbers-modal"

export function NumbersSection() {
  const { numbers, getAvailableCount, getReservedCount, reserveNumber, reserveMultipleNumbers } = useSorteoData()
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "available" | "reserved">("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const [showReserveModal, setShowReserveModal] = useState(false)
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)
  const [isReserving, setIsReserving] = useState(false)

  const [showMultipleReserveModal, setShowMultipleReserveModal] = useState(false)
  const [isReservingMultiple, setIsReservingMultiple] = useState(false)

  const filteredNumbers = useMemo(() => {
    let filtered = numbers

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter((num) => num.number.toString().padStart(3, "0").includes(searchTerm))
    }

    // Filtrar por estado
    if (filter === "available") {
      filtered = filtered.filter((num) => !num.isReserved)
    } else if (filter === "reserved") {
      filtered = filtered.filter((num) => num.isReserved)
    }

    return filtered
  }, [numbers, searchTerm, filter])

  const handleNumberClick = (number: number, isReserved: boolean) => {
    if (!isReserved) {
      setSelectedNumber(number)
      setShowReserveModal(true)
    }
  }

  const handleReserve = async (customerData: { name: string; phone: string; email?: string; notes?: string }) => {
    if (!selectedNumber) return

    setIsReserving(true)

    try {
      await reserveNumber(selectedNumber, customerData)
      setShowReserveModal(false)
      setSelectedNumber(null)
    } catch (error) {
      console.error('Error al reservar:', error)
    } finally {
      setIsReserving(false)
    }
  }

  const handleMultipleReserve = async (data: { 
    numbers: number[]
    name: string
    phone: string
    email?: string
    notes?: string 
  }) => {
    setIsReservingMultiple(true)

    try {
      await reserveMultipleNumbers(data.numbers, {
        name: data.name,
        phone: data.phone,
        email: data.email,
        notes: data.notes,
      })
      setShowMultipleReserveModal(false)
    } catch (error) {
      console.error('Error al reservar múltiples números:', error)
    } finally {
      setIsReservingMultiple(false)
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Números del Sorteo</h2>
          <p className="text-lg text-gray-600">Selecciona tu número de la suerte</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">{getAvailableCount()}</p>
              <p className="text-sm text-gray-600">Números Disponibles</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">{getReservedCount()}</p>
              <p className="text-sm text-gray-600">Números Reservados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">1,000</p>
              <p className="text-sm text-gray-600">Total de Números</p>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros y Búsqueda</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Botón de reserva múltiple */}
              <div className="flex justify-center">
                <Button
                  onClick={() => setShowMultipleReserveModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3"
                  size="lg"
                >
                  <User className="h-5 w-5 mr-2" />
                  Reservar Múltiples Números
                </Button>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar número..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")} size="sm">
                    Todos
                  </Button>
                  <Button
                    variant={filter === "available" ? "default" : "outline"}
                    onClick={() => setFilter("available")}
                    size="sm"
                  >
                    Disponibles
                  </Button>
                  <Button
                    variant={filter === "reserved" ? "default" : "outline"}
                    onClick={() => setFilter("reserved")}
                    size="sm"
                  >
                    Reservados
                  </Button>
                </div>

                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de números */}
        <Card>
          <CardContent className="p-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
                {filteredNumbers.map((num) => (
                  <div
                    key={num.number}
                    onClick={() => handleNumberClick(num.number, num.isReserved)}
                    className={`
                      aspect-square flex items-center justify-center rounded-lg border-2 text-sm font-medium transition-all
                      ${
                        num.isReserved
                          ? "bg-red-50 border-red-200 text-red-700 cursor-not-allowed"
                          : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 cursor-pointer hover:scale-105 hover:shadow-md"
                      }
                    `}
                  >
                    {num.number.toString().padStart(3, "0")}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredNumbers.map((num) => (
                  <div
                    key={num.number}
                    onClick={() => handleNumberClick(num.number, num.isReserved)}
                    className={`
                      flex items-center justify-between p-3 rounded-lg border transition-all
                      ${
                        num.isReserved
                          ? "bg-red-50 border-red-200 cursor-not-allowed"
                          : "bg-green-50 border-green-200 hover:bg-green-100 cursor-pointer hover:shadow-md"
                      }
                    `}
                  >
                    <span className="font-medium">Número {num.number.toString().padStart(3, "0")}</span>
                    <Badge variant={num.isReserved ? "destructive" : "default"}>
                      {num.isReserved ? "Reservado" : "Disponible - Click para reservar"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}

            {filteredNumbers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No se encontraron números con los filtros aplicados</p>
              </div>
            )}
          </CardContent>
        </Card>
        <ReserveNumberModal
          isOpen={showReserveModal}
          onClose={() => {
            setShowReserveModal(false)
            setSelectedNumber(null)
          }}
          onReserve={handleReserve}
          numberToReserve={selectedNumber}
          isLoading={isReserving}
        />
        <ReserveMultipleNumbersModal
          isOpen={showMultipleReserveModal}
          onClose={() => setShowMultipleReserveModal(false)}
          onReserve={handleMultipleReserve}
          numbers={numbers}
          isLoading={isReservingMultiple}
        />
      </div>
    </section>
  )
}
