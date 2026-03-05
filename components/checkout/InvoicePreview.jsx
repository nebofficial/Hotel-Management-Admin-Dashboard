'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function InvoicePreview({ bill }) {
  if (!bill) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-lg">Invoice Preview</CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/80 text-sm text-center py-6">Generate the final bill to preview the invoice.</p>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-white text-lg">Invoice Preview</CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs">
        <ScrollArea className="h-64 pr-2">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-white/80">Bill Number</span>
              <span className="font-semibold text-sm">{bill.billNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Room</span>
              <span className="font-semibold text-sm">
                {bill.roomNumber} ({bill.roomType || ''})
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Nights</span>
              <span className="font-semibold text-sm">{bill.nights}</span>
            </div>

            <hr className="border-white/20 my-2" />

            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-white/80">Room Subtotal</span>
                <span>{formatCurrency(bill.roomSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Extras Subtotal</span>
                <span>{formatCurrency(bill.extrasSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Subtotal</span>
                <span>{formatCurrency(bill.subtotal)}</span>
              </div>
              {Number(bill.discountTotal || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Discount</span>
                  <span>-{formatCurrency(bill.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-white/80">Tax</span>
                <span>{formatCurrency(bill.taxTotal)}</span>
              </div>
              {Number(bill.serviceChargeAmount || 0) > 0 && (
                <div className="flex justify-between">
                  <span className="text-white/80">Service Charge</span>
                  <span>{formatCurrency(bill.serviceChargeAmount)}</span>
                </div>
              )}
            </div>

            <hr className="border-white/20 my-2" />

            <div className="flex justify-between font-semibold text-sm">
              <span>Total</span>
              <span>{formatCurrency(bill.grandTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/80">Advance / Deposit Adjusted</span>
              <span>{formatCurrency(bill.advanceAdjusted)}</span>
            </div>
            <div className="flex justify-between font-semibold text-sm">
              <span>Net Payable</span>
              <span>{formatCurrency(bill.netPayable)}</span>
            </div>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

