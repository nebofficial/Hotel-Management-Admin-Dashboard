'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function CreateEmailCampaignModal({ open, onClose, onSave }) {
  const [name, setName] = useState('')
  const [subject, setSubject] = useState('')
  const [segment, setSegment] = useState('All guests')
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const reset = () => {
    setName('')
    setSubject('')
    setSegment('All guests')
    setContent('')
    setError(null)
  }

  const handleSave = async (mode) => {
    if (!name) return
    setSaving(true)
    try {
      setError(null)
      await onSave?.({
        name,
        subject,
        segment,
        content,
        status: mode === 'draft' ? 'draft' : 'active',
      })
      reset()
      onClose?.()
    } catch (err) {
      console.error('Create email campaign modal error', err)
      setError(err?.message || 'Failed to create email campaign')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(openVal) => !openVal && onClose?.()}>
      <DialogContent className="max-w-xl bg-gradient-to-br from-purple-600 via-violet-600 to-indigo-700 text-slate-50 border-0">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold text-white">Create Email Campaign</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Campaign Name</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="e.g. Summer Offer, Welcome Campaign"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px] text-violet-50">Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-8 text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200"
              placeholder="Subject line of the email"
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
            <Label className="text-[11px] text-violet-50">Message Content</Label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full text-xs bg-white/10 border-white/30 text-white placeholder:text-violet-200 rounded-md p-2 resize-y"
              placeholder="Write your email content here..."
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
            disabled={!name || saving}
            onClick={() => handleSave('draft')}
            className="h-8 px-4 rounded-full text-[11px] font-medium text-violet-700 bg-white hover:bg-violet-50 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            disabled={!name || saving}
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

