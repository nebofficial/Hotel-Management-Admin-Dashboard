'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AssetOverview({ assets }) {
  const total = Number(assets?.totalAssets || 0)
  const accounts = assets?.accounts || []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-green-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Asset Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="text-3xl font-bold">
          ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </div>
        <p className="text-emerald-100 text-xs">Total Assets</p>
        <div className="space-y-1 max-h-[180px] overflow-y-auto text-xs">
          {accounts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between bg-white/10 rounded-xl px-2 py-1"
            >
              <span className="text-emerald-100">{a.name}</span>
              <span className="font-semibold">
                ₹{Number(a.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </span>
            </div>
          ))}
          {accounts.length === 0 && (
            <p className="text-emerald-100 text-xs">No asset accounts configured.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

