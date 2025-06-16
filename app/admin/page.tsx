import { Suspense } from "react"
import { AdminAuth } from "@/components/admin/admin-auth"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={<div className="flex justify-center p-8">Cargando...</div>}>
        <AdminAuth>
          <AdminDashboard />
        </AdminAuth>
      </Suspense>
    </div>
  )
}
