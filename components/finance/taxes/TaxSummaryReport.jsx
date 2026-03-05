'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TaxSummaryReport({ summary }) {
  const totalInputTax = Number(summary?.totalInputTax || 0)
  const totalOutputTax = Number(summary?.totalOutputTax || 0)
  const net = Number(summary?.netGstPayable || 0)
  const byMonth = summary?.byMonth || []

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-rose-500 to-red-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Tax Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-rose-100">Input GST</p>
            <p className="font-semibold">
              ₹{totalInputTax.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/10 rounded-xl p-2">
            <p className="text-rose-100">Output GST</p>
            <p className="font-semibold">
              ₹{totalOutputTax.toFixed(2)}
            </p>
          </div>
          <div className={`rounded-xl p-2 ${net >= 0 ? 'bg-red-600' : 'bg-emerald-600'}`}>
            <p className="text-xs">{net >= 0 ? 'Net GST Payable' : 'Net GST Refundable'}</p>
            <p className="font-semibold">
              ₹{Math.abs(net).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="mt-1 space-y-1 max-h-[180px] overflow-y-auto text-xs">
          {byMonth.map((m) => (
            <div
              key={m.month}
              className="flex items-center justify-between bg-white/10 rounded-lg px-2 py-1"
            >
              <span className="text-rose-100">{m.month}</span>
              <span className="font-semibold">
                Out: ₹{Number(m.outputTax || 0).toFixed(0)} · In: ₹{Number(m.inputTax || 0).toFixed(0)}
              </span>
            </div>
          ))}
          {byMonth.length === 0 && (
            <p className="text-rose-100 text-xs">No tax data in selected range.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

