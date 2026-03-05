'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { FileText, Loader2, CheckSquare } from 'lucide-react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function AutoGeneratePO({ lowStockItems, suppliers, onGenerated }) {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [selectedItems, setSelectedItems] = useState([])
  const [supplierId, setSupplierId] = useState('')
  const [loading, setLoading] = useState(false)

  const toggleItem = (id) => {
    setSelectedItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const handleGenerate = async () => {
    if (selectedItems.length === 0) {
      alert('Select at least one item')
      return
    }
    if (!supplierId) {
      alert('Select a supplier')
      return
    }
    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-alerts/auto-generate-po`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ itemIds: selectedItems, supplierId }),
      })
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed to generate PO')
      const data = await res.json()
      alert(`Purchase Order ${data.order?.orderNumber || ''} created successfully`)
      setSelectedItems([])
      if (onGenerated) onGenerated(data.order)
    } catch (e) {
      alert(e.message || 'Failed to generate PO')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-violet-900">
          <FileText className="h-5 w-5" />
          Auto Generate Purchase Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Supplier</Label>
          <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2" required>
            <option value="">Select supplier</option>
            {(suppliers || []).map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Select Items ({selectedItems.length} selected)</Label>
          <div className="mt-2 space-y-1 max-h-[300px] overflow-y-auto">
            {(lowStockItems || []).map((item) => (
              <div key={item.id} className="flex items-center gap-2 bg-white rounded-lg p-2 border border-gray-200">
                <input type="checkbox" checked={selectedItems.includes(item.id)} onChange={() => toggleItem(item.id)} className="h-4 w-4" />
                <CheckSquare className={`h-4 w-4 ${selectedItems.includes(item.id) ? 'text-violet-600' : 'text-gray-300'}`} />
                <span className="text-sm flex-1">{item.name}</span>
                <span className="text-xs text-red-600 font-medium">{item.currentStock}/{item.reorderLevel}</span>
              </div>
            ))}
          </div>
        </div>
        <Button onClick={handleGenerate} disabled={loading || selectedItems.length === 0} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Generate PO for Selected Items
        </Button>
      </CardContent>
    </Card>
  )
}
