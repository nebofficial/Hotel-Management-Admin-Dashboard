'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Calculator, TrendingUp, Sun, Snowflake, Bed } from 'lucide-react'

export default function RateCalculationPanel({ pricing, extraBed, onExtraBedChange }) {
  const p = pricing || {}

  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Calculator className="h-5 w-5" />
          Auto Rate Calculation
        </CardTitle>
        <p className="text-white/80 text-sm">Dynamic pricing with occupancy & seasonal adjustments</p>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Bed className="h-4 w-4 text-white/70" />
              <span className="text-white/90">Base Room Rate</span>
            </div>
            <span className="font-semibold">₹{formatCurrency(p.baseRoomRate)} × {p.nights || 1} nights</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white/70" />
              <span className="text-white/90">Occupancy Adjustment</span>
            </div>
            <span className={p.occupancyCharge > 0 ? 'text-orange-200' : ''}>
              +₹{formatCurrency(p.occupancyCharge)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-white/70" />
              <span className="text-white/90">Weekend Surcharge</span>
            </div>
            <span className={p.weekendCharge > 0 ? 'text-orange-200' : ''}>
              +₹{formatCurrency(p.weekendCharge)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Snowflake className="h-4 w-4 text-white/70" />
              <span className="text-white/90">Seasonal Pricing</span>
            </div>
            <span className={p.seasonalCharge > 0 ? 'text-orange-200' : ''}>
              +₹{formatCurrency(p.seasonalCharge)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <div className="flex items-center gap-2">
              <Checkbox
                id="extraBed"
                checked={extraBed}
                onCheckedChange={onExtraBedChange}
                className="border-white data-[state=checked]:bg-white data-[state=checked]:text-amber-600"
              />
              <Label htmlFor="extraBed" className="text-white/90 cursor-pointer">
                Extra Bed (₹500/night)
              </Label>
            </div>
            <span className={p.extraBedCharge > 0 ? 'text-orange-200' : ''}>
              +₹{formatCurrency(p.extraBedCharge)}
            </span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <span className="text-white/90">Subtotal</span>
            <span className="font-medium">₹{formatCurrency(p.subtotal)}</span>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-white/20">
            <span className="text-white/90">Tax ({((p.taxRate || 0.12) * 100).toFixed(0)}% GST)</span>
            <span>+₹{formatCurrency(p.taxAmount)}</span>
          </div>

          <div className="flex items-center justify-between py-3 bg-white/20 rounded-lg px-3 mt-2">
            <span className="font-bold text-lg">Total Amount</span>
            <span className="font-bold text-2xl">₹{formatCurrency(p.totalAmount)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
