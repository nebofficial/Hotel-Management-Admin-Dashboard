'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

export default function ApprovalWorkflowPanel({ requiresApproval, approved, onRequestApproval }) {
  return (
    <Card className="border border-indigo-200 bg-gradient-to-br from-indigo-50/80 to-slate-50/80">
      <CardHeader className="pb-2 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Approval Workflow</h3>
          <p className="text-xs text-slate-600">
            High-value and full cancellations may require manager approval.
          </p>
        </div>
        <ShieldCheck className="w-4 h-4 text-indigo-600" />
      </CardHeader>
      <CardContent className="p-3 pt-0 text-sm">
        {requiresApproval ? (
          <div className="space-y-2">
            <p className="text-xs text-amber-700">
              Manager approval required before processing this refund.
            </p>
            <Button type="button" size="sm" onClick={onRequestApproval} disabled={approved}>
              {approved ? 'Approved' : 'Request Approval'}
            </Button>
          </div>
        ) : (
          <p className="text-xs text-emerald-700">No manager approval required for this refund.</p>
        )}
      </CardContent>
    </Card>
  )
}

