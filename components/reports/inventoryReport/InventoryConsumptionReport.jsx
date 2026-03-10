'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function InventoryConsumptionReport({ consumption = [], byCategory = [], loading }) {
  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-orange-400/10 via-amber-400/5 to-orange-500/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-orange-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          Inventory Consumption Analysis
        </CardTitle>
        <p className="text-[11px] text-slate-500">Usage analytics. Helps control waste.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : consumption.length === 0 && byCategory.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No consumption data</p>
        ) : (
          <div className="space-y-4">
            {byCategory.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {byCategory.map((c, i) => (
                  <span key={i} className="px-2 py-1 rounded-lg bg-orange-100 text-orange-800 text-xs">
                    {c.name}: {c.value}
                  </span>
                ))}
              </div>
            )}
            <div className="overflow-x-auto max-h-48 overflow-y-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-orange-100/80">
                    <th className="text-left py-2 px-2">Item</th>
                    <th className="text-left py-2 px-2">Category</th>
                    <th className="text-right py-2 px-2">Qty Consumed</th>
                  </tr>
                </thead>
                <tbody>
                  {consumption.slice(0, 30).map((r, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1.5 px-2">{r.itemName}</td>
                      <td className="py-1.5 px-2 text-slate-600">{r.category}</td>
                      <td className="py-1.5 px-2 text-right font-medium">{r.quantityConsumed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
