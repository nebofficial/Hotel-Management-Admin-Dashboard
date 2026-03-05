'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PaymentSplit from './PaymentSplit'

export default function SettlementPanel({
  grandTotal = 0,
  advancePaid = 0,
  advanceAdjusted = 0,
  netPayable = 0,
  payments = [],
  onPaymentsChange,
  onSettle,
  readonly,
}) {
  const balanced =
    Math.abs(
      Number(netPayable || 0) -
        payments.reduce((s, p) => s + Number(p.amount || 0), 0),
    ) < 0.5

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-red-500 to-rose-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Settlement & Refund</CardTitle>
        <p className="text-xs text-rose-100">
          Adjust advance, split payment and finalize the bill.
        </p>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-rose-50">Grand Total</span>
            <span className="font-semibold">
              ₹{Number(grandTotal || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-rose-50">Advance Paid</span>
            <span className="font-semibold">
              -₹{Number(advanceAdjusted || advancePaid || 0).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
              })}
            </span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Net Payable</span>
            <span>
              ₹{Number(netPayable || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <PaymentSplit
          netPayable={netPayable}
          payments={payments}
          onChange={onPaymentsChange}
          readonly={readonly}
        />

        <Button
          type="button"
          disabled={readonly || !balanced || netPayable <= 0}
          onClick={onSettle}
          className="w-full bg-white text-red-600 hover:bg-red-50 text-sm font-semibold mt-1"
        >
          {balanced ? 'Settle Bill & Generate Payment' : 'Adjust split to match Net Payable'}
        </Button>
      </CardContent>
    </Card>
  )
}

