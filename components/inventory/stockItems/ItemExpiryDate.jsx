'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Calendar, AlertTriangle } from 'lucide-react'

export default function ItemExpiryDate({ value, onChange }) {
  const today = new Date().toISOString().split('T')[0]
  const isExpired = value && new Date(value) < new Date()
  const isExpiringSoon = value && !isExpired && new Date(value) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-1.5">
      <Label htmlFor="expiry-date" className="flex items-center gap-2">
        Expiry Date
        {isExpired && <AlertTriangle className="h-3.5 w-3.5 text-red-600" />}
        {isExpiringSoon && <AlertTriangle className="h-3.5 w-3.5 text-orange-600" />}
      </Label>
      <div className="relative">
        <Input
          id="expiry-date"
          type="date"
          value={value ? new Date(value).toISOString().split('T')[0] : ''}
          onChange={(e) => onChange?.(e.target.value ? new Date(e.target.value).toISOString() : null)}
          min={today}
          className={`pr-10 ${isExpired ? 'border-red-300 bg-red-50' : isExpiringSoon ? 'border-orange-300 bg-orange-50' : ''}`}
        />
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {isExpired && <p className="text-xs text-red-600">This item has expired!</p>}
      {isExpiringSoon && !isExpired && <p className="text-xs text-orange-600">Expiring within 7 days</p>}
    </div>
  )
}
