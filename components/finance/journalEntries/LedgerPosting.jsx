'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function LedgerPosting({ autoPost, onToggle, totalDebit, totalCredit }) {
  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Ledger Posting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <Label className="text-xs text-purple-50">Auto Post to Ledger</Label>
          <button
            type="button"
            onClick={() => onToggle(!autoPost)}
            className={`w-10 h-5 rounded-full flex items-center px-1 ${
              autoPost ? 'bg-white' : 'bg-purple-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-purple-600 transition-transform ${
                autoPost ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
        <p className="text-xs text-purple-100">
          When enabled, this journal will be treated as posted to the general ledger and reflected in
          financial reports (Trial Balance, P&L, Balance Sheet).
        </p>
        <div className="bg-white/10 rounded-xl p-2 text-xs space-y-1">
          <p>
            <span className="text-purple-100 mr-1">Total Debit:</span>
            <span className="font-semibold">
              ₹{Number(totalDebit || 0).toFixed(2)}
            </span>
          </p>
          <p>
            <span className="text-purple-100 mr-1">Total Credit:</span>
            <span className="font-semibold">
              ₹{Number(totalCredit || 0).toFixed(2)}
            </span>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

