'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function VerifyDeliveredItems({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (grn && Array.isArray(grn.receivedItems)) {
      setItems(grn.receivedItems.map((item) => ({ ...item })))
    }
  }, [grn])

  if (!grn) return null

  const handleQuantityChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: Number(value) || 0,
    }
    
    // Auto-calculate acceptedQty = receivedQty - rejectedQty - damagedQty
    const receivedQty = Number(newItems[index].receivedQty || 0)
    const rejectedQty = Number(newItems[index].rejectedQty || 0)
    const damagedQty = Number(newItems[index].damagedQty || 0)
    newItems[index].acceptedQty = Math.max(0, receivedQty - rejectedQty - damagedQty)
    
    setItems(newItems)
  }

  const handleVerify = async () => {
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${user?.hotelId}/grns/${grn.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: 'Verified',
          receivedItems: items,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to verify GRN' }))
        throw new Error(errorData.message || 'Failed to verify GRN')
      }

      const data = await res.json()
      alert('GRN verified successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Verify GRN error:', error)
      alert(error.message || 'Failed to verify GRN')
    } finally {
      setLoading(false)
    }
  }

  const getVariance = (ordered, received) => {
    const diff = received - ordered
    if (diff === 0) return { color: 'text-green-600', icon: CheckCircle2 }
    if (diff > 0) return { color: 'text-blue-600', icon: AlertTriangle }
    return { color: 'text-red-600', icon: AlertTriangle }
  }

  return (
    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-900">
          <CheckCircle2 className="h-5 w-5" />
          Verify Delivered Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => {
            const variance = getVariance(item.orderedQty, item.receivedQty)
            const VarianceIcon = variance.icon
            
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                  <div className={`flex items-center gap-1 ${variance.color}`}>
                    <VarianceIcon className="h-4 w-4" />
                    <span className="text-sm">
                      {item.receivedQty >= item.orderedQty ? '+' : ''}
                      {item.receivedQty - item.orderedQty}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <Label className="text-xs text-gray-600">Ordered</Label>
                    <Input
                      value={item.orderedQty}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Received</Label>
                    <Input
                      type="number"
                      value={item.receivedQty}
                      onChange={(e) => handleQuantityChange(index, 'receivedQty', e.target.value)}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Accepted</Label>
                    <Input
                      value={item.acceptedQty}
                      disabled
                      className="mt-1 bg-green-50"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Rejected</Label>
                    <Input
                      type="number"
                      value={item.rejectedQty}
                      onChange={(e) => handleQuantityChange(index, 'rejectedQty', e.target.value)}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            )
          })}

          <Button
            onClick={handleVerify}
            disabled={loading || items.length === 0}
            className="w-full bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Verify GRN
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
