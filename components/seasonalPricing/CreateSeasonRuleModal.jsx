'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function CreateSeasonRuleModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [roomTypes, setRoomTypes] = useState('')
  const [adjustmentPercent, setAdjustmentPercent] = useState('')
  const [adjustmentType, setAdjustmentType] = useState('increase')
  const [ruleType, setRuleType] = useState('season')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setName('')
    setStartDate('')
    setEndDate('')
    setRoomTypes('')
    setAdjustmentPercent('')
    setAdjustmentType('increase')
    setRuleType('season')
    setError(null)
  }

  const handleSave = async () => {
    if (!name || !startDate || !endDate || !adjustmentPercent) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.({
        name,
        startDate,
        endDate,
        roomTypes,
        adjustmentPercent: Number(adjustmentPercent),
        adjustmentType,
        ruleType,
        isActive: true,
      })
      reset()
      onClose?.()
    } catch (err) {
      console.error('Create season rule modal error', err)
      setError(err?.message || 'Failed to create seasonal pricing rule')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-lg bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">
            Create Seasonal Pricing Rule
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Season Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="e.g. Winter Peak, Christmas, Weekend Boost"
            />
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
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Room Type Assignment</Label>
            <Input
              value={roomTypes}
              onChange={(e) => setRoomTypes(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="Comma separated (Deluxe, Suite...)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Price Adjustment %</Label>
              <Input
                type="number"
                value={adjustmentPercent}
                onChange={(e) => setAdjustmentPercent(e.target.value)}
                className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
                placeholder="e.g. 20"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-[11px] text-violet-50">Pricing Type</Label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdjustmentType('increase')}
                  className={`flex-1 h-8 rounded-full text-[11px] font-medium border ${
                    adjustmentType === 'increase'
                      ? 'bg-white text-violet-700 border-white'
                      : 'bg-white/5 text-violet-100 border-white/40'
                  }`}
                >
                  Increase
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustmentType('discount')}
                  className={`flex-1 h-8 rounded-full text-[11px] font-medium border ${
                    adjustmentType === 'discount'
                      ? 'bg-white text-violet-700 border-white'
                      : 'bg-white/5 text-violet-100 border-white/40'
                  }`}
                >
                  Discount
                </button>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Rule Type</Label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white rounded-md px-2"
            >
              <option value="season">Season</option>
              <option value="holiday">Holiday</option>
              <option value="weekend">Weekend</option>
              <option value="dynamic">Dynamic</option>
            </select>
          </div>
          {error && (
            <p className="text-[11px] text-red-100 bg-red-500/20 border border-red-300/60 rounded-md px-3 py-1.5">
              {error}
            </p>
          )}
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
            disabled={!name || !startDate || !endDate || !adjustmentPercent || saving}
            onClick={handleSave}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-violet-700 bg-white hover:bg-violet-50 disabled:opacity-60"
          >
            {saving ? 'Creating...' : 'Create Rule'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

