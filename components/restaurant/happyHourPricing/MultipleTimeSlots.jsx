'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Clock } from 'lucide-react'

export default function MultipleTimeSlots({ rules, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    slots: [{ start: '17:00', end: '19:00' }],
    discountType: 'percent',
    discountValue: 20,
  })

  const addSlot = () => {
    setFormData({
      ...formData,
      slots: [...formData.slots, { start: '17:00', end: '19:00' }],
    })
  }

  const removeSlot = (index) => {
    if (formData.slots.length > 1) {
      setFormData({
        ...formData,
        slots: formData.slots.filter((_, i) => i !== index),
      })
    }
  }

  const updateSlot = (index, field, value) => {
    const newSlots = [...formData.slots]
    newSlots[index] = { ...newSlots[index], [field]: value }
    setFormData({ ...formData, slots: newSlots })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      startTime: formData.slots[0]?.start || '17:00',
      endTime: formData.slots[formData.slots.length - 1]?.end || '19:00',
      daysOfWeek: [],
      weekendOnly: false,
      barOnly: false,
      autoRevert: true,
      autoActivate: true,
      autoDeactivate: true,
      isActive: true,
    })
    setFormData({
      name: '',
      slots: [{ start: '17:00', end: '19:00' }],
      discountType: 'percent',
      discountValue: 20,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4" />
          Multiple Time Slots
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Rule Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Multi-Slot Happy Hour"
              required
            />
          </div>

          <div>
            <Label htmlFor="discountType">Discount Type</Label>
            <select
              id="discountType"
              value={formData.discountType}
              onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>

          <div>
            <Label htmlFor="discountValue">
              Discount Value {formData.discountType === 'percent' ? '(%)' : '(₹)'}
            </Label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              step={formData.discountType === 'percent' ? '1' : '0.01'}
              value={formData.discountValue}
              onChange={(e) =>
                setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })
              }
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Time Slots</Label>
              <Button type="button" onClick={addSlot} variant="outline" size="sm" className="text-xs">
                + Add Slot
              </Button>
            </div>
            <div className="space-y-2 border rounded-md p-3">
              {formData.slots.map((slot, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="time"
                    value={slot.start}
                    onChange={(e) => updateSlot(index, 'start', e.target.value)}
                    className="flex-1"
                    required
                  />
                  <span className="text-xs text-gray-500">to</span>
                  <Input
                    type="time"
                    value={slot.end}
                    onChange={(e) => updateSlot(index, 'end', e.target.value)}
                    className="flex-1"
                    required
                  />
                  {formData.slots.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => removeSlot(index)}
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Create multiple happy hour periods in a single day
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Multi-Slot Rule'}
          </Button>
        </form>

        {rules && rules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Rules with Multiple Slots</h4>
            <div className="space-y-1 text-xs">
              {rules
                .filter((r) => r.slots && r.slots.length > 1)
                .map((rule) => (
                  <div key={rule.id} className="border-b pb-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-gray-600 mt-1">
                      {rule.slots.map((slot, idx) => (
                        <span key={idx} className="mr-2">
                          {slot.start}-{slot.end}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
