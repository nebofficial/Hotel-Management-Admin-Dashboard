'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import PaymentStatusBadge from './PaymentStatusBadge'

export default function InvoiceHistory({ apiBase, lastCreated }) {
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')

  const load = async () => {
    if (!apiBase) return
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (status) params.set('status', status)
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiBase}/invoices?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setInvoices(data.invoices || [])
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase, lastCreated])

  return (
    <Card className="border border-gray-200 shadow-xs rounded-2xl">
      <CardHeader className="pb-3 px-3">
        <CardTitle className="text-sm font-semibold">Invoice History</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-3 text-sm">
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <Label className="text-xs text-gray-700">Search</Label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={load}
              className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1"
              placeholder="Invoice no. / guest"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-700">Status</Label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value)
                setTimeout(load, 0)
              }}
              className="mt-1 w-full rounded-lg border border-gray-300 px-2 py-1"
            >
              <option value="">All</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-[320px] overflow-y-auto">
          {invoices.map((inv) => (
            <div
              key={inv.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900">{inv.invoiceNumber}</p>
                <p className="text-xs text-gray-600">
                  {inv.guestName} • {inv.issueDate}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-semibold text-gray-900">
                  ${Number(inv.totalAmount || 0).toFixed(2)}
                </p>
                <PaymentStatusBadge status={inv.status} />
              </div>
            </div>
          ))}
          {invoices.length === 0 && (
            <p className="text-xs text-gray-500 px-1">No invoices found.</p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

