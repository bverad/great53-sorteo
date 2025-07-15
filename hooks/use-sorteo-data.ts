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

export function useSorteoData() {
  const [numbers, setNumbers] = useState<SorteoNumber[]>([])
  const [drawHistory, setDrawHistory] = useState<DrawResult[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [lastFetch, setLastFetch] = useState<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cache de 30 segundos para evitar llamadas innecesarias
  const CACHE_DURATION = 30000

  // Refrescar datos desde la API con caché
  const fetchAndSetNumbers = useCallback(async (force = false) => {
    const now = Date.now()
    
    // Verificar caché
    if (!force && now - lastFetch < CACHE_DURATION) {
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
      
    const initialNumbers: SorteoNumber[] = Array.from({ length: 1000 }, (_, i) => ({
      number: i + 1,
      isReserved: false,
    }))

      const response = await fetch("/api/reservas", {
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const responseData = await response.json();
      const reservas = Array.isArray(responseData) ? responseData : responseData.data;
      
      const merged = initialNumbers.map((num) => {
        const reserva = reservas.find((r: any) => r.numero === num.number)
        if (reserva) {
          return {
            ...num,
            isReserved: true,
            customerName: reserva.customerName,
            customerPhone: reserva.customerPhone,
            customerEmail: reserva.customerEmail,
            customerNotes: reserva.customerNotes,
            paymentStatus: reserva.paymentStatus,
            reservedDate: reserva.fecha,
          }
        }
        return num
      })
      
      setNumbers(merged)
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

  const reserveMultipleNumbers = async (
    numbersToReserve: number[],
    customerData: {
      name: string
      phone: string
      email?: string
      notes?: string
    },
  ) => {
    const response = await fetch("/api/reservas/multiple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        numbers: numbersToReserve,
        name: customerData.name,
        phone: customerData.phone,
        email: customerData.email,
        notes: customerData.notes,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Error al reservar números')
    }

    fetchAndSetNumbers(true) // Forzar actualización
    return response.json()
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
    getAvailableCount,
    getReservedCount,
    getStats,
    updatePaymentStatus,
    reserveNumber,
    reserveMultipleNumbers,
    updateReservationStatus,
    updateCustomerData,
    addDrawResult,
  }
}
