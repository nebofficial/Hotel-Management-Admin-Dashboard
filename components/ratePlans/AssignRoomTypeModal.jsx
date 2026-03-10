'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function AssignRoomTypeModal({ open, plan, onClose, onSave }) {
  const [roomTypes, setRoomTypes] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!plan) return
    setRoomTypes((plan.roomTypes || []).join(', '))
  }, [plan])

  const handleSave = async () => {
    if (!plan) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.(plan.id, roomTypes)
      onClose?.()
    } catch (err) {
      console.error('Assign room types modal error', err)
      setError(err?.message || 'Failed to assign room types')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-md bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">Assign Room Types</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 text-xs">
          <p className="text-[11px] text-amber-50/90">
            Assign this rate plan to one or more room types. Enter names separated by commas.
          </p>
          <div className="space-y-1">
            <Label className="text-[11px] text-amber-50">Room Types</Label>
            <Input
              value={roomTypes}
              onChange={(e) => setRoomTypes(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-amber-200"
              placeholder="Deluxe, Suite, Standard..."
            />
          </div>
        </div>
        {error && (
          <p className="text-[11px] text-red-100 bg-red-500/20 border border-red-300/60 rounded-md px-3 py-1.5 mt-2">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            onClick={() => onClose?.()}
            className="h-8 px-3 rounded-full text-[11px] font-medium border border-white/30 text-amber-50 bg-transparent hover:bg-white/10"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!plan || saving}
            onClick={handleSave}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-amber-700 bg-white hover:bg-amber-50 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Assignment'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

