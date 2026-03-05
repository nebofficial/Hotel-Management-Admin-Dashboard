'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function BillSelector({ bills = [], onSearch, onSelect }) {
  const [billNumber, setBillNumber] = useState('')

  const handleSearch = () => {
    onSearch?.({ billNumber: billNumber.trim() || undefined })
  }

  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50/80 to-sky-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Select Bill to Refund</h3>
        <p className="text-xs text-slate-600">
          Search by bill number and choose the bill you want to refund.
        </p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Bill number"
            value={billNumber}
            onChange={(e) => setBillNumber(e.target.value)}
            className="h-8 text-xs"
          />
          <Button type="button" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="max-h-40 overflow-y-auto border border-slate-200/70 rounded-md bg-white/80 mt-2">
          {bills.length === 0 && (
            <p className="text-xs text-slate-500 px-3 py-2">No bills loaded. Search by bill number.</p>
          )}
          {bills.map((b) => {
            const refundable = Number(b.paidAmount || 0) - Number(b.refundedAmount || 0)
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => onSelect?.(b)}
                className="w-full text-left px-3 py-1.5 border-b border-slate-100 last:border-b-0 hover:bg-blue-50/70 text-xs"
              >
                <div className="font-medium text-slate-900">
                  {b.billNumber} • {b.type === 'ROOM' ? 'Room Bill' : 'Restaurant Bill'}
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{b.guestName}</span>
                  <span>
                    Total ₹{Number(b.totalAmount || 0).toFixed(2)} • Refundable ₹{refundable.toFixed(2)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

