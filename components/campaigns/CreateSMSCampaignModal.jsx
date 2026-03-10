'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function CreateSMSCampaignModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [segment, setSegment] = useState('All guests')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setName('')
    setSegment('All guests')
    setContent('')
    setError(null)
  }

  const handleSave = async (mode) => {
    if (!name || !content) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.({
        name,
        segment,
        content,
        status: mode === 'draft' ? 'draft' : 'active',
      })
      reset()
      onClose?.()
    } catch (err) {
      console.error('Create SMS campaign modal error', err)
      setError(err?.message || 'Failed to create SMS campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">Create SMS Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Campaign Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="e.g. Flash Sale, Last Minute Offer"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Target Segment</Label>
            <Input
              value={segment}
              onChange={(e) => setSegment(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="e.g. All guests, VIP guests, Repeat guests"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">SMS Content</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="w-full text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200 rounded-md p-2 resize-y"
              placeholder="Write your SMS content (keep it concise)..."
            />
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
            disabled={!name || !content || saving}
            onClick={() => handleSave('draft')}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-violet-700 bg-white hover:bg-violet-50 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={!name || !content || saving}
            onClick={() => handleSave('send')}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-white bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60"
          >
            {saving ? 'Sending...' : 'Send Now'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

