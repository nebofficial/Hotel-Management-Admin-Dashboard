'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { useMemo } from 'react'
import { Banknote } from 'lucide-react'

export default function BankBookCard({ accounts, selectedId, onSelect }) {
  const bankAccounts = (accounts || []).filter((a) => a.type === 'BANK')
  const selected = useMemo(() => bankAccounts.find((a) => a.id === selectedId) || bankAccounts[0], [bankAccounts, selectedId])
  const balance = Number(selected?.currentBalance || selected?.openingBalance || 0)

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Banknote className="h-5 w-5" />
          Bank Book
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Label className="text-xs text-indigo-100">Bank Account</Label>
          <select
            value={selected?.id || ''}
            onChange={(e) => onSelect?.(e.target.value)}
            className="mt-1 w-full rounded-xl border border-indigo-200 bg-white/10 px-3 py-2 text-sm text-white"
          >
            {bankAccounts.map((a) => (
              <option key={a.id} value={a.id} className="text-gray-900">
                {a.name} {a.accountNumber ? `· ${a.accountNumber}` : ''}
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <div>
            <p className="text-xs text-indigo-100">Current Balance</p>
            <p className="text-3xl font-bold">${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
