'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/auth-context'
import { Package, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AutoStockDeduction({ transfer, onCompleted }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!transfer) return null
  if (transfer.status === 'Completed') {
    return (
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-900 text-base">
            <Package className="h-5 w-5" />
            Auto Stock Deduction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-green-700 font-medium">
            Completed. Stock has been deducted from source and added to destination.
          </p>
          {transfer.completedAt && (
            <p className="text-xs text-gray-500 mt-1">
              {new Date(transfer.completedAt).toLocaleString()}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }
  if (transfer.status !== 'Approved' && transfer.status !== 'InTransit') return null

  const handleComplete = async () => {
    if (!confirm('Complete transfer? This will deduct stock from source and add to destination.')) return
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user?.hotelId}/stock-transfers/${transfer.id}/complete`,
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
        throw new Error(err.message || 'Failed to complete transfer')
      }
      const data = await res.json()
      if (onCompleted) onCompleted(data.transfer)
    } catch (e) {
      alert(e.message || 'Failed to complete transfer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900 text-base">
          <Package className="h-5 w-5" />
          Auto Stock Deduction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-3">
          Completing this transfer will deduct stock from the source store and add to the destination store.
        </p>
        <Button
          onClick={handleComplete}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : (
            <>
              <Package className="mr-2 h-4 w-4" />
              Complete Transfer (Deduct & Add Stock)
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
