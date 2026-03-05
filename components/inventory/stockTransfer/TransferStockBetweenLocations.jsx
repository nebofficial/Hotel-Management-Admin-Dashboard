'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/app/auth-context'
import { ArrowRightLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import FromToStoreSelection from './FromToStoreSelection'
import TransferQuantityValidation from './TransferQuantityValidation'
import TransferNotes from './TransferNotes'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function TransferStockBetweenLocations({ locations, inventoryItems, stockByLocation, onTransferCreated }) {
  const { user } = useAuth()
  const [fromLocationId, setFromLocationId] = useState('')
  const [toLocationId, setToLocationId] = useState('')
  const [lines, setLines] = useState([{ itemId: '', itemName: '', quantity: '', unit: '' }])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)

  const getAvailableAtLocation = (itemId, locationId) => {
    const row = stockByLocation && stockByLocation.find((s) => s.itemId === itemId && s.locationId === locationId)
    return row ? Number(row.quantity) : 0
  }

  const addLine = () => setLines([...lines, { itemId: '', itemName: '', quantity: '', unit: '' }])
  const removeLine = (i) => setLines(lines.filter((_, idx) => idx !== i))
  const updateLine = (i, field, value) => {
    const next = [...lines]
    next[i] = { ...next[i], [field]: value }
    if (field === 'itemId') {
      const item = inventoryItems && inventoryItems.find((it) => it.id === value)
      next[i].itemName = item ? item.name : ''
      next[i].unit = item ? item.unit : ''
    }
    setLines(next)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fromLocationId || !toLocationId) {
      alert('Please select From and To store')
      return
    }
    if (fromLocationId === toLocationId) {
      alert('From and To store must be different')
      return
    }
    const items = lines
      .filter((l) => l.itemId && Number(l.quantity) > 0)
      .map((l) => {
        const item = inventoryItems && inventoryItems.find((i) => i.id === l.itemId)
        return {
          itemId: l.itemId,
          itemName: l.itemName || (item && item.name),
          quantity: Number(l.quantity),
          unit: l.unit || '',
        }
      })
    if (items.length === 0) {
      alert('Add at least one item with quantity')
      return
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(API_BASE + '/api/hotel-data/' + user.hotelId + '/stock-transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token },
        body: JSON.stringify({ fromLocationId, toLocationId, items, notes: notes.trim() || undefined }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create transfer')
      }
      const data = await res.json()
      setFromLocationId('')
      setToLocationId('')
      setLines([{ itemId: '', itemName: '', quantity: '', unit: '' }])
      setNotes('')
      if (onTransferCreated) onTransferCreated(data.transfer)
    } catch (e) {
      alert(e.message || 'Failed to create transfer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emerald-900">
          <ArrowRightLeft className="h-5 w-5" />
          Transfer Stock Between Locations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FromToStoreSelection
            locations={locations}
            fromLocationId={fromLocationId}
            toLocationId={toLocationId}
            onFromChange={setFromLocationId}
            onToChange={setToLocationId}
          />
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-gray-700">Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="h-4 w-4 mr-1" /> Add line
              </Button>
            </div>
            <div className="space-y-2">
              {lines.map((line, i) => (
                <div key={i} className="flex flex-wrap items-end gap-2">
                  <div className="flex-1 min-w-[180px]">
                    <select
                      value={line.itemId}
                      onChange={(e) => updateLine(i, 'itemId', e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                      required
                    >
                      <option value="">Select item</option>
                      {(inventoryItems || []).map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.name} {item.sku ? '(' + item.sku + ')' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <Input type="number" placeholder="Qty" value={line.quantity} onChange={(e) => updateLine(i, 'quantity', e.target.value)} min="0.01" step="any" required />
                  </div>
                  <div className="w-16 text-sm text-gray-500">{line.unit || '-'}</div>
                  {fromLocationId && (
                    <TransferQuantityValidation available={getAvailableAtLocation(line.itemId, fromLocationId)} requested={Number(line.quantity) || 0} />
                  )}
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLine(i)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <TransferNotes value={notes} onChange={setNotes} />
          <Button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
              </>
            ) : (
              <>
                <ArrowRightLeft className="mr-2 h-4 w-4" /> Create Transfer Request
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
