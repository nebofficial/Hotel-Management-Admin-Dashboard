'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Hash } from 'lucide-react'

export default function GuestBillingRecords({ list, onSelect }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-green-900 text-base flex items-center gap-2">
          <User className="h-5 w-5" />
          Guest Billing Records
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {(list || []).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect?.(item)}
              className="w-full text-left p-3 rounded-xl bg-white/80 hover:bg-white border border-green-100 transition-all"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.guestName}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Hash className="h-3 w-3" /> {item.roomNumber} · {item.bookingNumber}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-gray-900">${Number(item.totalAmount || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'Paid' ? 'bg-green-100 text-green-700' : item.status === 'Overdue' ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-amber-100 text-amber-700'}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            </button>
          ))}
          {(!list || list.length === 0) && <p className="text-sm text-gray-500 py-4 text-center">No billing records</p>}
        </div>
      </CardContent>
    </Card>
  )
}
