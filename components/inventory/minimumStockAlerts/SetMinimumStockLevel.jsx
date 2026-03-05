'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { Settings, Loader2 } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SetMinimumStockLevel({ inventoryItems, onUpdated }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [itemId, setItemId] = useState('')
  const [reorderLevel, setReorderLevel] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedItem = inventoryItems?.find((i) => i.id === itemId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!itemId || !reorderLevel || Number(reorderLevel) < 0) return
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ reorderLevel: Number(reorderLevel) }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to update')
      setItemId('')
      setReorderLevel('')
      if (onUpdated) onUpdated()
    } catch (e) {
      alert(e.message || 'Failed to update reorder level')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-900">
          <Settings className="h-5 w-5" />
          Set Minimum Stock Level
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Item</Label>
            <select value={itemId} onChange={(e) => setItemId(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" required>
              <option value="">Select item</option>
              {(inventoryItems || []).map((i) => (
                <option key={i.id} value={i.id}>{i.name} (Current: {i.currentStock || 0}, Reorder: {i.reorderLevel || 0})</option>
              ))}
            </select>
          </div>
          {selectedItem && (
            <div className="bg-purple-100 rounded-xl p-3 text-sm">
              <p className="text-purple-900"><strong>Current Stock:</strong> {selectedItem.currentStock || 0} {selectedItem.unit || ''}</p>
              <p className="text-purple-900"><strong>Current Reorder Level:</strong> {selectedItem.reorderLevel || 0}</p>
            </div>
          )}
          <div>
            <Label>New Minimum Stock Level</Label>
            <Input type="number" min="0" step="any" value={reorderLevel} onChange={(e) => setReorderLevel(e.target.value)} placeholder="e.g. 100" className="mt-1 rounded-xl" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Update Threshold
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
