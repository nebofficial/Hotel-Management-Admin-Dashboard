'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function DepartmentWisePL({ data }) {
  const departments = data || []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Department-wise P&L</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        {departments.map((d) => (
          <div
            key={d.name}
            className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2"
          >
            <div>
              <p className="font-semibold text-sm">{d.name}</p>
              <p className="text-violet-100 text-[11px]">
                Income: ₹{Number(d.income || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[11px]">
                Profit:{' '}
                <span className="font-semibold">
                  ₹{Number(d.profit || 0).toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                </span>
              </p>
            </div>
          </div>
        ))}
        {departments.length === 0 && (
          <p className="text-violet-100 text-xs">No department data available.</p>
        )}
      </CardContent>
    </Card>
  )
}

