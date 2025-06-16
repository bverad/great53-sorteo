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

  useEffect(() => {
    // Inicializar números del 1 al 1000
    const initialNumbers: SorteoNumber[] = Array.from({ length: 1000 }, (_, i) => ({
      number: i + 1,
      isReserved: false,
    }))

    // Simular algunos números reservados para demostración
    const reservedNumbers = [1, 7, 13, 21, 42, 77, 100, 123, 456, 789, 999]
    reservedNumbers.forEach((num) => {
      const index = num - 1
      if (initialNumbers[index]) {
        initialNumbers[index].isReserved = true
        initialNumbers[index].customerName = `Cliente ${num}`
        initialNumbers[index].paymentStatus = Math.random() > 0.5 ? "paid" : "pending"
        initialNumbers[index].reservedDate = new Date().toLocaleDateString()
      }
    })

    setNumbers(initialNumbers)
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

  const updatePaymentStatus = (numberToUpdate: number, status: "pending" | "paid" | "cancelled") => {
    setNumbers((prev) => prev.map((num) => (num.number === numberToUpdate ? { ...num, paymentStatus: status } : num)))
  }

  const reserveNumber = (
    numberToReserve: number,
    customerData: {
      name: string
      phone: string
      email?: string
      notes?: string
    },
  ) => {
    setNumbers((prev) =>
      prev.map((num) =>
        num.number === numberToReserve
          ? {
              ...num,
              isReserved: true,
              customerName: customerData.name,
              customerPhone: customerData.phone,
              customerEmail: customerData.email,
              customerNotes: customerData.notes,
              paymentStatus: "pending" as const,
              reservedDate: new Date().toLocaleDateString(),
            }
          : num,
      ),
    )
  }

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
    addDrawResult,
  }
}
