'use client'

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/app/auth-context'
import { assignRoleToStaff } from '@/services/api/rolesPermissionsApi'

function getApiBaseUrl() {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
}

export function AssignRoleToStaffModal({ open, onOpenChange, roles }) {
  const { hotel } = useAuth()
  const [staffId, setStaffId] = useState('')
  const [roleId, setRoleId] = useState('')
  const [saving, setSaving] = useState(false)

  const apiBase = hotel?.id ? `${getApiBaseUrl()}/api/hotel-data/${hotel.id}` : ''

  useEffect(() => {
    if (!open) {
      setStaffId('')
      setRoleId('')
    }
  }, [open])

  const handleAssign = async () => {
    if (!apiBase || !staffId || !roleId) return
    setSaving(true)
    try {
      await assignRoleToStaff(apiBase, { staffId, roleId })
      onOpenChange(false)
    } catch {
      // error display can be added
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Assign Role to Staff</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 text-xs">
          <div className="space-y-1">
            <Label className="text-[11px]">Staff ID</Label>
            <Input
              className="h-8 text-xs"
              placeholder="Enter staff user ID"
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[11px]">Role</Label>
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="h-8 text-xs">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {(roles || []).map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end pt-1">
            <Button
              type="button"
              size="sm"
              className="h-8 text-xs"
              disabled={saving || !staffId || !roleId}
              onClick={handleAssign}
            >
              {saving ? 'Assigning…' : 'Assign Role'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

