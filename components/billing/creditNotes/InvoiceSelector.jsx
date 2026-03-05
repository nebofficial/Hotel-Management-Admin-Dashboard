'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function InvoiceSelector({ invoices = [], onSearch, onSelect }) {
  const [invoiceNumber, setInvoiceNumber] = useState('')

  const handleSearch = () => {
    onSearch?.({ invoiceNumber: invoiceNumber.trim() || undefined })
  }

  return (
    <Card className="border border-blue-200 bg-gradient-to-br from-blue-50/80 to-sky-50/80">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-900">Select Original Invoice</h3>
        <p className="text-xs text-slate-600">Search invoice to generate a credit note.</p>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-2">
        <div className="flex gap-2">
          <Input
            placeholder="Invoice number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
            className="h-8 text-xs"
          />
          <Button type="button" size="sm" onClick={handleSearch}>
            Search
          </Button>
        </div>
        <div className="max-h-40 overflow-y-auto border border-slate-200/70 rounded-md bg-white/80 mt-2">
          {invoices.length === 0 && (
            <p className="text-xs text-slate-500 px-3 py-2">
              No invoices loaded. Search by invoice number.
            </p>
          )}
          {invoices.map((inv) => {
            const remaining = Number(inv.totalAmount || 0) - Number(inv.creditedAmount || 0)
            return (
              <button
                key={inv.id}
                type="button"
                onClick={() => onSelect?.(inv)}
                className="w-full text-left px-3 py-1.5 border-b border-slate-100 last:border-b-0 hover:bg-blue-50/70 text-xs"
              >
                <div className="font-medium text-slate-900">
                  {inv.invoiceNumber} – {inv.guestName}
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>{inv.issueDate}</span>
                  <span>
                    Total ₹{Number(inv.totalAmount || 0).toFixed(2)} • Remaining ₹{remaining.toFixed(2)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

