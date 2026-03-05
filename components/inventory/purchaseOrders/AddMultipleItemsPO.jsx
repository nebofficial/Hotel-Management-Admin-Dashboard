'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus, Trash2 } from 'lucide-react'

export default function AddMultipleItemsPO({ items = [], inventoryItems = [], onChange }) {
  const addItem = () => {
    onChange?.([...items, { itemId: '', name: '', quantity: 1, price: 0, unit: '' }])
  }

  const removeItem = (index) => {
    onChange?.(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index] = { ...updated[index], [field]: value }
    onChange?.(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-900">Order Items</Label>
        <Button type="button" onClick={addItem} size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add Item
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 p-6 text-center">
          <p className="text-sm text-slate-500">No items added yet. Click "Add Item" to start.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={index} className="rounded-md border border-slate-200 bg-white p-3">
              <div className="grid grid-cols-12 gap-2 items-end">
                <div className="col-span-5 space-y-1.5">
                  <Label className="text-xs">Item Name</Label>
                  <select
                    value={item.itemId || ''}
                    onChange={(e) => {
                      const selected = inventoryItems.find((i) => String(i.id) === String(e.target.value))
                      updateItem(index, 'itemId', e.target.value)
                      if (selected) {
                        updateItem(index, 'name', selected.name)
                        updateItem(index, 'unit', selected.unit || '')
                        updateItem(index, 'price', selected.costPrice || selected.unitPrice || 0)
                      }
                    }}
                    className="w-full rounded-md border border-slate-200 bg-white px-2 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">Select item…</option>
                    {inventoryItems.map((inv) => (
                      <option key={inv.id} value={inv.id}>
                        {inv.name} {inv.sku ? `(${inv.sku})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Quantity</Label>
                  <Input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={item.quantity || ''}
                    onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Unit</Label>
                  <Input
                    value={item.unit || ''}
                    readOnly
                    className="text-sm bg-slate-50"
                  />
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label className="text-xs">Price (₹)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price || ''}
                    onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                </div>
                <div className="col-span-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-2 text-right">
                <span className="text-xs text-slate-500">
                  Line Total: ₹{((item.quantity || 0) * (item.price || 0)).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
