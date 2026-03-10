'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatCurrency = (v) => (typeof v === 'number' ? v.toLocaleString('en-IN', { maximumFractionDigits: 0 }) : v ?? 0)

export function InventoryTable({ currentStock = [], loading }) {
  const list = currentStock || []
  if (list.length === 0 && !loading) return null

  return (
    <Card className="rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-slate-800">Detailed Inventory Data</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-x-auto">
        {loading ? (
          <p className="text-xs text-slate-500 py-8 text-center">Loading...</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Item</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Category</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Qty</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 50).map((row, i) => (
                <tr key={row.id || i} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 px-3 font-medium">{row.itemName || '-'}</td>
                  <td className="py-2 px-3 text-slate-600">{row.category || '-'}</td>
                  <td className="py-2 px-3 text-right">{row.currentQuantity ?? 0}</td>
                  <td className="py-2 px-3 text-right">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded ${row.stockStatus === 'Critical' ? 'bg-red-100' : row.stockStatus === 'Low' ? 'bg-amber-100' : 'bg-emerald-100'}`}>{row.stockStatus || 'OK'}</span>
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
