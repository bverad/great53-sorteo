import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Star, Gift } from "lucide-react"

export function PrizeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premios del Sorteo</h2>
          <p className="text-lg text-gray-600">¡Conoce todos los premios y detalles del sorteo!</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Gift className="h-6 w-6" />
                <span>Premios</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                <img src="/premios/1er-lugar.jpg" alt="Motocicleta BERA" className="w-80 h-80 object-cover object-center rounded-lg mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">1er Lugar</h3>
                <p className="text-gray-600 mb-2">Motocicleta Marca BERA MOTORCYCLES, MODELO SBR, MOTOR 150CC.<br/>*El costo de la documentación del vehículo va por cuenta del ganador.</p>
                <p className="text-sm text-gray-600">
                  Patrocinador: <a href="https://instagram.com/berasantiagocl" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@berasantiagocl</a>
                </p>
                  </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <img src="/premios/2do-lugar.jpg" alt="Cabañas Araucanía Pura" className="w-80 h-80 object-cover object-center rounded-lg mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">2do Lugar</h3>
                <p className="text-gray-600 mb-2">Dos noches para dos personas en cabañas Araucanía Pura.</p>
                <p className="text-sm text-gray-600">
                  Patrocinador: <a href="https://instagram.com/araucaniapura" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@araucaniapura</a>
                </p>
                </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <img src="/premios/3er-lugar.jpg" alt="Metanoia Relax" className="w-80 h-80 object-cover object-center rounded-lg mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">3er Lugar</h3>
                <p className="text-gray-600 mb-2">3 sesiones de drenaje linfático + 1 limpieza facial.</p>
                <p className="text-sm text-gray-600">
                  Patrocinador: <a href="https://instagram.com/metanoia_relax" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@metanoia_relax</a>
                </p>
                </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <img src="/premios/4to-lugar.jpg" alt="Set de velas Lumisenciia" className="w-80 h-80 object-cover object-center rounded-lg mx-auto mb-2" />
                <h3 className="font-semibold text-lg text-gray-900 mb-2">4to Lugar</h3>
                <p className="text-gray-600 mb-2">Set de velas con color y aroma a elección.</p>
                <p className="text-sm text-gray-600">
                  Patrocinador: <a href="https://instagram.com/lumisenciia" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@lumisenciia</a>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-6 w-6" />
                <span>Detalles del Sorteo</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Números Disponibles</h3>
                  <p className="text-2xl font-bold text-blue-600">1,000 números</p>
                  <p className="text-sm text-gray-600">Del 001 al 1000</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Valor por Número</h3>
                  <p className="text-2xl font-bold text-green-600">$3,000 CLP</p>
                  <p className="text-sm text-gray-600">Pago único por número</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fecha del Sorteo</h3>
                  <p className="text-lg font-medium text-gray-900">Por definir</p>
                  <p className="text-sm text-gray-600">Se anunciará cuando se vendan todos los números</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-gray-900">Transparencia Total</h4>
                  </div>
                  <p className="text-sm text-gray-600">
                    El sorteo se realizará de manera pública y transparente, con la presencia de testigos y grabación del evento.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
