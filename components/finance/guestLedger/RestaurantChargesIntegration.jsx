'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { UtensilsCrossed, Loader2 } from 'lucide-react'

export default function RestaurantChargesIntegration({ selectedBooking, apiBase, onPosted }) {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(false)
  const [posting, setPosting] = useState(null)

  useEffect(() => {
    if (!apiBase) return
    setLoading(true)
    fetch(`${apiBase}/guest-ledger/restaurant-bills`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then((r) => r.ok ? r.json() : { bills: [] })
      .then((d) => setBills(d.bills || []))
      .finally(() => setLoading(false))
  }, [apiBase])

  const handlePost = async (bill) => {
    if (!selectedBooking?.id || !apiBase) {
      alert('Select a guest/booking first')
      return
    }
    setPosting(bill.id)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`${apiBase}/guest-ledger/post-restaurant`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          bookingId: selectedBooking.id,
          guestId: selectedBooking.guestId,
          billId: bill.id,
          amount: Number(bill.totalAmount || 0),
          description: `Restaurant - Table ${bill.tableNo}`,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.message || 'Failed to post')
      onPosted?.()
    } catch (e) {
      alert(e.message || 'Failed to post')
    } finally {
      setPosting(null)
    }
  }

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-blue-50/80 border border-blue-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-blue-900 text-base flex items-center gap-2">
          <UtensilsCrossed className="h-5 w-5" />
          Restaurant Charges
        </CardTitle>
      </CardHeader>
      <CardContent>
        {selectedBooking ? (
          loading ? (
            <p className="text-sm text-gray-500 py-2">Loading bills...</p>
          ) : (
            <div className="space-y-2 max-h-[200px] overflow-y-auto">
              {(bills || []).slice(0, 10).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between p-2 rounded-lg bg-white border border-blue-100">
                  <span className="text-sm">Table {bill.tableNo} · ${Number(bill.totalAmount || 0).toFixed(2)}</span>
                  <Button size="sm" variant="outline" className="text-xs" onClick={() => handlePost(bill)} disabled={posting === bill.id}>
                    {posting === bill.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Post to room'}
                  </Button>
                </div>
              ))}
              {bills.length === 0 && <p className="text-sm text-gray-500 py-2">No paid restaurant bills</p>}
            </div>
          )
        ) : (
          <p className="text-sm text-gray-500 py-2">Select a guest to post restaurant charges</p>
        )}
      </CardContent>
    </Card>
  )
}
