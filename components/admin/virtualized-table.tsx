"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit } from "lucide-react"

interface SorteoNumber {
  number: number
  isReserved: boolean
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerNotes?: string
  paymentStatus?: "pending" | "paid" | "cancelled"
  reservedDate?: string
}

interface VirtualizedTableProps {
  numbers: SorteoNumber[]
  isLoading: boolean
  onUpdatePaymentStatus: (number: number, status: "pending" | "paid" | "cancelled") => Promise<void>
  onUpdateReservationStatus: (number: number, isReserved: boolean, customerData?: any) => Promise<void>
  onEditCustomer: (number: number, customerData: any) => void
}

const ROW_HEIGHT = 60 // Altura estimada de cada fila
const BUFFER_SIZE = 5 // Número de filas adicionales a renderizar arriba y abajo

export function VirtualizedTable({
  numbers,
  isLoading,
  onUpdatePaymentStatus,
  onUpdateReservationStatus,
  onEditCustomer
}: VirtualizedTableProps) {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(600)
  const containerRef = useRef<HTMLDivElement>(null)

  // Calcular qué filas están visibles
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER_SIZE)
  const endIndex = Math.min(
    numbers.length,
    Math.ceil((scrollTop + containerHeight) / ROW_HEIGHT) + BUFFER_SIZE
  )

  // Filas visibles
  const visibleNumbers = numbers.slice(startIndex, endIndex)

  // Calcular offset para posicionar las filas correctamente
  const offsetY = startIndex * ROW_HEIGHT

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setContainerHeight(entry.contentRect.height)
        }
      })
      resizeObserver.observe(containerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Cargando datos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="overflow-hidden">
      {/* Header fijo */}
      <div className="bg-gray-50 border-b sticky top-0 z-10">
        <div className="grid grid-cols-7 gap-4 p-3 font-medium text-sm text-gray-700">
          <div>Número</div>
          <div>Estado</div>
          <div>Cliente</div>
          <div>Teléfono</div>
          <div>Pago</div>
          <div>Fecha</div>
          <div>Acciones</div>
        </div>
      </div>

      {/* Contenedor con scroll */}
      <div
        ref={containerRef}
        className="overflow-auto"
        style={{ height: '600px' }}
        onScroll={handleScroll}
      >
        {/* Contenedor con altura total para el scroll */}
        <div style={{ height: `${numbers.length * ROW_HEIGHT}px`, position: 'relative' }}>
          {/* Filas visibles */}
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleNumbers.map((num, index) => {
              const actualIndex = startIndex + index
              return (
                <div
                  key={num.number}
                  className="grid grid-cols-7 gap-4 p-3 border-b hover:bg-gray-50 transition-colors"
                  style={{ height: `${ROW_HEIGHT}px` }}
                >
                  <div className="font-mono font-medium">
                    {num.number.toString().padStart(3, "0")}
                  </div>
                  
                  <div>
                    <Select
                      value={num.isReserved ? "reservado" : "disponible"}
                      onValueChange={async (value) => {
                        if (value === "disponible") {
                          await onUpdateReservationStatus(num.number, false)
                        } else {
                          await onUpdateReservationStatus(num.number, true, {
                            name: num.customerName,
                            phone: num.customerPhone,
                            email: num.customerEmail,
                            notes: num.customerNotes,
                          })
                        }
                      }}
                    >
                      <SelectTrigger className="text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="disponible">Disponible</SelectItem>
                        <SelectItem value="reservado">Reservado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="truncate">{num.customerName || "-"}</div>
                  <div className="text-sm text-gray-600 truncate">{num.customerPhone || "-"}</div>
                  
                  <div>
                    {num.paymentStatus && (
                      <Badge
                        variant={
                          num.paymentStatus === "paid"
                            ? "default"
                            : num.paymentStatus === "pending"
                              ? "secondary"
                              : "destructive"
                        }
                        className="text-xs"
                      >
                        {num.paymentStatus === "paid"
                          ? "Pagado"
                          : num.paymentStatus === "pending"
                            ? "Pendiente"
                            : "Cancelado"}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 truncate">
                    {num.reservedDate ? new Date(num.reservedDate).toLocaleDateString() : "-"}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {num.isReserved && (
                      <Select
                        value={num.paymentStatus || "pending"}
                        onValueChange={(value) => onUpdatePaymentStatus(num.number, value as any)}
                      >
                        <SelectTrigger className="w-24 text-xs">
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
                        onClick={() => onEditCustomer(num.number, num)}
                        className="h-6 w-6 p-0"
                        title="Editar datos del cliente"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {numbers.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No se encontraron números</p>
        </div>
      )}
    </div>
  )
} 