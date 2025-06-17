"use client"

import { useState, useEffect } from "react"

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

  // Refrescar datos desde la API
  const fetchAndSetNumbers = () => {
    const initialNumbers: SorteoNumber[] = Array.from({ length: 1000 }, (_, i) => ({
      number: i + 1,
      isReserved: false,
    }))
    fetch("/api/reservas")
      .then((res) => {
        console.log("Respuesta de /api/reservas", res);
        return res.json();
      })
      .then((reservas) => {
        console.log("Datos de reservas recibidos", reservas);
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
      })
  }

  useEffect(() => {
    console.log("Intentando consultar /api/reservas");
    fetchAndSetNumbers();
  }, [])

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
    fetchAndSetNumbers()
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
    fetchAndSetNumbers()
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
      fetchAndSetNumbers();
    } else {
      // Liberar (hacer disponible)
      await fetch("/api/reservas", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ numero: numberToUpdate }),
      });
      fetchAndSetNumbers();
    }
  };

  const addDrawResult = (result: DrawResult) => {
    setDrawHistory((prev) => [result, ...prev])
  }

  return {
    numbers,
    drawHistory,
    getAvailableCount,
    getReservedCount,
    getStats,
    updatePaymentStatus,
    reserveNumber,
    updateReservationStatus,
    addDrawResult,
  }
}
