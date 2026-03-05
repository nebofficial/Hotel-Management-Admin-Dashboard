'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Send } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  bills: any[]
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function SendToKitchen({ bills, kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [sending, setSending] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const pendingKOTs = kots.filter((kot) => kot.status === "Pending")

  const handleSendToKitchen = async (kotId: string) => {
    if (!user?.hotelId) return

    setSending(kotId)
    setError(null)
    try {
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
            status: "Preparing",
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to send to kitchen (HTTP ${res.status})`)
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to send to kitchen")
    } finally {
      setSending(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Pending KOTs
            </div>
            <div className="text-lg font-semibold">
              {pendingKOTs.length.toString().padStart(2, "0")}
            </div>
          </div>
          <Send className="h-8 w-8 opacity-80" />
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
            Send order items to kitchen section (Real-time)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {pendingKOTs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No pending KOTs. All orders have been sent to kitchen.
              </div>
            ) : (
              pendingKOTs.map((kot) => (
                <div
                  key={kot.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 font-mono">
                        {kot.kotNumber}
                      </span>
                      <Badge className="border text-[10px] bg-blue-100 text-blue-700 border-blue-200">
                        {kot.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Table {kot.tableNo} • {kot.items.length} items
                      {kot.section && ` • Section: ${kot.section}`}
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                    onClick={() => handleSendToKitchen(kot.id)}
                    disabled={sending === kot.id}
                  >
                    {sending === kot.id ? "Sending..." : "Send to kitchen"}
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
