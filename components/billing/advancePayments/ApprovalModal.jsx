'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AlertTriangle } from 'lucide-react'

export default function ApprovalModal({ open, onClose, message, onApprove, loading }) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const pin = e.target.pin?.value
    onApprove?.({ managerApproved: true, managerPin: pin })
    onClose?.()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="w-5 h-5" />
            Manager Approval
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-slate-700 mb-2">{message}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Manager PIN (optional)</Label>
            <Input name="pin" type="password" className="mt-1" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Approving...' : 'Approve'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

