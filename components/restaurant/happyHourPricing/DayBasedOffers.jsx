'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function DayBasedOffers({ rules, onSave, loading }) {
  const [formData, setFormData] = useState({
    name: '',
    daysOfWeek: [],
    weekendOnly: false,
    startTime: '17:00',
    endTime: '19:00',
    discountType: 'percent',
    discountValue: 20,
  })

  const handleDayToggle = (day) => {
    if (formData.weekendOnly) return
    setFormData({
      ...formData,
      daysOfWeek: formData.daysOfWeek.includes(day)
        ? formData.daysOfWeek.filter((d) => d !== day)
        : [...formData.daysOfWeek, day],
    })
  }

  const handleWeekendToggle = (checked) => {
    setFormData({
      ...formData,
      weekendOnly: checked,
      daysOfWeek: checked ? [] : formData.daysOfWeek,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.weekendOnly && formData.daysOfWeek.length === 0) {
      alert('Please select at least one day or enable weekend only')
      return
    }
    onSave({
      ...formData,
      daysOfWeek: formData.weekendOnly ? ['Sat', 'Sun'] : formData.daysOfWeek,
      barOnly: false,
      autoRevert: true,
      autoActivate: true,
      autoDeactivate: true,
      isActive: true,
    })
    setFormData({
      name: '',
      daysOfWeek: [],
      weekendOnly: false,
      startTime: '17:00',
      endTime: '19:00',
      discountType: 'percent',
      discountValue: 20,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="h-4 w-4" />
          Day-Based Offers
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
              placeholder="e.g., Weekday Special"
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

          <div>
            <Label>Select Days</Label>
            <div className="mt-2 space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.weekendOnly}
                  onChange={(e) => handleWeekendToggle(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm font-medium">Weekend Only (Sat & Sun)</span>
              </label>
              {!formData.weekendOnly && (
                <div className="grid grid-cols-4 gap-2 border rounded-md p-2">
                  {DAYS.map((day) => (
                    <label key={day} className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.daysOfWeek.includes(day)}
                        onChange={() => handleDayToggle(day)}
                        className="rounded"
                      />
                      <span className="text-xs">{day}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading || (!formData.weekendOnly && formData.daysOfWeek.length === 0)}
            className="w-full"
          >
            {loading ? 'Creating...' : 'Create Day-Based Offer'}
          </Button>
        </form>

        {rules && rules.length > 0 && (
          <div className="mt-6 space-y-2">
            <h4 className="text-sm font-semibold">Active Day-Based Rules</h4>
            <div className="space-y-1 text-xs">
              {rules
                .filter((r) => r.weekendOnly || (r.daysOfWeek && r.daysOfWeek.length > 0))
                .map((rule) => (
                  <div key={rule.id} className="flex justify-between border-b pb-1">
                    <span className="font-medium">{rule.name}</span>
                    <span className="text-gray-600">
                      {rule.weekendOnly
                        ? 'Weekends'
                        : rule.daysOfWeek && rule.daysOfWeek.length > 0
                          ? rule.daysOfWeek.join(', ')
                          : 'All days'}
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
