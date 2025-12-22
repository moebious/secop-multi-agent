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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Star, CheckCircle } from "lucide-react"

interface BidEvaluationFormProps {
  bid: any
}

export default function BidEvaluationForm({ bid }: BidEvaluationFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [formData, setFormData] = useState({
    technical_score: bid.technical_score?.toString() || "",
    financial_score: bid.financial_score?.toString() || "",
    status: bid.status || "submitted",
    evaluation_notes: "",
  })

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTotalScore = () => {
    const technical = Number.parseFloat(formData.technical_score)
    const financial = Number.parseFloat(formData.financial_score)
    if (!isNaN(technical) && !isNaN(financial)) {
      return ((technical + financial) / 2).toFixed(1)
    }
    return "N/A"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const technicalScore = Number.parseFloat(formData.technical_score)
      const financialScore = Number.parseFloat(formData.financial_score)

      if (isNaN(technicalScore) || technicalScore < 0 || technicalScore > 100) {
        setError("La puntuación técnica debe estar entre 0 y 100")
        return
      }

      if (isNaN(financialScore) || financialScore < 0 || financialScore > 100) {
        setError("La puntuación financiera debe estar entre 0 y 100")
        return
      }

      const payload = {
        technical_score: technicalScore,
        financial_score: financialScore,
        status: formData.status,
        evaluation_notes: formData.evaluation_notes,
      }

      const response = await fetch(`/api/bids/${bid.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Error al evaluar la oferta")
        return
      }

      setSuccess("Evaluación guardada exitosamente")

      // Redirect after success
      setTimeout(() => {
        router.push("/dashboard/admin/bids")
      }, 2000)
    } catch (error) {
      console.error("Error:", error)
      setError("Error de conexión. Por favor intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Bid Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Información de la Oferta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="font-medium text-gray-700">Proceso:</span>
              <p className="text-gray-900">{bid.procurement?.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Oferente:</span>
              <p className="text-gray-900">{bid.bidder?.full_name}</p>
              <p className="text-sm text-gray-600">{bid.bidder?.company_name}</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Monto Ofertado:</span>
              <p className="text-lg font-semibold text-blue-600">
                {formatCurrency(bid.bid_amount, bid.procurement?.currency || "COP")}
              </p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Valor Estimado:</span>
              <p className="text-gray-900">
                {formatCurrency(bid.procurement?.tender_value, bid.procurement?.currency || "COP")}
              </p>
            </div>
          </div>

          {bid.notes && (
            <div>
              <span className="font-medium text-gray-700">Notas del Oferente:</span>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg mt-1">{bid.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Evaluation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Evaluación de la Oferta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="technical_score">Puntuación Técnica (0-100)</Label>
                <Input
                  id="technical_score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Ej: 85.5"
                  value={formData.technical_score}
                  onChange={(e) => setFormData({ ...formData, technical_score: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-600">Evalúa aspectos técnicos, experiencia, metodología</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="financial_score">Puntuación Financiera (0-100)</Label>
                <Input
                  id="financial_score"
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  placeholder="Ej: 92.0"
                  value={formData.financial_score}
                  onChange={(e) => setFormData({ ...formData, financial_score: e.target.value })}
                  required
                />
                <p className="text-sm text-gray-600">Evalúa competitividad del precio, valor por dinero</p>
              </div>
            </div>

            {/* Total Score Display */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">Puntuación Total:</span>
                <span className="text-2xl font-bold text-blue-600">{calculateTotalScore()}</span>
              </div>
              <p className="text-sm text-blue-700 mt-1">Promedio de puntuación técnica y financiera</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado de la Oferta</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="submitted">Enviada</SelectItem>
                  <SelectItem value="under_review">En Revisión</SelectItem>
                  <SelectItem value="accepted">Aceptada</SelectItem>
                  <SelectItem value="rejected">Rechazada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evaluation_notes">Notas de Evaluación (Opcional)</Label>
              <Textarea
                id="evaluation_notes"
                placeholder="Agregue comentarios sobre la evaluación, fortalezas, debilidades, recomendaciones..."
                value={formData.evaluation_notes}
                onChange={(e) => setFormData({ ...formData, evaluation_notes: e.target.value })}
                rows={4}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Guardar Evaluación
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
