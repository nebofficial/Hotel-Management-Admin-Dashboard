'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'

export default function WeekendSpecials({ rules, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    startTime: '17:00',
    endTime: '19:00',
    discountType: 'percent',
    discountValue: 25,
    weekendOnly: true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      daysOfWeek: ['Sat', 'Sun'],
      barOnly: false,
      autoRevert: true,
      autoActivate: true,
      autoDeactivate: true,
      isActive: true,
    })
    setFormData({
      name: '',
      startTime: '17:00',
      endTime: '19:00',
      discountType: 'percent',
      discountValue: 25,
      weekendOnly: true,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Weekend Specials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Weekend Special Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Saturday Night Special"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
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

          <div className="rounded-md bg-purple-50 border border-purple-200 p-3">
            <p className="text-sm font-medium text-purple-900">Weekend Only Pricing</p>
            <p className="text-xs text-purple-700 mt-1">
              This offer will automatically apply on Saturdays and Sundays only
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Weekend Special'}
          </Button>
        </form>

        {rules && rules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Active Weekend Specials</h4>
            <div className="space-y-1 text-xs">
              {rules
                .filter((r) => r.weekendOnly)
                .map((rule) => (
                  <div key={rule.id} className="flex justify-between border-b pb-1">
                    <span className="font-medium">{rule.name}</span>
                    <span className="text-gray-600">
                      Sat & Sun: {rule.startTime} - {rule.endTime} ({rule.discountValue}
                      {rule.discountType === 'percent' ? '%' : '₹'})
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
