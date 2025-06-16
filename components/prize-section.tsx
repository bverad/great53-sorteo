import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Star } from "lucide-react"

export function PrizeSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Información del Premio</h2>
          <p className="text-lg text-gray-600">Conoce todos los detalles del sorteo</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardTitle className="flex items-center space-x-2">
                <Trophy className="h-6 w-6" />
                <span>Premio Principal</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">Motocicleta Nueva</h3>
                  <p className="text-gray-600 mb-3">
                    Motocicleta 0 kilómetros, modelo reciente, completamente equipada y lista para entregar.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">0 KM</Badge>
                    <Badge variant="secondary">Modelo Reciente</Badge>
                    <Badge variant="secondary">Completamente Equipada</Badge>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Incluye:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Documentación completa</li>
                    <li>• Seguro por 1 año</li>
                    <li>• Kit de herramientas</li>
                    <li>• Manual del propietario</li>
                  </ul>
                </div>
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
                  <p className="text-2xl font-bold text-green-600">$50,000 COP</p>
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
                    El sorteo se realizará de manera pública y transparente, con la presencia de testigos y grabación
                    del evento.
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
