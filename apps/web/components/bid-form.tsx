"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, DollarSign, FileText, Send } from "lucide-react"

interface Procurement {
  id: string
  title: string
  description: string
  buyer_name: string
  tender_value: number
  currency: string
  closing_date: string
}

interface BidFormProps {
  procurement: Procurement
  existingBid?: any
  mode?: "create" | "edit"
}

export default function BidForm({ procurement, existingBid, mode = "create" }: BidFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    bid_amount: existingBid?.bid_amount?.toString() || "",
    notes: existingBid?.notes || "",
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSubmit = async (e: React.FormEvent, submitType: "draft" | "submit" = "draft") => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const bidAmount = Number.parseFloat(formData.bid_amount)
      if (isNaN(bidAmount) || bidAmount <= 0) {
        setError("Por favor ingrese un monto válido")
        return
      }

      const payload = {
        procurement_id: procurement.id,
        bid_amount: bidAmount,
        notes: formData.notes,
        status: submitType === "submit" ? "submitted" : "draft",
      }

      const url = mode === "edit" ? `/api/bids/${existingBid.id}` : "/api/bids"
      const method = mode === "edit" ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al procesar la oferta")
        return
      }

      setSuccess(
        submitType === "submit"
          ? "Oferta enviada exitosamente"
          : mode === "edit"
            ? "Oferta actualizada como borrador"
            : "Oferta guardada como borrador",
      )

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/bids")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setError("Error de conexión. Por favor intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const canSubmit = existingBid?.status === "draft" || mode === "create"

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Procurement Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información del Proceso</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-900">{procurement.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{procurement.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Entidad:</span>
              <p className="text-gray-600">{procurement.buyer_name}</p>
            </div>
            <div>
              <span className="font-medium">Valor estimado:</span>
              <p className="text-gray-600">{formatCurrency(procurement.tender_value, procurement.currency)}</p>
            </div>
            <div>
              <span className="font-medium">Fecha de cierre:</span>
              <p className="text-gray-600">
                {new Date(procurement.closing_date).toLocaleDateString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bid Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {mode === "edit" ? "Editar Oferta" : "Crear Oferta"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleSubmit(e, "draft")} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="bid_amount" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Monto de la Oferta (COP)
              </Label>
              <Input
                id="bid_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="Ingrese el monto de su oferta"
                value={formData.bid_amount}
                onChange={(e) => setFormData({ ...formData, bid_amount: e.target.value })}
                required
                disabled={!canSubmit}
                className="text-lg font-medium"
              />
              <p className="text-sm text-gray-600">
                Valor estimado del proceso: {formatCurrency(procurement.tender_value, procurement.currency)}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas y Observaciones (Opcional)</Label>
              <Textarea
                id="notes"
                placeholder="Agregue cualquier información adicional sobre su oferta..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                disabled={!canSubmit}
              />
            </div>

            {canSubmit && (
              <div className="flex gap-4 pt-4">
                <Button type="submit" variant="outline" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Guardar Borrador
                </Button>
                <Button
                  type="button"
                  onClick={(e) => handleSubmit(e, "submit")}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                  Enviar Oferta
                </Button>
              </div>
            )}

            {!canSubmit && (
              <Alert>
                <AlertDescription>
                  Esta oferta ya ha sido enviada y no puede ser modificada. Estado actual: {existingBid?.status}
                </AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
