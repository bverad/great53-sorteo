"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Users, CreditCard, Phone, Mail, FileText } from "lucide-react"
import { useState } from "react"

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

interface MultipleNumbersParticipant {
  name: string
  phone: string
  email?: string
  notes?: string
  numbers: number[]
  totalNumbers: number
  paidNumbers: number
  pendingNumbers: number
  totalAmount: number
  paidAmount: number
  pendingAmount: number
}

interface MultipleNumbersParticipantsProps {
  numbers: SorteoNumber[]
}

export function MultipleNumbersParticipants({ numbers }: MultipleNumbersParticipantsProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Agrupar números por participante
  const participants = useMemo(() => {
    const reservedNumbers = numbers.filter(num => num.isReserved)
    const participantMap = new Map<string, MultipleNumbersParticipant>()

    reservedNumbers.forEach(num => {
      if (!num.customerName || !num.customerPhone) return

      const key = `${num.customerName}-${num.customerPhone}`
      
      if (!participantMap.has(key)) {
        participantMap.set(key, {
          name: num.customerName,
          phone: num.customerPhone,
          email: num.customerEmail,
          notes: num.customerNotes,
          numbers: [],
          totalNumbers: 0,
          paidNumbers: 0,
          pendingNumbers: 0,
          totalAmount: 0,
          paidAmount: 0,
          pendingAmount: 0,
        })
      }

      const participant = participantMap.get(key)!
      participant.numbers.push(num.number)
      participant.totalNumbers++
      participant.totalAmount += 3000

      if (num.paymentStatus === "paid") {
        participant.paidNumbers++
        participant.paidAmount += 3000
      } else if (num.paymentStatus === "pending") {
        participant.pendingNumbers++
        participant.pendingAmount += 3000
      }
    })

    // Filtrar solo participantes con múltiples números
    return Array.from(participantMap.values())
      .filter(participant => participant.totalNumbers > 1)
      .sort((a, b) => b.totalNumbers - a.totalNumbers)
  }, [numbers])

  // Filtrar participantes por término de búsqueda
  const filteredParticipants = useMemo(() => {
    if (!searchTerm) return participants
    
    return participants.filter(participant =>
      participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.phone.includes(searchTerm) ||
      (participant.email && participant.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [participants, searchTerm])

  // Estadísticas generales
  const stats = useMemo(() => {
    const totalParticipants = participants.length
    const totalNumbers = participants.reduce((sum, p) => sum + p.totalNumbers, 0)
    const totalPaid = participants.reduce((sum, p) => sum + p.paidNumbers, 0)
    const totalPending = participants.reduce((sum, p) => sum + p.pendingNumbers, 0)
    const totalAmount = participants.reduce((sum, p) => sum + p.totalAmount, 0)
    const totalPaidAmount = participants.reduce((sum, p) => sum + p.paidAmount, 0)
    const totalPendingAmount = participants.reduce((sum, p) => sum + p.pendingAmount, 0)

    return {
      totalParticipants,
      totalNumbers,
      totalPaid,
      totalPending,
      totalAmount,
      totalPaidAmount,
      totalPendingAmount,
    }
  }, [participants])

  return (
    <div className="space-y-6">
      {/* Título y estadísticas */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Participantes con Múltiples Números
        </h2>
        <p className="text-lg text-gray-600">
          Gestiona participantes que han reservado más de un número
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Participantes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalParticipants}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Con múltiples números
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Números</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalNumbers}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Reservados por estos participantes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monto Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  ${stats.totalAmount.toLocaleString()}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-sm text-gray-500 mt-2">
              <p>Pagado: ${stats.totalPaidAmount.toLocaleString()}</p>
              <p>Pendiente: ${stats.totalPendingAmount.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Búsqueda */}
      <Card>
        <CardHeader>
          <CardTitle>Buscar Participantes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, teléfono o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de participantes */}
      <Card>
        <CardHeader>
          <CardTitle>
            Participantes ({filteredParticipants.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredParticipants.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm ? "No se encontraron participantes con los filtros aplicados" : "No hay participantes con múltiples números"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredParticipants.map((participant, index) => (
                <div
                  key={`${participant.name}-${participant.phone}`}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Información del participante */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900">
                            {participant.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center space-x-1">
                              <Phone className="h-4 w-4" />
                              <span>{participant.phone}</span>
                            </div>
                            {participant.email && (
                              <div className="flex items-center space-x-1">
                                <Mail className="h-4 w-4" />
                                <span>{participant.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="default" className="mb-1">
                            {participant.totalNumbers} número{participant.totalNumbers !== 1 ? 's' : ''}
                          </Badge>
                          <p className="text-sm font-medium text-gray-900">
                            ${participant.totalAmount.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      {/* Números reservados */}
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Números reservados:</p>
                        <div className="flex flex-wrap gap-1">
                          {participant.numbers.sort((a, b) => a - b).map(num => (
                            <Badge key={num} variant="secondary" className="text-xs">
                              {num.toString().padStart(3, "0")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Estado de pagos */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-green-700">
                            {participant.paidNumbers} pagado{participant.paidNumbers !== 1 ? 's' : ''} 
                            (${participant.paidAmount.toLocaleString()})
                          </span>
                        </div>
                        {participant.pendingNumbers > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span className="text-yellow-700">
                              {participant.pendingNumbers} pendiente{participant.pendingNumbers !== 1 ? 's' : ''} 
                              (${participant.pendingAmount.toLocaleString()})
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Notas */}
                      {participant.notes && (
                        <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                          <div className="flex items-start space-x-1">
                            <FileText className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{participant.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 