'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BRSStatement({ data }) {
  if (!data) {
    return (
      <Card className="border-0 shadow-md rounded-2xl bg-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold text-gray-800">Bank Reconciliation Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Select a bank account to generate BRS.</p>
        </CardContent>
      </Card>
    )
  }

  const book = Number(data.bookBalance || 0)
  const adjusted = Number(data.adjustedBalance || 0)

  return (
    <Card className="border-0 shadow-md rounded-2xl bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-800">Bank Reconciliation Statement</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span>Book balance</span>
          <span className="font-semibold">${book.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div>
          <p className="font-semibold mb-1">Less: Unpresented cheques</p>
          <ul className="list-disc list-inside text-xs text-gray-700 max-h-20 overflow-y-auto">
            {(data.unpresentedCheques || []).map((e) => (
              <li key={e.id}>{e.date}: {e.description || e.referenceNo} - ${Number(e.amount || 0).toFixed(2)}</li>
            ))}
            {(!data.unpresentedCheques || !data.unpresentedCheques.length) && <li>None</li>}
          </ul>
        </div>
        <div>
          <p className="font-semibold mb-1">Add: Uncredited deposits</p>
          <ul className="list-disc list-inside text-xs text-gray-700 max-h-20 overflow-y-auto">
            {(data.uncreditedDeposits || []).map((e) => (
              <li key={e.id}>{e.date}: {e.description || e.referenceNo} - ${Number(e.amount || 0).toFixed(2)}</li>
            ))}
            {(!data.uncreditedDeposits || !data.uncreditedDeposits.length) && <li>None</li>}
          </ul>
        </div>
        <div className="flex items-center justify-between border-t pt-2">
          <span>Adjusted bank balance</span>
          <span className="font-semibold">${adjusted.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
      </CardContent>
    </Card>
  )
}
