'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MODE_LABELS = {
  cash: 'Cash',
  bank_transfer: 'Bank Transfer',
  upi: 'UPI',
  card: 'Card',
  credit_card: 'Card',
  debit_card: 'Card',
  other: 'Other',
}

const MODE_COLORS = {
  Cash: 'bg-emerald-100 text-emerald-700',
  'Bank Transfer': 'bg-blue-100 text-blue-700',
  UPI: 'bg-purple-100 text-purple-700',
  Card: 'bg-amber-100 text-amber-700',
  Other: 'bg-gray-100 text-gray-700',
}

export default function PaymentModeTracking({ apiBase }) {
  const [summary, setSummary] = useState([])

  useEffect(() => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    Promise.all([
      fetch(`${apiBase}/payments`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`${apiBase}/expenses`, { headers: { Authorization: `Bearer ${token}` } }),
    ])
      .then(async ([pRes, eRes]) => {
        const pJson = pRes.ok ? await pRes.json() : { payments: [] }
        const eJson = eRes.ok ? await eRes.json() : { expenses: [] }
        const all = [
          ...(pJson.payments || []).map((p) => ({ amount: Number(p.amount || 0), method: p.paymentMethod, dir: 'IN' })),
          ...(eJson.expenses || []).map((e) => ({
            amount: Number(e.amount || 0),
            method: e.paymentMethod,
            dir: 'OUT',
          })),
        ]
        const map = new Map()
        for (const t of all) {
          const label = MODE_LABELS[t.method] || 'Other'
          const prev = map.get(label) || { label, in: 0, out: 0 }
          if (t.dir === 'IN') prev.in += t.amount
          else prev.out += t.amount
          map.set(label, prev)
        }
        setSummary(Array.from(map.values()))
      })
      .catch(() => {})
  }, [apiBase])

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-sky-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Payment Mode Tracking</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        {summary.length === 0 && <p className="text-indigo-100">No payments/receipts recorded yet.</p>}
        {summary.map((m) => (
          <div
            key={m.label}
            className="flex items-center justify-between bg-white/10 rounded-xl px-3 py-2"
          >
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${MODE_COLORS[m.label] || MODE_COLORS.Other}`}>
              {m.label}
            </span>
            <div className="text-right space-y-0.5">
              <p>
                <span className="text-indigo-100 mr-1">In:</span>
                <span className="font-semibold">
                  ${m.in.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </p>
              <p>
                <span className="text-indigo-100 mr-1">Out:</span>
                <span className="font-semibold">
                  ${m.out.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

