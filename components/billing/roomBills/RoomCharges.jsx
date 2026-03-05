'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function RoomCharges({
  pricePerNight = 0,
  nights = 1,
  roomSubtotal = 0,
  lateCheckoutCharge = 0,
  extraBedCharge = 0,
  onLateCheckoutChange,
  onExtraBedChange,
  readonly,
}) {
  const baseRent = pricePerNight * nights
  const total = baseRent + Number(lateCheckoutCharge) + Number(extraBedCharge)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Room Charges</CardTitle>
        <p className="text-blue-100 text-xs">Tariff, late checkout, extra bed</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/10 rounded-xl px-3 py-2">
            <span className="text-blue-100">Room Tariff</span>
            <p className="font-bold">₹{Number(pricePerNight).toLocaleString('en-IN')} × {nights} nights</p>
          </div>
          <div className="bg-white/10 rounded-xl px-3 py-2 text-right">
            <span className="text-blue-100">Subtotal</span>
            <p className="font-bold">₹{Number(baseRent).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-blue-100">Late Check-out (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={lateCheckoutCharge}
              onChange={(e) => onLateCheckoutChange?.(Number(e.target.value) || 0)}
              readOnly={readonly}
              className="mt-1 w-full rounded-lg bg-white/20 px-3 py-1.5 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs text-blue-100">Extra Bed (₹)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={extraBedCharge}
              onChange={(e) => onExtraBedChange?.(Number(e.target.value) || 0)}
              readOnly={readonly}
              className="mt-1 w-full rounded-lg bg-white/20 px-3 py-1.5 text-sm"
            />
          </div>
        </div>
        <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
          <span>Room Total</span>
          <span>₹{Number(total).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </CardContent>
    </Card>
  )
}
