'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function AllocatePayment({ apiBase }) {
  const [bookingId, setBookingId] = useState('')
  const [loading, setLoading] = useState(false)
  const [rows, setRows] = useState([])

  const load = async () => {
    if (!apiBase || !bookingId) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/guest-ledger/booking/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to load booking ledger')
      const charges = data.charges || []
      const payments = data.payments || []
      const totalCharges = charges.reduce((s, c) => s + Number(c.amount || 0), 0)
      const totalPaid = payments.reduce((s, p) => s + Number(p.amount || 0), 0)
      setRows([
        { label: 'Total Charges', amount: totalCharges },
        { label: 'Total Payments', amount: totalPaid },
        { label: 'Remaining Balance', amount: totalCharges - totalPaid },
      ])
    } catch (e) {
      alert(e.message || 'Failed to load booking ledger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Allocate Payment to Invoice</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex gap-2">
          <div className="flex-1">
            <Label className="text-xs text-blue-50">Booking / Invoice ID</Label>
            <input
              type="text"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
              className="mt-1 w-full rounded-xl border border-blue-200 px-3 py-2 text-sm text-blue-900"
            />
          </div>
          <Button
            type="button"
            onClick={load}
            disabled={loading || !bookingId}
            className="mt-5 bg-white text-blue-700 hover:bg-blue-50 text-xs"
          >
            {loading ? 'Loading...' : 'Fetch'}
          </Button>
        </div>
        {rows.length > 0 && (
          <div className="mt-2 space-y-1 text-xs bg-white/10 rounded-xl p-3">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-blue-100">{r.label}</span>
                <span className="font-semibold">
                  ${r.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
            <p className="text-[11px] text-blue-100 mt-1">
              For partial payments, you can record multiple receipts against the same booking ID; remaining
              balance auto-updates here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

