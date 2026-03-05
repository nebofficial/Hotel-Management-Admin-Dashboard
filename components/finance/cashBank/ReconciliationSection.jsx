'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function ReconciliationSection({ data, onMarkReconciled }) {
  const diff = Number(data?.difference || 0)
  const hasMismatch = Math.abs(diff) > 0.01

  const handleMark = () => {
    const ids = [...(data?.unpresentedCheques || []), ...(data?.uncreditedDeposits || [])].map((e) => e.id)
    if (!ids.length || !onMarkReconciled) return
    onMarkReconciled(ids)
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-red-900 text-base flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Reconciliation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {data ? (
          <>
            <div className="flex items-center justify-between">
              <span>Book balance</span>
              <span className="font-semibold">${Number(data.bookBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Adjusted balance</span>
              <span className="font-semibold">${Number(data.adjustedBalance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Difference</span>
              <span className={`font-semibold ${hasMismatch ? 'text-red-700' : 'text-green-700'}`}>
                ${diff.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Unpresented cheques</p>
              <ul className="text-xs list-disc list-inside text-gray-700 max-h-16 overflow-y-auto">
                {(data.unpresentedCheques || []).map((e) => (
                  <li key={e.id}>{e.date}: {e.description || e.referenceNo} - ${Number(e.amount || 0).toFixed(2)}</li>
                ))}
                {(!data.unpresentedCheques || !data.unpresentedCheques.length) && <li>None</li>}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold mb-1">Uncredited deposits</p>
              <ul className="text-xs list-disc list-inside text-gray-700 max-h-16 overflow-y-auto">
                {(data.uncreditedDeposits || []).map((e) => (
                  <li key={e.id}>{e.date}: {e.description || e.referenceNo} - ${Number(e.amount || 0).toFixed(2)}</li>
                ))}
                {(!data.uncreditedDeposits || !data.uncreditedDeposits.length) && <li>None</li>}
              </ul>
            </div>
            <Button
              size="sm"
              onClick={handleMark}
              disabled={!hasMismatch}
              className="w-full bg-red-600 hover:bg-red-700 text-white text-xs mt-1"
            >
              Mark as reconciled
            </Button>
          </>
        ) : (
          <p className="text-sm text-gray-600">Select a bank account to view reconciliation details.</p>
        )}
      </CardContent>
    </Card>
  )
}
