import { Card, CardContent } from "@/components/ui/card"
import { Heart, Users, Gift } from "lucide-react"

export function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Sorteo "Great 53"</h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Un grupo humano comprometido con dar amor al universo. En apoyo a los niños de la Fundación COAR,
            organizamos este sorteo especial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Propósito Benéfico</h3>
              <p className="text-gray-600">
                Todos los fondos recaudados van directamente a apoyar a los niños de la Fundación COAR
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Comunidad Great 53</h3>
              <p className="text-gray-600">Un grupo comprometido con hacer la diferencia y dar amor al universo</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premio Especial</h3>
              <p className="text-gray-600">Una motocicleta nueva para el ganador del sorteo</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
