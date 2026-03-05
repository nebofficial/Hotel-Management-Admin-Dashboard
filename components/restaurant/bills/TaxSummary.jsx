'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TaxSummary({
  subtotal = 0,
  discountAmount = 0,
  taxableAmount = 0,
  cgst = 0,
  sgst = 0,
  serviceCharge = 0,
  roundOff = 0,
  totalAmount = 0,
}) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-orange-50/80 to-amber-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">GST & Summary</h3>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Subtotal</span>
          <span>₹{Number(subtotal).toFixed(2)}</span>
        </div>
        {discountAmount > 0 && (
          <div className="flex justify-between text-amber-700">
            <span>Discount</span>
            <span>-₹{Number(discountAmount).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-600">Taxable</span>
          <span>₹{Number(taxableAmount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>CGST</span>
          <span>₹{Number(cgst).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-slate-600">
          <span>SGST</span>
          <span>₹{Number(sgst).toFixed(2)}</span>
        </div>
        {serviceCharge > 0 && (
          <div className="flex justify-between text-slate-600">
            <span>Service Charge</span>
            <span>₹{Number(serviceCharge).toFixed(2)}</span>
          </div>
        )}
        {roundOff !== 0 && (
          <div className="flex justify-between text-slate-500 text-xs">
            <span>Round off</span>
            <span>₹{Number(roundOff).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
          <span>Total</span>
          <span className="text-orange-700">₹{Number(totalAmount).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
