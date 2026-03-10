'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function CurrentStockReport({ currentStock = [], loading }) {
  const list = currentStock || []
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-sky-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800">Current Stock Report</CardTitle>
        <p className="text-[11px] text-slate-500">Real-time stock levels.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : list.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No stock data</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Item</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Category</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Qty</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Reorder</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 50).map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-100 hover:bg-sky-50/50">
                  <td className="py-2 px-3 font-medium">{row.itemName || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{row.category || '-'}</td>
                  <td className="py-2 px-3 text-right">{row.currentQuantity ?? 0}</td>
                  <td className="py-2 px-3 text-right">{row.reorderLevel ?? 0}</td>
                  <td className="py-2 px-3 text-center">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] ${row.stockStatus === 'Critical' ? 'bg-red-100 text-red-700' : row.stockStatus === 'Low' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{row.stockStatus || 'OK'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
