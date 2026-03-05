'use client'

import { useState, useEffect } from 'react'
import { Label } from '@/components/ui/label'
import { Hash } from 'lucide-react'

const PREFIX_MAP = { Asset: 1000, Liability: 2000, Income: 3000, Expense: 4000, Equity: 5000 }

export default function AccountCodeGenerator({ accountType, value, onChange, apiBase }) {
  const [suggested, setSuggested] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!apiBase || !accountType) {
      setSuggested(String(PREFIX_MAP[accountType] || 1000))
      return
    }
    setLoading(true)
    fetch(`${apiBase}/chart-of-accounts/next-code?accountType=${encodeURIComponent(accountType)}`, {
      headers: { Authorization: `Bearer ${typeof localStorage !== 'undefined' ? localStorage.getItem('token') : ''}` },
    })
      .then((r) => r.ok ? r.json() : { code: PREFIX_MAP[accountType] || 1000 })
      .then((data) => {
        setSuggested(data.code != null ? String(data.code) : String(PREFIX_MAP[accountType] || 1000))
        if (!value && data.code) onChange(String(data.code))
      })
      .catch(() => setSuggested(String(PREFIX_MAP[accountType] || 1000)))
      .finally(() => setLoading(false))
  }, [accountType, apiBase])

  return (
    <div>
      <Label className="text-gray-700 flex items-center gap-1">
        <Hash className="h-4 w-4" /> Account Code
      </Label>
      <div className="mt-1 flex gap-2">
        <input
          type="text"
          value={value ?? suggested}
          onChange={(e) => onChange(e.target.value)}
          placeholder={loading ? 'Loading...' : suggested}
          className="flex-1 rounded-xl border border-gray-300 px-3 py-2"
        />
        <button
          type="button"
          onClick={() => onChange(suggested)}
          className="rounded-xl bg-indigo-100 text-indigo-700 px-3 py-2 text-sm font-medium hover:bg-indigo-200"
        >
          Use {suggested}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Prefix: {accountType} → {PREFIX_MAP[accountType] || 1000}+
      </p>
    </div>
  )
}
