'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, XCircle } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function CancelItem({ kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [cancelling, setCancelling] = useState<{ kotId: string; itemIndex: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const cancellableKOTs = kots.filter((kot) => kot.status === "Pending" || kot.status === "Preparing")

  const handleCancelItem = async (kotId: string, itemIndex: number) => {
    if (!user?.hotelId || !confirm("Cancel this item from KOT?")) return

    const kot = kots.find((k) => k.id === kotId)
    if (!kot) return

    setSaving(true)
    setError(null)
    try {
      const updatedItems = kot.items.filter((_, idx) => idx !== itemIndex)
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/kitchen-kots/${kotId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: updatedItems,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to cancel item (HTTP ${res.status})`)
      }

      setCancelling(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to cancel item")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-red-500 to-rose-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Cancellable orders
            </div>
            <div className="text-lg font-semibold">
              {cancellableKOTs.length.toString().padStart(2, "0")}
            </div>
          </div>
          <XCircle className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Cancel specific item from KOT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {cancellableKOTs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No orders available for item cancellation. Only Pending or Preparing orders can have items cancelled.
              </div>
            ) : (
              cancellableKOTs.map((kot) => (
                <div key={kot.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-slate-900 font-mono">{kot.kotNumber}</span>
                    <Badge className="border text-[10px] bg-slate-100 text-slate-700 border-slate-200">
                      Table {kot.tableNo}
                    </Badge>
                  </div>
                  <div className="space-y-1.5">
                    {kot.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-1.5 rounded bg-white border border-slate-200">
                        <div className="text-xs text-slate-700">
                          {item.name} × {item.quantity}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-5 px-1.5 text-[10px] border-red-200 text-red-600"
                          onClick={() => handleCancelItem(kot.id, idx)}
                          disabled={saving}
                        >
                          Cancel
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
