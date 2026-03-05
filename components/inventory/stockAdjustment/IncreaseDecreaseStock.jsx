'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { ArrowUpDown, Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import AdjustmentReasonEntry from './AdjustmentReasonEntry'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ADJUSTMENT_TYPES = [
  { value: 'MANUAL_CORRECTION', label: 'Manual Correction' },
  { value: 'PHYSICAL_AUDIT', label: 'Physical Audit' },
  { value: 'DAMAGE', label: 'Damage' },
  { value: 'EXPIRY', label: 'Expiry' },
  { value: 'THEFT_LOSS', label: 'Theft / Loss' },
]

export default function IncreaseDecreaseStock({ inventoryItems, defaultType, onCreated }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [itemId, setItemId] = useState('')
  const [quantity, setQuantity] = useState('')
  const [direction, setDirection] = useState('decrease')
  const [reason, setReason] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [manualType, setManualType] = useState('MANUAL_CORRECTION')

  const effectiveType = defaultType || manualType

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemId || !quantity || Number(quantity) <= 0 || !reason?.trim()) return
    const qty = Number(quantity)
    const quantityDelta = direction === 'increase' ? qty : -qty
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-adjustments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          itemId,
          adjustmentType: effectiveType,
          quantityDelta,
          reason: reason.trim(),
          notes: notes.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create adjustment')
      }
      const data = await res.json()
      setItemId('')
      setQuantity('')
      setReason('')
      setNotes('')
      if (onCreated) onCreated(data.adjustment)
    } catch (e) {
      alert(e.message || 'Failed to create adjustment')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-900">
          <ArrowUpDown className="h-5 w-5" />
          Increase / Decrease Stock
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Item</Label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2"
              required
            >
              <option value="">Select item</option>
              {(inventoryItems || []).map((i) => (
                <option key={i.id} value={i.id}>{i.name} ({i.currentStock || 0} {i.unit || ''})</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Adjustment Type</Label>
            {defaultType ? (
              <div className="mt-1 rounded-xl border border-gray-200 px-3 py-2 bg-gray-50 text-gray-700">
                {ADJUSTMENT_TYPES.find((t) => t.value === defaultType)?.label || defaultType}
              </div>
            ) : (
              <select
                value={manualType}
                onChange={(e) => setManualType(e.target.value)}
                className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2"
              >
                {ADJUSTMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            )}
          </div>
          <div>
            <Label>Direction & Quantity</Label>
            <div className="flex gap-2 mt-1">
              <Button type="button" variant={direction === 'increase' ? 'default' : 'outline'} size="sm" onClick={() => setDirection('increase')} className={direction === 'increase' ? 'bg-green-600 hover:bg-green-700' : ''}>
                <TrendingUp className="h-4 w-4 mr-1" /> Increase
              </Button>
              <Button type="button" variant={direction === 'decrease' ? 'default' : 'outline'} size="sm" onClick={() => setDirection('decrease')} className={direction === 'decrease' ? 'bg-red-600 hover:bg-red-700' : ''}>
                <TrendingDown className="h-4 w-4 mr-1" /> Decrease
              </Button>
              <Input type="number" min="0.01" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Qty" className="w-24" required />
            </div>
          </div>
          <AdjustmentReasonEntry value={reason} onChange={setReason} />
          {notes !== undefined && (
            <div>
              <Label>Notes (optional)</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full mt-1 rounded-xl border px-3 py-2 text-sm" placeholder="Additional notes..." />
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Submit Adjustment Request
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
