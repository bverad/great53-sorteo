"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, User, Phone, Mail, FileText, Save, Loader2 } from "lucide-react"

interface CustomerData {
  name: string
  phone: string
  email?: string
  notes?: string
}

interface EditCustomerModalProps {
  isOpen: boolean
  onClose: () => void
  customerData: CustomerData
  number: number
  onSave: (data: CustomerData) => Promise<void>
}

export function EditCustomerModal({ isOpen, onClose, customerData, number, onSave }: EditCustomerModalProps) {
  const [formData, setFormData] = useState<CustomerData>(customerData)
  const [isSaving, setIsSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error("Error al guardar:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5 text-blue-600" />
              <span>Editar Cliente</span>
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">
            Número: <span className="font-mono font-medium">{number.toString().padStart(3, "0")}</span>
          </p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-500" />
                <span>Nombre completo *</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ingrese el nombre completo"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span>Teléfono *</span>
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="+56 9 1234 5678"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email" className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span>Email</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="cliente@ejemplo.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="notes" className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <span>Notas adicionales</span>
              </Label>
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Información adicional del cliente..."
                rows={3}
                className="mt-1 resize-none"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 