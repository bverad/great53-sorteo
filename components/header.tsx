import Link from "next/link"
import { Heart, Shield } from "lucide-react"

export function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Great 53</h1>
              <p className="text-sm text-gray-600">Sorteo Benéfico</p>
            </div>
          </div>
          <Link
            href="/admin"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span className="text-sm font-medium">Administración</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
