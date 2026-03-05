'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"
import type { DiscountOffer } from "./ComboOffers"

interface Props {
  discounts: DiscountOffer[]
  onRefresh: () => void
}

export default function BuyOneGetOne({ discounts, onRefresh }: Props) {
  // BOGO offers are typically 50% off (buy 1 get 1 = 50% discount)
  const bogoOffers = discounts.filter((d) => 
    d.discountType === "Percentage" && d.discountValue === 50
  )

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 to-purple-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">BOGO offers</div>
            <div className="text-lg font-semibold">{bogoOffers.length.toString().padStart(2, "0")}</div>
          </div>
          <Gift className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">Buy 1 Get 1 offers</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {bogoOffers.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No BOGO offers configured. Create a discount offer with 50% discount to enable BOGO.
              </div>
            ) : (
              bogoOffers.map((offer) => (
                <div key={offer.id} className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">{offer.name}</span>
                      <Badge className="border text-[10px] bg-indigo-100 text-indigo-700 border-indigo-200">
                        BOGO
                      </Badge>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Buy 1 Get 1 Free • {offer.discountValue}% off
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
