'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { Hash, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function BatchNumberEntry({ grn, onUpdate }) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [items, setItems] = useState([])

  useEffect(() => {
    if (grn && Array.isArray(grn.receivedItems)) {
      setItems(grn.receivedItems.map((item) => ({ ...item })))
    }
  }, [grn])

  if (!grn) return null

  const handleBatchChange = (index, value) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      batchNumber: value,
    }
    setItems(newItems)
  }

  const generateBatchNumber = (itemName) => {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, '')
    const nameCode = itemName.substring(0, 3).toUpperCase()
    return `BATCH-${nameCode}-${dateStr}`
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
      alert('Batch numbers saved successfully')
      if (onUpdate) onUpdate(data.grn)
    } catch (error) {
      console.error('Update batch numbers error:', error)
      alert(error.message || 'Failed to update batch numbers')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-900">
          <Hash className="h-5 w-5" />
          Batch Number Entry
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const batchNum = generateBatchNumber(item.itemName)
                    handleBatchChange(index, batchNum)
                  }}
                  className="text-xs"
                >
                  Auto Generate
                </Button>
              </div>
              <div>
                <Label className="text-xs text-gray-600">Batch Number</Label>
                <Input
                  value={item.batchNumber || ''}
                  onChange={(e) => handleBatchChange(index, e.target.value)}
                  className="mt-1"
                  placeholder="Enter batch number"
                />
              </div>
            </div>
          ))}

          <Button
            onClick={handleSave}
            disabled={loading || items.length === 0}
            className="w-full bg-violet-600 hover:bg-violet-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Hash className="mr-2 h-4 w-4" />
                Save Batch Numbers
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
