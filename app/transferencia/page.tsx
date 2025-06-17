"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CreditCard, Mail, Building } from "lucide-react";
import { useState } from "react";

const bankInfo = {
  company: "Corporación de amigos del hospital Roberto del río",
  rut: "72.210.600-8",
  bank: "Scotiabank",
  accountType: "Cuenta Corriente",
  accountNumber: "2600515-9",
  email: "coar@coar.cl",
};

export default function TransferenciaPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyAll = () => {
    const all = `Empresa: ${bankInfo.company}\nRUT: ${bankInfo.rut}\nBanco: ${bankInfo.bank}\nTipo de cuenta: ${bankInfo.accountType}\nNúmero de cuenta: ${bankInfo.accountNumber}\nEmail: ${bankInfo.email}`;
    copyToClipboard(all, "all");
  };

  return (
    <section className="py-16 bg-white min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-6 w-6" />
              <span>Datos Bancarios para Transferencia</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col gap-4">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">Empresa</span>
                  <p className="font-semibold text-gray-900">{bankInfo.company}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.company, "company")}> <Copy className="h-4 w-4" /> </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">RUT</span>
                  <p className="font-semibold text-gray-900">{bankInfo.rut}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.rut, "rut")}> <Copy className="h-4 w-4" /> </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">Banco</span>
                  <p className="font-semibold text-gray-900">{bankInfo.bank}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.bank, "bank")}> <Copy className="h-4 w-4" /> </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">Tipo de Cuenta</span>
                  <p className="font-semibold text-gray-900">{bankInfo.accountType}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountType, "type")}> <Copy className="h-4 w-4" /> </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">Número de Cuenta</span>
                  <p className="font-semibold text-gray-900">{bankInfo.accountNumber}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.accountNumber, "account")}> <Copy className="h-4 w-4" /> </Button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-600">Email Bancario</span>
                  <p className="font-semibold text-gray-900">{bankInfo.email}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(bankInfo.email, "email")}> <Copy className="h-4 w-4" /> </Button>
              </div>
            </div>
            <Button className="w-full mt-4" onClick={copyAll} variant="outline">
              <Copy className="h-4 w-4 mr-2" /> Copiar todos los datos
            </Button>
            {copied && (
              <p className="text-green-600 text-center text-sm mt-2">¡{copied === "all" ? "Todos los datos" : "Dato"} copiado!</p>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
} 