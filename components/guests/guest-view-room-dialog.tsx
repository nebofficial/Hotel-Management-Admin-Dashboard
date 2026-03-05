"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BedDouble } from "lucide-react"

interface GuestViewRoomDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  guestName: string
  /** Room number or allocation description; when empty, show "No current allocation" */
  roomAllocation?: string | null
}

export function GuestViewRoomDialog({
  open,
  onOpenChange,
  guestName,
  roomAllocation,
}: GuestViewRoomDialogProps) {
  const hasRoom = roomAllocation && roomAllocation !== "—"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white shadow-xl" showCloseButton>
        <DialogHeader>
          <DialogTitle>View room allocation</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <p className="text-sm text-slate-600">
            <span className="font-medium text-slate-700">Guest:</span> {guestName}
          </p>
          <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <BedDouble className="h-8 w-8 text-indigo-500 shrink-0" />
            <div>
              <p className="text-xs font-medium text-slate-500">Current room allocation</p>
              <p className="text-sm font-semibold text-slate-900">
                {hasRoom ? `Room ${roomAllocation}` : "No current room allocation"}
              </p>
              {!hasRoom && (
                <p className="text-xs text-slate-500 mt-1">
                  Room allocation will appear here when the guest has an active booking.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
