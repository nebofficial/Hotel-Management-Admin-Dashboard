'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

export default function ApprovalWorkflowPanel({ approvalRequired, totalCharge, existingApproval, onRequest }) {
  const [managerName, setManagerName] = useState('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (existingApproval) {
      setManagerName(existingApproval.managerName || '')
      setReason(existingApproval.reason || '')
    }
  }, [existingApproval])

  const status = existingApproval?.status || (approvalRequired ? 'PENDING' : 'NOT_REQUIRED')

  const handleRequest = () => {
    onRequest?.({
      managerName,
      reason,
    })
  }

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-white text-lg">
          <ShieldCheck className="h-5 w-5" />
          Approval Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="bg-white/10 backdrop-blur-sm rounded-t-2xl pt-4 text-xs space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-white/80">Total Adjustment Charge</div>
            <div className="font-semibold text-sm">₹{Number(totalCharge || 0).toFixed(2)}</div>
          </div>
          <div className="text-right text-[11px]">
            <div className="text-white/80">Approval Status</div>
            <div className="font-semibold">
              {status === 'PENDING'
                ? 'Pending'
                : status === 'APPROVED'
                ? 'Approved'
                : status === 'REJECTED'
                ? 'Rejected'
                : 'Not Required'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-white/90">Manager Name</Label>
            <Input
              value={managerName}
              onChange={(e) => setManagerName(e.target.value)}
              className="mt-1 bg-white/15 text-white border-white/20 h-9 text-xs"
              placeholder="Manager approving"
            />
          </div>
          <div>
            <Label className="text-white/90">Reason</Label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 bg-white/15 text-white border-white/20 h-9 text-xs"
              placeholder="Reason for adjustment"
            />
          </div>
        </div>

        <Button
          type="button"
          disabled={!approvalRequired || !managerName}
          onClick={handleRequest}
          className="w-full h-9 bg-white text-amber-700 hover:bg-amber-50 font-semibold text-xs"
        >
          {existingApproval && existingApproval.status === 'PENDING' ? 'Update Approval Request' : 'Request Approval'}
        </Button>
        {!approvalRequired && (
          <p className="text-[11px] text-yellow-100 text-center">
            Approval not required for this adjustment based on current rules.
          </p>
        )}
      </CardContent>
    </Card>
  )
}

