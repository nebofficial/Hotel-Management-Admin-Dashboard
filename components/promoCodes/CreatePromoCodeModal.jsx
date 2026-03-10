'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { RoomTypeRestrictionSelector } from './RoomTypeRestrictionSelector'

export function CreatePromoCodeModal({ open, onClose, onSave }) {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [discountType, setDiscountType] = useState('percentage')
  const [discountValue, setDiscountValue] = useState('')
  const [minOrderValue, setMinOrderValue] = useState('')
  const [maxUses, setMaxUses] = useState('')
  const [maxUsesPerUser, setMaxUsesPerUser] = useState('1')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [roomTypes, setRoomTypes] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setCode('')
    setName('')
    setDiscountType('percentage')
    setDiscountValue('')
    setMinOrderValue('')
    setMaxUses('')
    setMaxUsesPerUser('1')
    setStartDate('')
    setEndDate('')
    setRoomTypes([])
    setError(null)
  }

  const handleSave = async () => {
    if (!code || !name || !discountValue) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.({
        code: code.trim().toUpperCase(),
        name: name.trim(),
        discountType,
        discountValue: Number(discountValue),
        minOrderValue: minOrderValue ? Number(minOrderValue) : null,
        maxUses: maxUses ? Number(maxUses) : null,
        maxUsesPerUser: maxUsesPerUser ? Number(maxUsesPerUser) : 1,
        startDate: startDate || null,
        endDate: endDate || null,
        roomTypes,
        isActive: true,
      })
      reset()
      onClose?.()
    } catch (err) {
      console.error('Create promo modal error', err)
      setError(err?.message || 'Failed to create promo code')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">Create Promo Code</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Promo Code</Label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="e.g. SAVE20"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Name</Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="e.g. Summer Sale"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Discount Type</Label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white rounded-md px-2"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">
                {discountType === 'percentage' ? 'Discount %' : 'Discount (₹)'}
              </Label>
              <Input
                type="number"
                value={discountValue}
                onChange={(e) => setDiscountValue(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder={discountType === 'percentage' ? '20' : '500'}
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Minimum Booking Amount (₹)</Label>
            <Input
              type="number"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="Optional"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Max Total Uses</Label>
              <Input
                type="number"
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="Unlimited"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Uses Per User</Label>
              <Input
                type="number"
                value={maxUsesPerUser}
                onChange={(e) => setMaxUsesPerUser(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="1"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white"
              />
            </div>
          </div>
          <RoomTypeRestrictionSelector
            value={roomTypes}
            onChange={setRoomTypes}
            labelClassName="text-[11px] text-violet-50"
            hintClassName="text-[10px] text-violet-200"
            inputClassName="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
          />
          {error && (
            <p className="text-[11px] text-red-100 bg-red-500/20 border border-red-300/60 rounded-md px-3 py-1.5">
              {error}
            </p>
          )}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => { reset(); onClose?.() }}
            className="h-8 px-3 rounded-full text-[11px] font-medium border border-white/30 text-violet-50 bg-transparent hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!code || !name || !discountValue || saving}
            onClick={handleSave}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-violet-700 bg-white hover:bg-violet-50 disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create Promo'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
