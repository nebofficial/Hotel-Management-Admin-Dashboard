'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function CreditExpiryTracker({ expiringSoon = [], expired = [] }) {
  return (
    <Card className="border border-red-200 bg-gradient-to-br from-red-50/80 to-rose-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Credit Expiry Alerts</h3>
        <p className="text-xs text-slate-600">Credits expiring soon or already expired.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div>
          <p className="text-[11px] font-semibold text-amber-700 mb-1">Expiring Soon</p>
          {expiringSoon.length === 0 && (
            <p className="text-xs text-slate-500">No credits expiring soon.</p>
          )}
          {expiringSoon.map((c) => (
            <div key={c.id} className="flex justify-between text-xs text-amber-800">
              <span>{c.creditNoteNumber}</span>
              <span>{c.expiryDate}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-rose-200 pt-2">
          <p className="text-[11px] font-semibold text-rose-700 mb-1">Expired</p>
          {expired.length === 0 && (
            <p className="text-xs text-slate-500">No expired credits.</p>
          )}
          {expired.map((c) => (
            <div key={c.id} className="flex justify-between text-xs text-rose-800">
              <span>{c.creditNoteNumber}</span>
              <span>{c.expiryDate}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

