'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export function EditRoleModal({ open, onOpenChange, role, onSubmit }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (role && open) {
      setName(role.name || '')
      setDescription(role.description || '')
    }
  }, [role, open])

  const handleSave = async () => {
    if (!role) return
    setSaving(true)
    try {
      await onSubmit?.(role.id, { name, description })
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Edit Role</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Role Name</Label>
            <Input
              className="h-8 text-xs"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Description</Label>
            <Textarea
              className="text-xs"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="button" size="sm" className="h-8 text-xs" disabled={saving || !role} onClick={handleSave}>
              {saving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

