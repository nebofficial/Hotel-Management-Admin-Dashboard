'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function StockMovementReport({ data, loading }) {
  const d = data || {}
  const stockAdded = d.stockAdded ?? 0
  const stockUsed = d.stockUsed ?? 0
  const stockAdjustments = d.stockAdjustments ?? 0
  const movements = d.movements || []

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-amber-400/10 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-amber-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Stock Movement Report</CardTitle>
        <p className="text-[11px] text-slate-500">Stock in, out and adjustments.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="rounded-xl bg-emerald-50 p-3">
                <p className="text-[10px] uppercase text-slate-600">Stock Added</p>
                <p className="text-lg font-semibold text-emerald-600">{Number(stockAdded).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-red-50 p-3">
                <p className="text-[10px] uppercase text-slate-600">Stock Used</p>
                <p className="text-lg font-semibold text-red-600">{Number(stockUsed).toLocaleString()}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-3">
                <p className="text-[10px] uppercase text-slate-600">Adjustments</p>
                <p className="text-lg font-semibold text-amber-600">{stockAdjustments}</p>
              </div>
            </div>
            {movements.length > 0 && (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-amber-100/80">
                    <th className="text-left py-2 px-2">Item</th>
                    <th className="text-center py-2 px-2">Type</th>
                    <th className="text-right py-2 px-2">Qty</th>
                    <th className="text-center py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {movements.slice(0, 25).map((m, i) => (
                    <tr key={m.id || i} className="border-b border-slate-100">
                      <td className="py-1.5 px-2 truncate max-w-[120px]">{m.itemName}</td>
                      <td className="py-1.5 px-2 text-center">{m.movementType}</td>
                      <td className="py-1.5 px-2 text-right">{m.quantity}</td>
                      <td className="py-1.5 px-2 text-center text-slate-500">{m.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
