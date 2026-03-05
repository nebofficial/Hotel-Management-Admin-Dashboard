'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Printer } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function KOTPrinting({ kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [printing, setPrinting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const printableKOTs = kots.filter((kot) => kot.status !== "Cancelled" && kot.status !== "Completed")

  const handlePrint = async (kot: KitchenKOT) => {
    if (!user?.hotelId) return

    setPrinting(kot.id)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/kitchen-kots/${kot.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            printedAt: new Date().toISOString(),
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to print (HTTP ${res.status})`)
      }

      // Open print dialog
      const printWindow = window.open("", "_blank")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head><title>KOT ${kot.kotNumber}</title></head>
            <body style="font-family: monospace; padding: 20px; font-size: 12px;">
              <h2 style="text-align: center;">KITCHEN ORDER TICKET</h2>
              <hr>
              <p><strong>KOT #:</strong> ${kot.kotNumber}</p>
              <p><strong>Table:</strong> ${kot.tableNo}</p>
              ${kot.guestName ? `<p><strong>Guest:</strong> ${kot.guestName}</p>` : ""}
              ${kot.section ? `<p><strong>Section:</strong> ${kot.section}</p>` : ""}
              <hr>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="border-bottom: 1px solid #000;">
                    <th style="text-align: left;">Item</th>
                    <th style="text-align: right;">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  ${kot.items.map((item) => `
                    <tr>
                      <td>${item.name}${item.notes ? ` (${item.notes})` : ""}</td>
                      <td style="text-align: right;">${item.quantity}</td>
                    </tr>
                  `).join("")}
                </tbody>
              </table>
              <hr>
              <p style="text-align: center; font-size: 10px;">Printed: ${new Date().toLocaleString()}</p>
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to print KOT")
    } finally {
      setPrinting(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Printable KOTs
            </div>
            <div className="text-lg font-semibold">
              {printableKOTs.length.toString().padStart(2, "0")}
            </div>
          </div>
          <Printer className="h-8 w-8 opacity-80" />
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
            Print KOT (Thermal printer support)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {printableKOTs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No KOTs available for printing.
              </div>
            ) : (
              printableKOTs.map((kot) => (
                <div
                  key={kot.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900 font-mono">
                        {kot.kotNumber}
                      </span>
                      <Badge className={`border text-[10px] ${kot.status === "Pending" ? "bg-blue-100 text-blue-700 border-blue-200" : kot.status === "Preparing" ? "bg-purple-100 text-purple-700 border-purple-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                        {kot.status}
                      </Badge>
                      {kot.printCount > 0 && (
                        <Badge className="border text-[10px] bg-slate-100 text-slate-700 border-slate-200">
                          Printed {kot.printCount}x
                        </Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Table {kot.tableNo} • {kot.items.length} items
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => handlePrint(kot)}
                    disabled={printing === kot.id}
                  >
                    <Printer className="h-3 w-3 mr-1" />
                    {printing === kot.id ? "Printing..." : "Print"}
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
