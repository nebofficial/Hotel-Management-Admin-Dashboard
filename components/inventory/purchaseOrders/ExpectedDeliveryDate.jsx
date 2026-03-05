'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar, Clock } from 'lucide-react'

export default function ExpectedDeliveryDate({ value, onChange }) {
  const today = new Date().toISOString().split('T')[0]
  const isOverdue = value && new Date(value) < new Date()
  const daysUntil = value ? Math.ceil((new Date(value) - new Date()) / (1000 * 60 * 60 * 24)) : null

  return (
    <div className="space-y-1.5">
      <Label htmlFor="expected-delivery" className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-slate-600" />
        Expected Delivery Date
      </Label>
      <div className="relative">
        <Input
          id="expected-delivery"
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange?.(e.target.value ? new Date(e.target.value).toISOString() : null)}
          min={today}
          className={`pr-10 ${isOverdue ? 'border-red-300 bg-red-50' : ''}`}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {isOverdue && <p className="text-xs text-red-600">Delivery date has passed!</p>}
      {daysUntil !== null && !isOverdue && daysUntil <= 7 && (
        <p className="text-xs text-orange-600">Delivery expected in {daysUntil} day(s)</p>
      )}
    </div>
  )
}
