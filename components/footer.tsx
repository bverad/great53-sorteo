import { Heart, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Great 53</h3>
                <p className="text-gray-400 text-sm">Sorteo Benéfico</p>
              </div>
            </div>
            <p className="text-gray-400">
              Un grupo humano comprometido con dar amor al universo, apoyando a los niños de la Fundación COAR.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Fundación COAR</h4>
            <p className="text-gray-400 mb-4">
              Organización dedicada al bienestar y desarrollo de los niños, brindando oportunidades y esperanza para un
              futuro mejor.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">+56957226277</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">bruno.zeroletf@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 Great 53. Todos los derechos reservados. Sorteo con fines benéficos para la Fundación COAR.
          </p>
        </div>
      </div>
    </footer>
  )
}
