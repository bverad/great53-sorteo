"use client"

import { Heart, Mail, Phone, Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  const openInstagram = () => {
    window.open('https://www.instagram.com/coar.cl', '_blank')
  }

  const openWhatsApp = () => {
    const message = "Hola! Quiero información sobre el sorteo Great 53."
    const whatsappUrl = `https://wa.me/56957226277?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

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
            <div className="flex items-center space-x-2 mb-4">
              <h4 className="text-lg font-semibold">Fundación COAR</h4>
              <button
                onClick={openInstagram}
                className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                title="Síguenos en Instagram"
              >
                <Instagram className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              Organización dedicada al bienestar y desarrollo de los niños, brindando oportunidades y esperanza para un
              futuro mejor.
            </p>
            <button
              onClick={openInstagram}
              className="text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors duration-200"
            >
              Conoce más en Instagram →
            </button>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-400">+56957226277</span>
                </div>
                <button
                  onClick={openWhatsApp}
                  className="bg-green-500 hover:bg-green-600 p-2 rounded-lg transition-all duration-200"
                  title="Abrir WhatsApp"
                >
                  <MessageCircle className="h-4 w-4 text-white" />
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-400">bruno.zeroleft@gmail.com</span>
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
