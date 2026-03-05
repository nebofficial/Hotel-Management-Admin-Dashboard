'use client'

import { useMemo, useState } from "react"
import type { BarOrder } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ShieldCheck } from "lucide-react"

interface Props {
  orders: BarOrder[]
  onUpdateOrder: (id: string, patch: Partial<BarOrder>) => Promise<any>
}

export default function AgeVerification({ orders, onUpdateOrder }: Props) {
  const [verifying, setVerifying] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const needs = useMemo(() => {
    return orders
      .filter((o) => o.items?.some((i) => i.isAlcohol))
      .filter((o) => !o.ageVerified)
  }, [orders])

  const verified = useMemo(() => {
    return orders
      .filter((o) => o.items?.some((i) => i.isAlcohol))
      .filter((o) => o.ageVerified)
      .slice(0, 10)
  }, [orders])

  const handleVerify = async (orderId: string) => {
    setError(null)
    setVerifying(orderId)
    try {
      await onUpdateOrder(orderId, { ageVerified: true })
    } catch (e: any) {
      setError(e?.message || "Failed to verify age")
    } finally {
      setVerifying(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-slate-900 to-slate-700 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Age Verification
            <Badge className="bg-white/15 text-white border-none">
              Compliance
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Confirm guest age for alcohol orders. Orders can be blocked from
          preparation until verified (policy-dependent).
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Pending verification ({needs.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {needs.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No pending age checks.
              </div>
            ) : (
              needs.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-slate-50/40 p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • {o.location}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.items
                        .filter((i) => i.isAlcohol)
                        .map((i) => `${i.quantity}x ${i.name}`)
                        .join(", ")}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={verifying === o.id}
                    className="bg-slate-900 hover:bg-slate-950"
                    onClick={() => handleVerify(o.id)}
                    title="Mark age verified"
                  >
                    Verify
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <CardHeader className="p-3 pb-2">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Recently verified
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 space-y-2">
            {verified.length === 0 ? (
              <div className="py-8 text-center text-sm text-slate-500">
                No verified orders yet.
              </div>
            ) : (
              verified.map((o) => (
                <div
                  key={o.id}
                  className="rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-slate-900 truncate">
                      {o.orderNumber || "—"} • {o.location}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {o.items
                        .filter((i) => i.isAlcohol)
                        .map((i) => i.name)
                        .slice(0, 2)
                        .join(", ")}
                      {o.items.filter((i) => i.isAlcohol).length > 2 ? "…" : ""}
                    </div>
                  </div>
                  <Badge className="border bg-emerald-100 text-emerald-700 border-emerald-200">
                    Verified
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

