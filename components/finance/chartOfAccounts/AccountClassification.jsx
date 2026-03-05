'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Layers } from 'lucide-react'

const BADGES = [
  { type: 'Asset', color: 'bg-green-100 text-green-800 border-green-300' },
  { type: 'Liability', color: 'bg-red-100 text-red-800 border-red-300' },
  { type: 'Income', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { type: 'Expense', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { type: 'Equity', color: 'bg-purple-100 text-purple-800 border-purple-300' },
]

export default function AccountClassification({ accounts, selectedType, onSelectType }) {
  const counts = (accounts || []).reduce((acc, a) => {
    acc[a.accountType] = (acc[a.accountType] || 0) + 1
    return acc
  }, {})

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-purple-900 text-base flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Account Classification
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-600 mb-2">Filter by type</p>
        <div className="flex flex-wrap gap-2">
          {BADGES.map((b) => (
            <button
              key={b.type}
              type="button"
              onClick={() => onSelectType(selectedType === b.type ? null : b.type)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all ${b.color} ${selectedType === b.type ? 'ring-2 ring-offset-1 ring-purple-400' : 'hover:opacity-90'}`}
            >
              {b.type}
              <span className="text-xs opacity-80">({counts[b.type] || 0})</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
