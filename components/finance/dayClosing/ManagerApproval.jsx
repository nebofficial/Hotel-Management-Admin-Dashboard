'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function ManagerApproval({ closing, onApprove, onReject, locked }) {
  const status = closing?.status || 'OPEN'
  const requiresApproval = closing?.hasMismatch

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500 to-blue-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Manager Approval</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-sky-100">Current Status</p>
            <p className="font-semibold text-sm">
              {status === 'CLOSED'
                ? 'Closed'
                : status === 'PENDING_APPROVAL'
                ? 'Pending Approval'
                : 'Open'}
            </p>
          </div>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
              status === 'CLOSED'
                ? 'bg-emerald-100 text-emerald-700'
                : status === 'PENDING_APPROVAL'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {status}
          </span>
        </div>
        {requiresApproval ? (
          <p className="text-[11px] text-sky-100">
            Cash mismatch detected. Manager approval required to close the day.
          </p>
        ) : (
          <p className="text-[11px] text-sky-100">
            No mismatch detected. You can close and lock the day directly.
          </p>
        )}
        <div className="space-y-1">
          <Label className="text-[11px] text-sky-50">Digital Signature / PIN (conceptual)</Label>
          <input
            type="password"
            disabled={locked}
            placeholder="Manager PIN"
            className="w-full rounded-lg border border-sky-200 px-2 py-1 text-xs text-sky-900 bg-white/90"
          />
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            disabled={locked}
            onClick={onApprove}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
          >
            Approve & Close
          </Button>
          {requiresApproval && (
            <Button
              size="sm"
              disabled={locked}
              onClick={onReject}
              variant="outline"
              className="flex-1 border-white/70 text-white text-xs bg-white/10 hover:bg-white/20"
            >
              Reject
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

