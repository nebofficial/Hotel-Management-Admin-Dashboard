'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/auth-context'
import { Package, Loader2, CheckCircle2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function UpdateStockAutomatically({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  if (!grn) return null

  const handleApproveAndUpdateStock = async () => {
    if (grn.status !== 'Verified') {
      alert('GRN must be verified before approving and updating stock')
      return
    }

    if (grn.stockUpdated) {
      alert('Stock has already been updated for this GRN')
      return
    }

    if (!confirm('This will approve the GRN and update inventory stock. Continue?')) {
      return
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user?.hotelId}/grns/${grn.id}/approve-and-update-stock`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update stock' }))
        throw new Error(errorData.message || 'Failed to update stock')
      }

      const data = await res.json()
      alert('GRN approved and stock updated successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Approve and update stock error:', error)
      alert(error.message || 'Failed to approve GRN and update stock')
    } finally {
      setLoading(false)
    }
  }

  const acceptedItems = Array.isArray(grn.receivedItems)
    ? grn.receivedItems.filter((item) => Number(item.acceptedQty || 0) > 0)
    : []

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Package className="h-5 w-5" />
          Auto Stock Update
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${
                  grn.status === 'Approved' ? 'text-green-600' : 
                  grn.status === 'Verified' ? 'text-blue-600' : 
                  'text-gray-600'
                }`}>
                  {grn.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Stock Updated:</span>
                <span className={grn.stockUpdated ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                  {grn.stockUpdated ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Items to Update:</span>
                <span className="font-semibold text-gray-900">{acceptedItems.length}</span>
              </div>
            </div>
          </div>

          {acceptedItems.length > 0 && (
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2">Items to be Added to Stock:</h4>
              <div className="space-y-1 text-sm">
                {acceptedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-gray-600">
                    <span>{item.itemName}</span>
                    <span className="font-medium text-green-600">+{item.acceptedQty} {item.unit || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleApproveAndUpdateStock}
            disabled={loading || grn.status !== 'Verified' || grn.stockUpdated}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating Stock...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve & Update Stock
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
