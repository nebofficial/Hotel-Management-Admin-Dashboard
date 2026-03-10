'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function CreateRoleModal({ open, onOpenChange, onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!name || !description) return
    setSaving(true)
    try {
      await onSubmit?.({ name, description })
      setName('')
      setDescription('')
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Create Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Role Name</Label>
            <Input
              className="h-8 text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Front Office Manager"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Description</Label>
            <Textarea
              className="text-xs"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of this role"
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" className="h-8 text-xs" disabled={saving || !name || !description} onClick={handleSave}>
              {saving ? 'Saving…' : 'Create Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

