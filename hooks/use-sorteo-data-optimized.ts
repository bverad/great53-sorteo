"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export interface DrawResult {
  winningNumber: number
  winnerName: string
  drawDate: string
  totalParticipants: number
}

export interface SorteoNumber {
  number: number
  isReserved: boolean
  customerName?: string
  customerPhone?: string
  customerEmail?: string
  customerNotes?: string
  paymentStatus?: "pending" | "paid" | "cancelled"
  reservedDate?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface ApiResponse {
  data: SorteoNumber[]
  pagination: PaginationInfo
}

export function useSorteoDataOptimized() {
  const [numbers, setNumbers] = useState<SorteoNumber[]>([])
  const [drawHistory, setDrawHistory] = useState<DrawResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [lastFetch, setLastFetch] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cache de 30 segundos para evitar llamadas innecesarias
  const CACHE_DURATION = 30000

  // Refrescar datos desde la API con caché y parámetros
  const fetchAndSetNumbers = useCallback(async (
    force = false,
    params: {
      page?: number
      limit?: number
      search?: string
      status?: string
      payment?: string
    } = {}
  ) => {
    const now = Date.now()
    
    // Verificar caché solo si no hay parámetros específicos
    if (!force && Object.keys(params).length === 0 && now - lastFetch < CACHE_DURATION) {
      return
    }

    // Cancelar llamada anterior si existe
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Crear nuevo controlador de aborto
    abortControllerRef.current = new AbortController()

    try {
      setIsLoading(true)
      
      // Construir URL con parámetros
      const url = new URL('/api/reservas', window.location.origin)
      if (params.page) url.searchParams.set('page', params.page.toString())
      if (params.limit) url.searchParams.set('limit', params.limit.toString())
      if (params.search) url.searchParams.set('search', params.search)
      if (params.status) url.searchParams.set('status', params.status)
      if (params.payment) url.searchParams.set('payment', params.payment)

      const response = await fetch(url.toString(), {
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json();
      const result = Array.isArray(responseData) ? { data: responseData, pagination: { page: 1, limit: 1000, total: responseData.length, totalPages: 1, hasNext: false, hasPrev: false } } : responseData;
      
      // Crear array completo de 1000 números
      const allNumbers: SorteoNumber[] = Array.from({ length: 1000 }, (_, i) => ({
        number: i + 1,
        isReserved: false,
      }))

      // Marcar los números reservados
      result.data.forEach((reserva: any) => {
        const index = reserva.numero - 1
        if (index >= 0 && index < allNumbers.length) {
          allNumbers[index] = {
            ...allNumbers[index],
            isReserved: true,
            customerName: reserva.customerName,
            customerPhone: reserva.customerPhone,
            customerEmail: reserva.customerEmail,
            customerNotes: reserva.customerNotes,
            paymentStatus: reserva.paymentStatus,
            reservedDate: reserva.fecha,
          }
        }
      })
      
      setNumbers(allNumbers)
      setPagination(result.pagination)
      setLastFetch(now)
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        // La llamada fue cancelada, no hacer nada
        return
      }
      console.error("Error al cargar datos:", error)
    } finally {
      setIsLoading(false)
    }
  }, [lastFetch])

  useEffect(() => {
    fetchAndSetNumbers()
    
    // Cleanup al desmontar
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchAndSetNumbers])

  const getAvailableCount = () => {
    return numbers.filter((num) => !num.isReserved).length
  }

  const getReservedCount = () => {
    return numbers.filter((num) => num.isReserved).length
  }

  const getStats = () => {
    const reserved = numbers.filter((num) => num.isReserved).length
    const available = numbers.length - reserved
    const paid = numbers.filter((num) => num.paymentStatus === "paid").length
    const pending = numbers.filter((num) => num.paymentStatus === "pending").length

    return {
      total: numbers.length,
      available,
      reserved,
      paid,
      pending,
    }
  }

  const updatePaymentStatus = async (numberToUpdate: number, status: "pending" | "paid" | "cancelled") => {
    await fetch("/api/reservas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ numero: numberToUpdate, paymentStatus: status }),
    })
    fetchAndSetNumbers(true) // Forzar actualización
  }

  const reserveNumber = async (
    numberToReserve: number,
    customerData: {
      name: string
      phone: string
      email?: string
      notes?: string
    },
  ) => {
    await fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero: numberToReserve,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        customerNotes: customerData.notes,
        paymentStatus: "pending",
      }),
    })
    fetchAndSetNumbers(true) // Forzar actualización
  }

  const updateReservationStatus = async (numberToUpdate: number, isReserved: boolean, customerData?: any) => {
    if (isReserved) {
      // Reservar (igual que reserveNumber)
      await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numero: numberToUpdate,
          customerName: customerData?.name || "",
          customerPhone: customerData?.phone || "",
          customerEmail: customerData?.email || "",
          customerNotes: customerData?.notes || "",
          paymentStatus: "pending",
        }),
      });
      fetchAndSetNumbers(true); // Forzar actualización
    } else {
      // Liberar (hacer disponible)
      await fetch("/api/reservas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: numberToUpdate }),
      });
      fetchAndSetNumbers(true); // Forzar actualización
    }
  };

  const updateCustomerData = async (numberToUpdate: number, customerData: {
    name: string
    phone: string
    email?: string
    notes?: string
  }) => {
    await fetch("/api/reservas", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numero: numberToUpdate,
        customerName: customerData.name,
        customerPhone: customerData.phone,
        customerEmail: customerData.email,
        customerNotes: customerData.notes,
      }),
    });
    fetchAndSetNumbers(true); // Forzar actualización
  };

  const addDrawResult = (result: DrawResult) => {
    setDrawHistory((prev) => [result, ...prev])
  }

  return {
    numbers,
    drawHistory,
    isLoading,
    pagination,
    getAvailableCount,
    getReservedCount,
    getStats,
    updatePaymentStatus,
    reserveNumber,
    updateReservationStatus,
    updateCustomerData,
    addDrawResult,
    fetchAndSetNumbers,
  }
} 