'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/app/auth-context'
import { AlertTriangle, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function DamagedItemEntry({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (grn && Array.isArray(grn.receivedItems)) {
      setItems(grn.receivedItems.map((item) => ({ ...item })))
    }
  }, [grn])

  if (!grn) return null

  const handleDamagedChange = (index, field, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    }
    
    // Recalculate acceptedQty
    const receivedQty = Number(newItems[index].receivedQty || 0)
    const rejectedQty = Number(newItems[index].rejectedQty || 0)
    const damagedQty = Number(newItems[index].damagedQty || 0)
    newItems[index].acceptedQty = Math.max(0, receivedQty - rejectedQty - damagedQty)
    
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
      alert('Damaged items recorded successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Update damaged items error:', error)
      alert(error.message || 'Failed to update damaged items')
    } finally {
      setLoading(false)
    }
  }

  const damagedItems = items.filter((item) => Number(item.damagedQty || 0) > 0)

  return (
    <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="h-5 w-5" />
          Damaged Item Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-3">{item.itemName}</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs text-gray-600">Damaged Quantity</Label>
                  <Input
                    type="number"
                    value={item.damagedQty || 0}
                    onChange={(e) => handleDamagedChange(index, 'damagedQty', Number(e.target.value) || 0)}
                    className="mt-1"
                    min="0"
                    max={item.receivedQty}
                  />
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Condition</Label>
                  <select
                    value={item.condition || 'Good'}
                    onChange={(e) => handleDamagedChange(index, 'condition', e.target.value)}
                    className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                  >
                    <option value="Good">Good</option>
                    <option value="Damaged">Damaged</option>
                    <option value="Expired">Expired</option>
                    <option value="Broken">Broken</option>
                    <option value="Defective">Defective</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs text-gray-600">Damage Notes</Label>
                  <Textarea
                    value={item.notes || ''}
                    onChange={(e) => handleDamagedChange(index, 'notes', e.target.value)}
                    rows={2}
                    className="mt-1"
                    placeholder="Describe the damage"
                  />
                </div>
              </div>
            </div>
          ))}

          {damagedItems.length > 0 && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-semibold text-red-900 mb-2">Summary of Damaged Items</h4>
              <div className="space-y-1 text-sm text-red-800">
                {damagedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span>{item.itemName}</span>
                    <span className="font-medium">{item.damagedQty} units - {item.condition}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={loading || items.length === 0}
            className="w-full bg-red-600 hover:bg-red-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <AlertTriangle className="mr-2 h-4 w-4" />
                Save Damaged Items
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
