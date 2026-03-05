'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import type { DiscountOffer, CouponCode } from "./ComboOffers"

interface Props {
  discounts: DiscountOffer[]
  coupons: CouponCode[]
  onRefresh: () => void
}

export default function MinimumOrderValue({ discounts, coupons, onRefresh }: Props) {
  const offersWithMinOrder = [
    ...discounts.filter((d) => d.minOrderValue),
    ...coupons.filter((c) => c.minOrderValue),
  ]

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-teal-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Offers with min order</div>
            <div className="text-lg font-semibold">{offersWithMinOrder.length.toString().padStart(2, "0")}</div>
          </div>
          <ShoppingCart className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">Minimum order value settings</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {offersWithMinOrder.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No offers with minimum order value configured. Set min order value when creating discounts or coupons.
              </div>
            ) : (
              offersWithMinOrder.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{"name" in offer ? offer.name : offer.code}</span>
                      <Badge className={`border text-[10px] ${"isActive" in offer && offer.isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                        {"isActive" in offer && offer.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Minimum order: ₹{"minOrderValue" in offer ? offer.minOrderValue : 0}
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
