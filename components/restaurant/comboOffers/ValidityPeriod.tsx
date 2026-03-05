'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import type { DiscountOffer, CouponCode } from "./ComboOffers"

interface Props {
  discounts: DiscountOffer[]
  coupons: CouponCode[]
  onRefresh: () => void
}

export default function ValidityPeriod({ discounts, coupons, onRefresh }: Props) {
  const offersWithValidity = [
    ...discounts.filter((d) => d.startDate && d.endDate),
    ...coupons.filter((c) => c.startDate && c.endDate),
  ]

  const now = new Date()
  const activeOffers = offersWithValidity.filter((offer) => {
    const start = offer.startDate ? new Date(offer.startDate) : null
    const end = offer.endDate ? new Date(offer.endDate) : null
    return (!start || start <= now) && (!end || end >= now)
  })

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">Active valid offers</div>
            <div className="text-lg font-semibold">{activeOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Calendar className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">Validity period management</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {offersWithValidity.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No offers with validity period configured. Set start/end dates when creating discounts or coupons.
              </div>
            ) : (
              offersWithValidity.map((offer) => {
                const start = offer.startDate ? new Date(offer.startDate) : null
                const end = offer.endDate ? new Date(offer.endDate) : null
                const isActive = (!start || start <= new Date()) && (!end || end >= new Date())
                return (
                  <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-900">{"name" in offer ? offer.name : offer.code}</span>
                        <Badge className={`border text-[10px] ${isActive ? "bg-green-100 text-green-700 border-green-200" : "bg-slate-100 text-slate-700 border-slate-200"}`}>
                          {isActive ? "Active" : "Expired"}
                        </Badge>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {offer.startDate} to {offer.endDate}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
