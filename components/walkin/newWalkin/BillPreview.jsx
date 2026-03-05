'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Receipt, Printer, FileText } from 'lucide-react'

export default function BillPreview({ walkin, pricing, onPrint }) {
  const w = walkin || {}
  const p = pricing || {}

  const formatCurrency = (val) => {
    const num = Number(val || 0)
    return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const formatDate = (d) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (!w.walkinNumber) {
    return (
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Receipt className="h-5 w-5" />
            Instant Bill Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
          <p className="text-white/70 text-center py-8">Complete check-in to generate bill</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-rose-600 via-red-500 to-pink-500 text-white">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <Receipt className="h-5 w-5" />
            Instant Bill
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onPrint}
            className="text-white hover:bg-white/20"
          >
            <Printer className="h-4 w-4 mr-1" />
            Print
          </Button>
        </div>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-white/70">Bill No:</span>
            <span className="font-mono font-semibold">{w.billNumber || '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Walk-in No:</span>
            <span className="font-mono">{w.walkinNumber}</span>
          </div>

          <Separator className="bg-white/20" />

          <div className="flex justify-between">
            <span className="text-white/70">Guest:</span>
            <span>{w.guestName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Room:</span>
            <span>{w.roomNumber} ({w.roomType})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Check-in:</span>
            <span>{formatDate(w.checkInTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Check-out:</span>
            <span>{formatDate(w.expectedCheckOut)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Nights:</span>
            <span>{w.numberOfNights || p.nights || 1}</span>
          </div>

          <Separator className="bg-white/20" />

          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-white/70">Room Charges:</span>
              <span>₹{formatCurrency((Number(p.baseRoomRate || w.baseRoomRate || 0)) * (p.nights || w.numberOfNights || 1))}</span>
            </div>
            {(p.occupancyCharge > 0 || w.occupancyCharge > 0) && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60">+ Occupancy:</span>
                <span>₹{formatCurrency(p.occupancyCharge || w.occupancyCharge)}</span>
              </div>
            )}
            {(p.weekendCharge > 0 || w.weekendCharge > 0) && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60">+ Weekend:</span>
                <span>₹{formatCurrency(p.weekendCharge || w.weekendCharge)}</span>
              </div>
            )}
            {(p.seasonalCharge > 0 || w.seasonalCharge > 0) && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60">+ Seasonal:</span>
                <span>₹{formatCurrency(p.seasonalCharge || w.seasonalCharge)}</span>
              </div>
            )}
            {(p.extraBedCharge > 0 || w.extraBedCharge > 0) && (
              <div className="flex justify-between text-xs">
                <span className="text-white/60">+ Extra Bed:</span>
                <span>₹{formatCurrency(p.extraBedCharge || w.extraBedCharge)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-white/70">Tax:</span>
              <span>₹{formatCurrency(p.taxAmount || w.taxAmount)}</span>
            </div>
          </div>

          <Separator className="bg-white/20" />

          <div className="flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>₹{formatCurrency(p.totalAmount || w.totalAmount)}</span>
          </div>
          <div className="flex justify-between text-green-200">
            <span>Paid:</span>
            <span>₹{formatCurrency(w.paidAmount || 0)}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Balance:</span>
            <span className={Number(w.balanceAmount || 0) > 0 ? 'text-yellow-200' : 'text-green-200'}>
              ₹{formatCurrency(w.balanceAmount || 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
