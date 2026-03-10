'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export function LowStockAlertReport({ lowStock = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-fuchsia-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-violet-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Low Stock Alert Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Items that need restocking.</p>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : lowStock.length === 0 ? (
          <p className="text-xs text-slate-500 py-8 text-center">No low stock items</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-violet-100/80 border-b border-violet-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Item Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Category</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Remaining</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Min Required</th>
              </tr>
            </thead>
            <tbody>
              {lowStock.map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-100 hover:bg-violet-50/50">
                  <td className="py-2 px-3 font-medium text-slate-800">{row.itemName || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{row.category || '-'}</td>
                  <td className="py-2 px-3 text-right font-semibold text-amber-600">{row.remainingQuantity ?? 0}</td>
                  <td className="py-2 px-3 text-right">{row.minimumRequiredLevel ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
