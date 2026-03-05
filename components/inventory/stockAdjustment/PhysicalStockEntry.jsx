'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { ClipboardCheck, Loader2 } from 'lucide-react'
import AdjustmentReasonEntry from './AdjustmentReasonEntry'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PhysicalStockEntry({ inventoryItems, onCreated }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [itemId, setItemId] = useState('')
  const [physicalCount, setPhysicalCount] = useState('')
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedItem = inventoryItems?.find((i) => i.id === itemId)
  const currentStock = Number(selectedItem?.currentStock || 0)
  const newCount = Number(physicalCount) || 0
  const delta = newCount - currentStock

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemId || physicalCount === '' || !reason?.trim()) return
    if (delta === 0) {
      alert('Physical count matches current stock. No adjustment needed.')
      return
    }
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-adjustments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          itemId,
          adjustmentType: 'PHYSICAL_AUDIT',
          quantityDelta: delta,
          reason: reason.trim(),
          notes: `Physical count: ${physicalCount}`,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create adjustment')
      }
      const data = await res.json()
      setItemId('')
      setPhysicalCount('')
      setReason('')
      if (onCreated) onCreated(data.adjustment)
    } catch (e) {
      alert(e.message || 'Failed to create adjustment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-cyan-900">
          <ClipboardCheck className="h-5 w-5" />
          Enter Physical Stock After Audit
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Item</Label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" required>
              <option value="">Select item</option>
              {(inventoryItems || []).map((i) => (
                <option key={i.id} value={i.id}>{i.name} — System: {i.currentStock || 0} {i.unit || ''}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Physical Count (actual quantity counted)</Label>
            <Input type="number" min="0" step="any" value={physicalCount} onChange={(e) => setPhysicalCount(e.target.value)} placeholder="Enter counted quantity" className="mt-1 rounded-xl" required />
            {itemId && physicalCount !== '' && (
              <p className={`text-sm mt-1 font-medium ${delta > 0 ? 'text-green-600' : delta < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                {delta > 0 ? `+${delta} (increase)` : delta < 0 ? `${delta} (decrease)` : 'No change'}
              </p>
            )}
          </div>
          <AdjustmentReasonEntry value={reason} onChange={setReason} />
          <Button type="submit" disabled={loading || delta === 0} className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit Physical Audit Adjustment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
