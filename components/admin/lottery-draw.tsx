"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Trophy, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  Gift, 
  Crown, 
  Medal, 
  Star,
  Zap,
  CheckCircle,
  Clock
} from "lucide-react"
import { useSorteoData } from "@/hooks/use-sorteo-data"

const premios = [
  { 
    lugar: "4to Lugar", 
    nombre: "Set de velas con color y aroma a elección",
    icon: Star,
    color: "from-gray-400 to-gray-600",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200"
  },
  { 
    lugar: "3er Lugar", 
    nombre: "3 sesiones de drenaje linfático + 1 limpieza facial",
    icon: Medal,
    color: "from-orange-400 to-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200"
  },
  { 
    lugar: "2do Lugar", 
    nombre: "Dos noches para dos personas en cabañas Araucanía Pura",
    icon: Crown,
    color: "from-purple-400 to-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200"
  },
  { 
    lugar: "1er Lugar", 
    nombre: "Motocicleta Marca BERA MOTORCYCLES, MODELO SBR, MOTOR 150CC",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200"
  },
]

export function LotteryDraw() {
  const { numbers } = useSorteoData()
  const [ganadores, setGanadores] = useState<any[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentDrawing, setCurrentDrawing] = useState<number | null>(null)
  const [alerta, setAlerta] = useState("")

  const paidNumbers = numbers.filter((num) => num.paymentStatus === "paid")
  const canDraw = paidNumbers.length >= 4
  const pool = paidNumbers.filter(
    (num) => !ganadores.some((g) => g.numero === num.number)
  )

  const sortearPremio = async (premioIndex: number) => {
    if (!canDraw) {
      setAlerta("Debes tener al menos 4 números pagados para sortear los premios.")
      return
    }
    if (ganadores.length !== premioIndex) return
    if (pool.length === 0) {
      setAlerta("No hay suficientes participantes para este premio.")
      return
    }

    setIsDrawing(true)
    setCurrentDrawing(premioIndex)

    // Animación de sorteo más larga para mayor dramatismo
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const randomIndex = Math.floor(Math.random() * pool.length)
    const ganador = pool[randomIndex]
    
    setGanadores((prev) => [
      ...prev,
      {
        premio: premios[premioIndex].lugar,
        descripcion: premios[premioIndex].nombre,
        numero: ganador.number,
        nombre: ganador.customerName || "Cliente",
        icon: premios[premioIndex].icon,
        color: premios[premioIndex].color,
      },
    ])
    
    setIsDrawing(false)
    setCurrentDrawing(null)
    setAlerta("")
  }

  return (
    <div className="space-y-8">
      {/* Header con estadísticas mejoradas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 mb-1">Números Pagados</p>
                <p className="text-3xl font-bold text-green-600">{paidNumbers.length}</p>
                <p className="text-xs text-green-600 mt-1">Participantes activos</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 mb-1">Premios Disponibles</p>
                <p className="text-3xl font-bold text-blue-600">4</p>
                <p className="text-xs text-blue-600 mt-1">Del 4° al 1° lugar</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Gift className="h-8 w-8 text-blue-600" />
            </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 mb-1">Total Recaudado</p>
                <p className="text-3xl font-bold text-purple-600">${(paidNumbers.length * 3000).toLocaleString("es-CL")}</p>
                <p className="text-xs text-purple-600 mt-1">CLP $3.000 por número</p>
          </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Sparkles className="h-8 w-8 text-purple-600" />
              </div>
          </div>
        </CardContent>
      </Card>
                  </div>

      {/* Alerta mejorada */}
      {alerta && (
        <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                </div>
              <p className="text-yellow-800 font-medium">{alerta}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sección de premios */}
      <Card className="bg-gradient-to-br from-slate-50 to-gray-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3 text-2xl">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg">
              <Trophy className="h-6 w-6 text-white" />
              </div>
            <span>Sorteo de Premios</span>
          </CardTitle>
          <p className="text-gray-600">Realiza el sorteo en orden del 4° al 1° lugar</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {premios.map((premio, idx) => {
              const IconComponent = premio.icon
              const isNextToDraw = ganadores.length === idx
              const isCompleted = ganadores[idx]
              const isDrawing = currentDrawing === idx
              
              return (
                <div 
                  key={premio.lugar} 
                  className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                    isCompleted 
                      ? `${premio.bgColor} ${premio.borderColor} shadow-lg` 
                      : isNextToDraw 
                        ? "bg-white border-blue-300 shadow-md" 
                        : "bg-gray-50 border-gray-200"
                  }`}
                >
                  {/* Indicador de estado */}
                  <div className="absolute -top-3 -right-3">
                    {isCompleted ? (
                      <div className="bg-green-500 text-white p-2 rounded-full">
                        <CheckCircle className="h-4 w-4" />
                      </div>
                    ) : isNextToDraw ? (
                      <div className="bg-blue-500 text-white p-2 rounded-full animate-pulse">
                        <Zap className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="bg-gray-400 text-white p-2 rounded-full">
                        <Clock className="h-4 w-4" />
                      </div>
                    )}
              </div>

                  <div className="flex items-center gap-6">
                    {/* Icono del premio */}
                    <div className={`p-4 rounded-full ${isCompleted ? `bg-gradient-to-r ${premio.color}` : "bg-gray-200"}`}>
                      <IconComponent className={`h-8 w-8 ${isCompleted ? "text-white" : "text-gray-500"}`} />
              </div>

                    {/* Información del premio */}
                    <div className="flex-1">
                      <h3 className={`text-xl font-bold ${isCompleted ? "text-gray-900" : "text-gray-700"}`}>
                        {premio.lugar}
                      </h3>
                      <p className={`text-sm ${isCompleted ? "text-gray-600" : "text-gray-500"}`}>
                        {premio.nombre}
                </p>
              </div>

                    {/* Botón de sorteo */}
                    <div className="flex flex-col items-end gap-2">
                      <Button
                        onClick={() => sortearPremio(idx)}
                        disabled={!isNextToDraw || !canDraw || isDrawing}
                        className={`min-w-[160px] ${
                          isNextToDraw && canDraw 
                            ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700" 
                            : ""
                        }`}
                        size="lg"
                      >
                        {isDrawing ? (
                          <>
                            <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                            Sorteando...
                          </>
                        ) : isCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completado
                          </>
                        ) : (
                          <>
                            <Trophy className="h-4 w-4 mr-2" />
                            Sortear {premio.lugar}
                          </>
                        )}
              </Button>
                    </div>
                  </div>

                  {/* Resultado del ganador */}
                  {isCompleted && (
                    <div className={`mt-4 p-4 rounded-lg bg-gradient-to-r ${premio.color} text-white`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-bold text-lg">
                            🎉 Ganador: {ganadores[idx].nombre}
                          </p>
                          <p className="text-sm opacity-90">
                            Número: <span className="font-mono font-bold">{ganadores[idx].numero.toString().padStart(3, "0")}</span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-75">Premio otorgado</p>
                          <p className="text-sm font-semibold">{premio.lugar}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
