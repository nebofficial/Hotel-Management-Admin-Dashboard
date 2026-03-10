'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function CreateRatePlanModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [roomTypes, setRoomTypes] = useState('')
  const [basePrice, setBasePrice] = useState('')
  const [mealPlan, setMealPlan] = useState('room_only')
  const [isRefundable, setIsRefundable] = useState(true)
  const [nonRefundableDiscountPercent, setNonRefundableDiscountPercent] = useState('')
  const [minStayNights, setMinStayNights] = useState('')
  const [maxStayNights, setMaxStayNights] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setName('')
    setRoomTypes('')
    setBasePrice('')
    setMealPlan('room_only')
    setIsRefundable(true)
    setNonRefundableDiscountPercent('')
    setMinStayNights('')
    setMaxStayNights('')
  }

  const handleSave = async () => {
    if (!name || !basePrice) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.({
        name,
        roomTypes,
        basePrice: Number(basePrice),
        mealPlan,
        isRefundable,
        nonRefundableDiscountPercent: isRefundable ? null : Number(nonRefundableDiscountPercent || 0),
        minStayNights: minStayNights ? Number(minStayNights) : null,
        maxStayNights: maxStayNights ? Number(maxStayNights) : null,
      })
      reset()
      onClose?.()
    } catch (err) {
      console.error('Create rate plan modal error', err)
      setError(err?.message || 'Failed to create rate plan')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">Create Rate Plan</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Rate Plan Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="e.g. Standard Rate, Weekend Offer"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Room Type Assignment</Label>
            <Input
              value={roomTypes}
              onChange={(e) => setRoomTypes(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="Comma separated (Deluxe, Suite...)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Base Price</Label>
              <Input
                type="number"
                value={basePrice}
                onChange={(e) => setBasePrice(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="e.g. 4500"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Meal Plan</Label>
              <select
                value={mealPlan}
                onChange={(e) => setMealPlan(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white rounded-md px-2"
              >
                <option value="room_only">Room Only</option>
                <option value="breakfast">Breakfast Included</option>
                <option value="half_board">Half Board</option>
                <option value="full_board">Full Board</option>
              </select>
            </div>
          </div>
          {error && (
            <p className="text-[11px] text-red-100 bg-red-500/20 border border-red-300/60 rounded-md px-3 py-1.5">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Refund Policy</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsRefundable(true)}
                  className={`flex-1 h-8 rounded-full text-[11px] font-medium border ${
                    isRefundable
                      ? 'bg-white text-violet-700 border-white'
                      : 'bg-white/5 text-violet-100 border-white/40'
                  }`}
                >
                  Refundable
                </button>
                <button
                  type="button"
                  onClick={() => setIsRefundable(false)}
                  className={`flex-1 h-8 rounded-full text-[11px] font-medium border ${
                    !isRefundable
                      ? 'bg-white text-violet-700 border-white'
                      : 'bg-white/5 text-violet-100 border-white/40'
                  }`}
                >
                  Non-Refundable
                </button>
              </div>
            </div>
            {!isRefundable && (
              <div className="space-y-1">
                <Label className="text-[11px] text-violet-50">Non-Refundable Discount %</Label>
                <Input
                  type="number"
                  value={nonRefundableDiscountPercent}
                  onChange={(e) => setNonRefundableDiscountPercent(e.target.value)}
                  className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                  placeholder="e.g. 15"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Minimum Stay (nights)</Label>
              <Input
                type="number"
                value={minStayNights}
                onChange={(e) => setMinStayNights(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="e.g. 1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Maximum Stay (nights)</Label>
              <Input
                type="number"
                value={maxStayNights}
                onChange={(e) => setMaxStayNights(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="optional"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => {
              reset()
              onClose?.()
            }}
            className="h-8 px-3 rounded-full text-[11px] font-medium border border-white/30 text-violet-50 bg-transparent hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!name || !basePrice || saving}
            onClick={handleSave}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-violet-700 bg-white hover:bg-violet-50 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Plan'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

