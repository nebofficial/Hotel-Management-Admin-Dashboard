'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/app/auth-context'
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AcceptRejectItems({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (grn && Array.isArray(grn.receivedItems)) {
      setItems(grn.receivedItems.map((item) => ({ ...item })))
    }
  }, [grn])

  if (!grn) return null

  const handleItemChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    
    // Auto-calculate acceptedQty = receivedQty - rejectedQty - damagedQty
    if (field === 'receivedQty' || field === 'rejectedQty' || field === 'damagedQty') {
      const receivedQty = Number(newItems[index].receivedQty || 0)
      const rejectedQty = Number(newItems[index].rejectedQty || 0)
      const damagedQty = Number(newItems[index].damagedQty || 0)
      newItems[index].acceptedQty = Math.max(0, receivedQty - rejectedQty - damagedQty)
    }
    
    setItems(newItems)
  }

  const handleSave = async () => {
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
          receivedItems: items,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to update GRN' }))
        throw new Error(errorData.message || 'Failed to update GRN')
      }

      const data = await res.json()
      alert('Items updated successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Update items error:', error)
      alert(error.message || 'Failed to update items')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-900">
          <CheckCircle2 className="h-5 w-5" />
          Accept / Reject Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">{item.itemName}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                <div>
                  <Label className="text-xs text-gray-600">Received Qty</Label>
                  <Input
                    type="number"
                    value={item.receivedQty}
                    onChange={(e) => handleItemChange(index, 'receivedQty', Number(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-green-600">Accepted Qty</Label>
                  <Input
                    value={item.acceptedQty}
                    disabled
                    className="mt-1 bg-green-50"
                  />
                </div>
                <div>
                  <Label className="text-xs text-red-600">Rejected Qty</Label>
                  <Input
                    type="number"
                    value={item.rejectedQty}
                    onChange={(e) => handleItemChange(index, 'rejectedQty', Number(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                  />
                </div>
                <div>
                  <Label className="text-xs text-orange-600">Damaged Qty</Label>
                  <Input
                    type="number"
                    value={item.damagedQty}
                    onChange={(e) => handleItemChange(index, 'damagedQty', Number(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Condition</Label>
                  <select
                    value={item.condition || 'Good'}
                    onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Expired">Expired</option>
                    <option value="Short">Short</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Notes</Label>
                  <Textarea
                    value={item.notes || ''}
                    onChange={(e) => handleItemChange(index, 'notes', e.target.value)}
                    rows={2}
                    className="mt-1"
                    placeholder="Rejection reason or notes"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            onClick={handleSave}
            disabled={loading || items.length === 0}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
