'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Plus, Wallet } from 'lucide-react'

const METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'upi', label: 'UPI' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
]

export default function PaymentSettlementPanel({ netPayable, onSetPayments, processing }) {
  const [rows, setRows] = useState([{ method: 'cash', amount: 0 }])

  useEffect(() => {
    onSetPayments?.(rows)
  }, [rows, onSetPayments])

  const total = rows.reduce((s, r) => s + Number(r.amount || 0), 0)
  const remaining = Number(netPayable || 0) - total

  const updateRow = (idx, patch) => {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, ...patch } : r)))
  }

  const addRow = () => {
    setRows((prev) => [...prev, { method: 'cash', amount: 0 }])
  }

  const formatCurrency = (v) => `₹${Number(v || 0).toFixed(2)}`

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 via-orange-400 to-amber-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <Wallet className="h-5 w-5" />
          Payment Settlement
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 space-y-3 text-xs">
        <div className="flex justify-between">
          <div>
            <div className="text-white/80">Net Payable</div>
            <div className="font-semibold text-sm">{formatCurrency(netPayable)}</div>
          </div>
          <div className="text-right">
            <div className="text-white/80">Total Entered</div>
            <div className="font-semibold text-sm">{formatCurrency(total)}</div>
            <div className={`text-[11px] ${remaining === 0 ? 'text-emerald-100' : 'text-red-100'}`}>
              Remaining: {formatCurrency(remaining)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          {rows.map((r, idx) => (
            <div key={idx} className="grid grid-cols-3 gap-2 items-center">
              <div>
                <Label className="text-white/90 text-[11px]">Mode</Label>
                <select
                  value={r.method}
                  onChange={(e) => updateRow(idx, { method: e.target.value })}
                  className="mt-1 w-full h-8 rounded-md bg-white/15 text-white border border-white/20 text-[11px]"
                >
                  {METHODS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <Label className="text-white/90 text-[11px]">Amount</Label>
                <Input
                  type="number"
                  min={0}
                  value={r.amount}
                  onChange={(e) => updateRow(idx, { amount: Number(e.target.value || 0) })}
                  className="mt-1 bg-white/15 text-white border-white/20 h-8 text-[11px]"
                />
              </div>
            </div>
          ))}
          <Button
            type="button"
            onClick={addRow}
            variant="outline"
            className="h-8 text-[11px] border-white/40 text-white hover:bg-white/20"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Split Payment
          </Button>
        </div>

        {remaining !== 0 && (
          <p className="text-[11px] text-red-100">
            Tip: Total of split payments must exactly match net payable before closing the stay.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

