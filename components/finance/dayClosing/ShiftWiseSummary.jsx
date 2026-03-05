'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ShiftWiseSummary({ shifts }) {
  if (!shifts?.length) return null

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-cyan-500 to-sky-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Shift-wise Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {shifts.map((s) => (
          <div key={s.id} className="bg-white/10 rounded-xl px-3 py-2 flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{s.label || s.id}</p>
              <p className="text-[10px] text-cyan-100 uppercase">{s.id}</p>
            </div>
            <div className="text-right space-y-0.5">
              <p>
                <span className="text-cyan-100 mr-1">Revenue:</span>
                <span className="font-semibold">
                  ${Number(s.revenue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </p>
              <p>
                <span className="text-cyan-100 mr-1">Cash:</span>
                <span className="font-semibold">
                  ${Number(s.cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

