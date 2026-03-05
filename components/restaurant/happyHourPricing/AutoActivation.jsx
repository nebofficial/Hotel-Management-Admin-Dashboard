'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Power } from 'lucide-react'

export default function AutoActivation({ rules, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '17:00',
    endTime: '19:00',
    discountType: 'percent',
    discountValue: 20,
    autoActivate: true,
    autoDeactivate: true,
    validFrom: '',
    validTo: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      daysOfWeek: [],
      weekendOnly: false,
      barOnly: false,
      autoRevert: true,
      isActive: true,
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : null,
      validTo: formData.validTo ? new Date(formData.validTo).toISOString() : null,
    })
    setFormData({
      name: '',
      startTime: '17:00',
      endTime: '19:00',
      discountType: 'percent',
      discountValue: 20,
      autoActivate: true,
      autoDeactivate: true,
      validFrom: '',
      validTo: '',
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Power className="h-4 w-4" />
          Auto Activation & Deactivation
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
              placeholder="e.g., Scheduled Happy Hour"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time (Daily)</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time (Daily)</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              />
            </div>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="validFrom">Valid From (Optional)</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="validTo">Valid To (Optional)</Label>
              <Input
                id="validTo"
                type="date"
                value={formData.validTo}
                onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2 rounded-md bg-green-50 border border-green-200 p-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.autoActivate}
                onChange={(e) => setFormData({ ...formData, autoActivate: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-green-900">Auto Activate</span>
            </label>
            <p className="text-xs text-green-700 ml-6">
              Automatically activate offer at the start time
            </p>
            <label className="flex items-center gap-2 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={formData.autoDeactivate}
                onChange={(e) => setFormData({ ...formData, autoDeactivate: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm font-medium text-green-900">Auto Deactivate</span>
            </label>
            <p className="text-xs text-green-700 ml-6">
              Automatically deactivate offer at the end time
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Auto-Activation Rule'}
          </Button>
        </form>

        {rules && rules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Rules with Auto-Activation</h4>
            <div className="space-y-1 text-xs">
              {rules
                .filter((r) => r.autoActivate || r.autoDeactivate)
                .map((rule) => (
                  <div key={rule.id} className="border-b pb-1">
                    <div className="font-medium">{rule.name}</div>
                    <div className="text-gray-600 mt-1">
                      {rule.startTime} - {rule.endTime} | Activate: {rule.autoActivate ? 'ON' : 'OFF'} | Deactivate:{' '}
                      {rule.autoDeactivate ? 'ON' : 'OFF'}
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
