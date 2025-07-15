"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Phone, User, MessageSquare, X, Check, AlertCircle } from "lucide-react"

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

interface ReserveMultipleNumbersModalProps {
  isOpen: boolean
  onClose: () => void
  onReserve: (data: { 
    numbers: number[]
    name: string
    phone: string
    email?: string
    notes?: string 
  }) => void
  numbers: SorteoNumber[]
  isLoading?: boolean
}

export function ReserveMultipleNumbersModal({
  isOpen,
  onClose,
  onReserve,
  numbers,
  isLoading = false,
}: ReserveMultipleNumbersModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  })
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")

  // Filtrar números disponibles
  const availableNumbers = useMemo(() => {
    return numbers.filter(num => !num.isReserved)
  }, [numbers])

  // Filtrar por término de búsqueda
  const filteredNumbers = useMemo(() => {
    if (!searchTerm) return availableNumbers
    return availableNumbers.filter(num => 
      num.number.toString().padStart(3, "0").includes(searchTerm)
    )
  }, [availableNumbers, searchTerm])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es obligatorio"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio"
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone.trim())) {
      newErrors.phone = "Formato de teléfono inválido"
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Formato de email inválido"
    }

    if (selectedNumbers.length === 0) {
      newErrors.numbers = "Debes seleccionar al menos un número"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    onReserve({
      numbers: selectedNumbers.sort((a, b) => a - b),
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || undefined,
      notes: formData.notes.trim() || undefined,
    })
  }

  const handleClose = () => {
    setFormData({ name: "", phone: "", email: "", notes: "" })
    setSelectedNumbers([])
    setErrors({})
    setSearchTerm("")
    onClose()
  }

  const toggleNumber = (number: number) => {
    setSelectedNumbers(prev => 
      prev.includes(number) 
        ? prev.filter(n => n !== number)
        : [...prev, number]
    )
  }

  const selectRange = (start: number, end: number) => {
    const rangeNumbers = availableNumbers
      .filter(num => num.number >= start && num.number <= end)
      .map(num => num.number)
    
    setSelectedNumbers(prev => {
      const newSelection = [...prev]
      rangeNumbers.forEach(num => {
        if (!newSelection.includes(num)) {
          newSelection.push(num)
        }
      })
      return newSelection
    })
  }

  const clearSelection = () => {
    setSelectedNumbers([])
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <span>Reservar Múltiples Números</span>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col lg:flex-row gap-6">
          {/* Formulario del cliente */}
          <div className="lg:w-1/2 space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre Completo *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ingresa tu nombre completo"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="phone">Teléfono de Contacto *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+57 300 123 4567"
                    className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email (Opcional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="tu@email.com"
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <Label htmlFor="notes">Notas Adicionales (Opcional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Información adicional..."
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900 mb-1">Importante:</p>
                    <p className="text-blue-700">
                      Después de reservar, debes realizar la transferencia de ${selectedNumbers.length * 3000} y enviar el comprobante por WhatsApp.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Selección de números */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="mb-4">
              <Label htmlFor="search">Buscar números</Label>
              <Input
                id="search"
                placeholder="Buscar por número..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Controles de selección */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => selectRange(1, 100)}
              >
                Seleccionar 1-100
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => selectRange(101, 200)}
              >
                Seleccionar 101-200
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSelection}
              >
                Limpiar Selección
              </Button>
            </div>

            {/* Números seleccionados */}
            {selectedNumbers.length > 0 && (
              <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-green-800">
                    Números seleccionados: {selectedNumbers.length}
                  </span>
                  <Badge variant="default" className="bg-green-600">
                    ${selectedNumbers.length * 3000}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedNumbers.slice(0, 10).map(num => (
                    <Badge key={num} variant="secondary" className="text-xs">
                      {num.toString().padStart(3, "0")}
                    </Badge>
                  ))}
                  {selectedNumbers.length > 10 && (
                    <Badge variant="secondary" className="text-xs">
                      +{selectedNumbers.length - 10} más
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Error de números */}
            {errors.numbers && (
              <div className="mb-4 p-3 bg-red-50 rounded-lg border border-red-200 flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 text-sm">{errors.numbers}</span>
              </div>
            )}

            {/* Grid de números */}
            <div className="flex-1 overflow-auto">
              <div className="grid grid-cols-8 gap-1">
                {filteredNumbers.slice(0, 200).map((num) => (
                  <div
                    key={num.number}
                    onClick={() => toggleNumber(num.number)}
                    className={`
                      aspect-square flex items-center justify-center rounded border text-xs font-medium transition-all cursor-pointer
                      ${
                        selectedNumbers.includes(num.number)
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                      }
                    `}
                  >
                    {num.number.toString().padStart(3, "0")}
                  </div>
                ))}
              </div>
              {filteredNumbers.length > 200 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  Mostrando 200 de {filteredNumbers.length} números disponibles
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isLoading || selectedNumbers.length === 0}
          >
            {isLoading ? "Reservando..." : `Reservar ${selectedNumbers.length} Número${selectedNumbers.length !== 1 ? 's' : ''}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 