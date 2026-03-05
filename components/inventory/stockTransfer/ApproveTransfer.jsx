'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/auth-context'
import { CheckCircle2, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ApproveTransfer({ transfer, onApproved }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!transfer || transfer.status !== 'Pending') return null

  const handleApprove = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user?.hotelId}/stock-transfers/${transfer.id}/approve`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      )
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to approve')
      }
      const data = await res.json()
      if (onApproved) onApproved(data.transfer)
    } catch (e) {
      alert(e.message || 'Failed to approve transfer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-900 text-base">
          <CheckCircle2 className="h-5 w-5" />
          Approve Transfer (Role-Based)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleApprove}
          disabled={loading}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Approve Transfer
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
