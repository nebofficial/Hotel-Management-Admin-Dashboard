'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

export default function AutoApplyOffer({ discounts, onRefresh }: Props) {
  const autoApplyOffers = discounts.filter((d) => d.autoApply && d.isActive)

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-yellow-500 to-amber-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Auto-apply offers</div>
            <div className="text-lg font-semibold">{autoApplyOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Zap className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">Automatically apply eligible offers</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {autoApplyOffers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No auto-apply offers configured. Enable "Auto-apply" when creating discount offers.
              </div>
            ) : (
              autoApplyOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{offer.name}</span>
                      <Badge className="border text-[10px] bg-yellow-100 text-yellow-700 border-yellow-200">
                        Auto-apply
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {offer.discountType === "Percentage" ? `${offer.discountValue}%` : `₹${offer.discountValue}`} off
                      {offer.minOrderValue && ` • Min order: ₹${offer.minOrderValue}`}
                    </div>
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
