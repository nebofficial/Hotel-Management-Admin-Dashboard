'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/auth-context'
import { CheckCircle, XCircle, Loader2, ShieldCheck } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ApprovalWorkflow({ adjustment, itemName, onApproved, onRejected }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [approving, setApproving] = useState(false)
  const [rejecting, setRejecting] = useState(false)

  if (!adjustment || adjustment.status !== 'Pending') return null

  const handleApprove = async () => {
    setApproving(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-adjustments/${adjustment.id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to approve')
      const data = await res.json()
      if (onApproved) onApproved(data.adjustment)
    } catch (e) {
      alert(e.message || 'Failed to approve')
    } finally {
      setApproving(false)
    }
  }

  const handleReject = async () => {
    if (!confirm('Reject this adjustment request?')) return
    setRejecting(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-adjustments/${adjustment.id}/reject`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to reject')
      const data = await res.json()
      if (onRejected) onRejected(data.adjustment)
    } catch (e) {
      alert(e.message || 'Failed to reject')
    } finally {
      setRejecting(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900 text-base">
          <ShieldCheck className="h-5 w-5" />
          Pending Approval
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-800 mb-3">{itemName} — Qty: {adjustment.quantityDelta > 0 ? '+' : ''}{adjustment.quantityDelta}</p>
        <div className="flex gap-2">
          <Button onClick={handleApprove} disabled={approving} className="flex-1 bg-green-600 hover:bg-green-700">
            {approving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <CheckCircle className="h-4 w-4 mr-1" />} Approve
          </Button>
          <Button variant="destructive" onClick={handleReject} disabled={rejecting}>
            {rejecting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <XCircle className="h-4 w-4 mr-1" />} Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
