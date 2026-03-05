'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Tag } from 'lucide-react'

export default function OfferSelector({ offers = [], selectedOffer, onSelect }) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-amber-50/80 to-yellow-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Offers & Combos
        </h3>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="space-y-1.5 max-h-32 overflow-y-auto">
          {offers.length === 0 ? (
            <p className="text-xs text-slate-500">No active offers</p>
          ) : (
            offers.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => onSelect?.(selectedOffer?.id === o.id ? null : o)}
                className={`w-full text-left p-2 rounded-lg border text-xs transition-colors ${
                  selectedOffer?.id === o.id
                    ? 'border-amber-500 bg-amber-100 text-amber-900'
                    : 'border-slate-200 bg-white hover:border-amber-300'
                }`}
              >
                <div className="font-medium">{o.name}</div>
                <div className="text-slate-500">
                  {o.discountType === 'Percentage' ? `${o.discountValue}% off` : `₹${o.discountValue} off`}
                </div>
              </button>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
