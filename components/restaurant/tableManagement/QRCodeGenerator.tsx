'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, QrCode } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function QRCodeGenerator({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [generating, setGenerating] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateQR = async (table: RestaurantTable) => {
    if (!user?.hotelId) return

    setGenerating(table.id)
    setError(null)
    try {
      // Generate QR code URL (using a simple QR code API or library)
      // For now, we'll store a placeholder URL
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
        `${window.location.origin}/menu?table=${table.tableNo}`,
      )}`

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${table.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ qrCode: qrUrl }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to generate QR code (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to generate QR code")
    } finally {
      setGenerating(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Tables with QR codes
            </div>
            <div className="text-lg font-semibold">
              {tables.filter((t) => t.qrCode).length} / {tables.length}
            </div>
          </div>
          <QrCode className="h-8 w-8 opacity-80" />
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
            QR code generation
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {tables.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tables to generate QR codes for.
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {table.tableNo}
                    </div>
                    {table.qrCode ? (
                      <div className="flex items-center gap-2 mt-1">
                        <img
                          src={table.qrCode}
                          alt={`QR for ${table.tableNo}`}
                          className="h-12 w-12 border border-slate-200 rounded"
                        />
                        <a
                          href={table.qrCode}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-emerald-600 hover:underline"
                        >
                          View QR code
                        </a>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">
                        No QR code generated
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleGenerateQR(table)}
                    disabled={generating === table.id}
                  >
                    {generating === table.id ? "Generating..." : table.qrCode ? "Regenerate" : "Generate"}
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
