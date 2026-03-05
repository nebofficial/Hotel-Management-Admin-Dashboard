'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function RestaurantChargesPanel({ restaurantBills = [], ledger }) {
  const total = ledger?.restaurantChargesTotal || restaurantBills.reduce((s, b) => s + Number(b.totalAmount || b.grandTotal || 0), 0)

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-sky-50/80 to-cyan-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Restaurant & F&B</h3>
        <p className="text-xs text-slate-600">Linked restaurant bills for this stay</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Total F&B</span>
          <span className="font-semibold">₹{Number(total).toFixed(2)}</span>
        </div>
        <div className="max-h-32 overflow-y-auto border border-slate-200/70 rounded-md bg-white/70">
          {restaurantBills.length === 0 && (
            <p className="text-xs text-slate-500 px-3 py-2">No restaurant bills linked yet.</p>
          )}
          {restaurantBills.map((b) => (
            <div
              key={b.id}
              className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 last:border-b-0"
            >
              <div className="text-xs">
                <div className="font-medium text-slate-800">
                  {b.billNumber || b.id?.slice(0, 8)} – Table {b.tableNo}
                </div>
                <div className="text-slate-500">
                  {new Date(b.createdAt).toLocaleDateString()} • {b.guestName || 'Guest'}
                </div>
              </div>
              <div className="text-xs font-semibold text-slate-900">
                ₹{Number(b.totalAmount || b.grandTotal || 0).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

