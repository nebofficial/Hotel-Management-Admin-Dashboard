'use client'

import { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'

export default function AutoInvoiceNumber({ apiBase, value, onChange }) {
  const [loading, setLoading] = useState(false)

  const fetchNext = async () => {
    if (!apiBase) return
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const year = new Date().getFullYear()
      const res = await fetch(`${apiBase}/invoices/next-number?year=${year}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.invoiceNumber) {
        onChange?.(data.invoiceNumber)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!value) {
      fetchNext()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBase])

  return (
    <div>
      <Label className="text-xs text-emerald-50">Invoice Number</Label>
      <div className="mt-1 flex items-center gap-2">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
        />
        <button
          type="button"
          disabled={loading}
          onClick={fetchNext}
          className="text-xs px-2 py-1 rounded-lg border border-emerald-300 text-emerald-900 bg-white"
        >
          {loading ? '...' : 'Auto'}
        </button>
      </div>
    </div>
  )
}

