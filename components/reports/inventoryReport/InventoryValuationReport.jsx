'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) =>
  typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0

export function InventoryValuationReport({ data, loading }) {
  const { totalStockValue = 0, valuation = [], byCategory = [] } = data || {}

  return (
    <Card className="rounded-2xl border-0 bg-gradient-to-br from-red-500/10 via-rose-500/5 to-red-600/10 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4 border-b border-red-200/50">
        <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          Inventory Valuation Report
        </CardTitle>
        <p className="text-[11px] text-slate-500">Total value of stock. Important for financial reporting.</p>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <p className="text-xs text-slate-500 py-6 text-center">Loading...</p>
        ) : (
          <>
            <div className="rounded-xl bg-red-50/80 p-3 mb-4">
              <p className="text-[10px] uppercase text-slate-600">Total Stock Value</p>
              <p className="text-xl font-bold text-red-600">₹{formatCurrency(totalStockValue)}</p>
            </div>
            {valuation.length > 0 && (
              <div className="overflow-x-auto max-h-56 overflow-y-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-red-100/80">
                      <th className="text-left py-2 px-2">Item</th>
                      <th className="text-left py-2 px-2">Category</th>
                      <th className="text-right py-2 px-2">Cost</th>
                      <th className="text-right py-2 px-2">Qty</th>
                      <th className="text-right py-2 px-2">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {valuation.slice(0, 40).map((v, i) => (
                      <tr key={i} className="border-b border-slate-100">
                        <td className="py-1.5 px-2 truncate max-w-[100px]">{v.itemName}</td>
                        <td className="py-1.5 px-2 text-slate-600">{v.category}</td>
                        <td className="py-1.5 px-2 text-right">₹{formatCurrency(v.itemCost)}</td>
                        <td className="py-1.5 px-2 text-right">{v.quantity}</td>
                        <td className="py-1.5 px-2 text-right font-semibold">₹{formatCurrency(v.totalStockValue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
