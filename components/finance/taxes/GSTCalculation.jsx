'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function GSTCalculation({ defaultRate }) {
  const [baseAmount, setBaseAmount] = useState(1000)
  const [inclusive, setInclusive] = useState(false)
  const [rate, setRate] = useState(defaultRate ?? 18)

  useEffect(() => {
    setRate(defaultRate ?? 18)
  }, [defaultRate])

  const amt = Number(baseAmount || 0)
  const r = Number(rate || 0)
  const tax = inclusive ? (amt - amt / (1 + r / 100)) : (amt * r) / 100
  const total = inclusive ? amt : amt + tax

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-blue-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">GST Calculation Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-sky-50">Base Amount</Label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={baseAmount}
              onChange={(e) => setBaseAmount(Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm text-sky-900"
            />
          </div>
          <div>
            <Label className="text-xs text-sky-50">GST %</Label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value || 0))}
              className="mt-1 w-full rounded-xl border border-sky-200 px-3 py-2 text-sm text-sky-900"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-sky-50">Mode:</span>
          <button
            type="button"
            onClick={() => setInclusive(false)}
            className={`px-2 py-1 rounded-full ${!inclusive ? 'bg-white text-sky-700' : 'bg-white/10 text-sky-100'}`}
          >
            Exclusive
          </button>
          <button
            type="button"
            onClick={() => setInclusive(true)}
            className={`px-2 py-1 rounded-full ${inclusive ? 'bg-white text-sky-700' : 'bg-white/10 text-sky-100'}`}
          >
            Inclusive
          </button>
        </div>
        <div className="bg-white/10 rounded-xl p-2 text-xs space-y-1">
          <p>
            <span className="text-sky-100 mr-1">Tax Amount:</span>
            <span className="font-semibold">
              ${tax.toFixed(2)}
            </span>
          </p>
          <p>
            <span className="text-sky-100 mr-1">Total:</span>
            <span className="font-semibold">
              ${total.toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

