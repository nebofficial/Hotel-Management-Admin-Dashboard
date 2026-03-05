'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Filter } from 'lucide-react'

export default function CategoryFilter({ categories, selected, onSelect }) {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-2xl shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-900 text-base">
          <Filter className="h-5 w-5" />
          Category Filter
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Label className="text-gray-700 text-sm">Select Category</Label>
        <select value={selected} onChange={(e) => onSelect(e.target.value)} className="w-full mt-1 rounded-xl border border-gray-300 px-3 py-2">
          <option value="">All Categories</option>
          {(categories || []).map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </CardContent>
    </Card>
  )
}
