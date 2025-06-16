"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Dice1, Trophy, Users, Sparkles, History, AlertTriangle } from "lucide-react"
import { useSorteoData } from "@/hooks/use-sorteo-data"

interface DrawResult {
  winningNumber: number
  winnerName: string
  drawDate: string
  totalParticipants: number
}

export function LotteryDraw() {
  const { numbers, addDrawResult, drawHistory } = useSorteoData()
  const [isDrawing, setIsDrawing] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [currentResult, setCurrentResult] = useState<DrawResult | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const paidNumbers = numbers.filter((num) => num.paymentStatus === "paid")
  const canDraw = paidNumbers.length > 0

  const performDraw = async () => {
    if (!canDraw) return

    setIsDrawing(true)

    // Simular animación de sorteo
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Seleccionar número ganador aleatoriamente
    const randomIndex = Math.floor(Math.random() * paidNumbers.length)
    const winningNumber = paidNumbers[randomIndex]

    const result: DrawResult = {
      winningNumber: winningNumber.number,
      winnerName: winningNumber.customerName || "Cliente",
      drawDate: new Date().toLocaleString(),
      totalParticipants: paidNumbers.length,
    }

    setCurrentResult(result)
    addDrawResult(result)
    setIsDrawing(false)
    setShowResult(true)
  }

  return (
    <div className="space-y-6">
      {/* Información del sorteo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Dice1 className="h-6 w-6 text-purple-600" />
            <span>Realizar Sorteo</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{paidNumbers.length}</p>
              <p className="text-sm text-gray-600">Números Pagados</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Trophy className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">1</p>
              <p className="text-sm text-gray-600">Motocicleta</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">${(paidNumbers.length * 50000).toLocaleString()}</p>
              <p className="text-sm text-gray-600">Recaudado</p>
            </div>
          </div>

          {!canDraw && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-yellow-800 font-medium">No hay números pagados para realizar el sorteo</p>
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={performDraw} disabled={!canDraw || isDrawing} className="flex-1" size="lg">
              {isDrawing ? (
                <>
                  <Sparkles className="h-5 w-5 mr-2 animate-spin" />
                  Realizando Sorteo...
                </>
              ) : (
                <>
                  <Dice1 className="h-5 w-5 mr-2" />
                  Realizar Sorteo
                </>
              )}
            </Button>

            <Button variant="outline" onClick={() => setShowHistory(true)} disabled={drawHistory.length === 0}>
              <History className="h-5 w-5 mr-2" />
              Historial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de participantes */}
      {paidNumbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Participantes del Sorteo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
              {paidNumbers.map((num) => (
                <div key={num.number} className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-green-700">{num.number.toString().padStart(3, "0")}</span>
                    <Badge variant="default" className="bg-green-600">
                      Pagado
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{num.customerName}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de resultado */}
      <Dialog open={showResult} onOpenChange={setShowResult}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-yellow-600" />
              </div>
              ¡Tenemos Ganador!
            </DialogTitle>
          </DialogHeader>

          {currentResult && (
            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-lg">
                <p className="text-sm opacity-90 mb-2">Número Ganador</p>
                <p className="text-4xl font-bold">{currentResult.winningNumber.toString().padStart(3, "0")}</p>
              </div>

              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-900">🎉 {currentResult.winnerName}</p>
                <p className="text-sm text-gray-600">Sorteo realizado el {currentResult.drawDate}</p>
                <p className="text-sm text-gray-600">Total de participantes: {currentResult.totalParticipants}</p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-800">
                  El ganador será contactado para coordinar la entrega del premio.
                </p>
              </div>

              <Button onClick={() => setShowResult(false)} className="w-full">
                Cerrar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de historial */}
      <Dialog open={showHistory} onOpenChange={setShowHistory}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <History className="h-5 w-5" />
              <span>Historial de Sorteos</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {drawHistory.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No hay sorteos realizados</p>
            ) : (
              drawHistory.map((draw, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold">Número {draw.winningNumber.toString().padStart(3, "0")}</p>
                      <p className="text-sm text-gray-600">{draw.winnerName}</p>
                    </div>
                    <Badge variant="outline">{draw.totalParticipants} participantes</Badge>
                  </div>
                  <p className="text-xs text-gray-500">{draw.drawDate}</p>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
