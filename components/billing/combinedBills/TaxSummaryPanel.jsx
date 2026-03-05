'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function TaxSummaryPanel({ tax }) {
  const t = tax || {}

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-yellow-50/80 to-amber-50/70">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Tax Consolidation</h3>
        <p className="text-xs text-slate-600">Combined GST and service charges from all bills</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Taxable Amount</span>
          <span>₹{Number(t.taxableAmount || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">CGST</span>
          <span>₹{Number(t.cgst || 0).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">SGST</span>
          <span>₹{Number(t.sgst || 0).toFixed(2)}</span>
        </div>
        {Number(t.igst || 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-600">IGST</span>
            <span>₹{Number(t.igst || 0).toFixed(2)}</span>
          </div>
        )}
        {Number(t.serviceCharge || 0) > 0 && (
          <div className="flex justify-between">
            <span className="text-slate-600">Service Charge</span>
            <span>₹{Number(t.serviceCharge || 0).toFixed(2)}</span>
          </div>
        )}
        {Number(t.roundOff || 0) !== 0 && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Round-off</span>
            <span>₹{Number(t.roundOff || 0).toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between pt-2 border-t border-slate-200 mt-1 font-semibold">
          <span>Total Tax</span>
          <span>₹{Number(t.totalTax || t.cgst + t.sgst + t.igst || 0).toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}

