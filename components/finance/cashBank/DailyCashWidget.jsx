'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'

export default function DailyCashWidget({ apiBase, refreshTrigger }) {
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [summary, setSummary] = useState({ openingBalance: 0, totalInflow: 0, totalOutflow: 0, closingBalance: 0 })

  useEffect(() => {
    if (!apiBase) return
    const token = localStorage.getItem('token')
    fetch(`${apiBase}/cash-bank/daily-summary?date=${date}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { openingBalance: 0, totalInflow: 0, totalOutflow: 0, closingBalance: 0 }))
      .then((d) => setSummary(d || { openingBalance: 0, totalInflow: 0, totalOutflow: 0, closingBalance: 0 }))
      .catch(() => setSummary({ openingBalance: 0, totalInflow: 0, totalOutflow: 0, closingBalance: 0 }))
  }, [apiBase, date, refreshTrigger])

  const { openingBalance, totalInflow, totalOutflow, closingBalance } = summary

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-400 text-amber-950">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Daily Cash
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs text-amber-900">Date</Label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-xl border border-amber-300 px-3 py-2 text-sm bg-white/70"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="bg-white/70 rounded-xl p-2">
            <p className="text-xs text-gray-600">Opening</p>
            <p className="font-semibold">${openingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-2">
            <p className="text-xs text-gray-600">Closing</p>
            <p className="font-semibold">${closingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-2">
            <p className="text-xs text-gray-600">Inflow</p>
            <p className="font-semibold text-green-700">${totalInflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
          <div className="bg-white/70 rounded-xl p-2">
            <p className="text-xs text-gray-600">Outflow</p>
            <p className="font-semibold text-red-700">${totalOutflow.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
