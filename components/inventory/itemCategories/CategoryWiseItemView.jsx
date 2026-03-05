'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Filter } from 'lucide-react'

export default function CategoryWiseItemView({
  categories = [],
  items = [],
  selectedCategoryId,
  onSelectCategory,
}) {
  const selectedCategory = useMemo(
    () => categories.find((c) => c.id === selectedCategoryId) || null,
    [categories, selectedCategoryId],
  )

  const filtered = useMemo(() => {
    if (!selectedCategory) return []
    return items.filter((it) => {
      // Backward compatibility: InventoryItem currently stores a string "category"
      return (
        (it.categoryId && String(it.categoryId) === String(selectedCategory.id)) ||
        (it.category && String(it.category) === String(selectedCategory.name))
      )
    })
  }, [items, selectedCategory])

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <Filter className="h-5 w-5 text-emerald-600" />
          Category-wise Item View
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="category-filter">Select Category</Label>
          <select
            id="category-filter"
            value={selectedCategoryId || ''}
            onChange={(e) => onSelectCategory?.(e.target.value || null)}
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="">Choose…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.parentId ? '↳ ' : ''}
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {!selectedCategory ? (
          <p className="text-sm text-slate-500">Pick a category to see its items.</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No items found for “{selectedCategory.name}”.</p>
        ) : (
          <div className="overflow-x-auto rounded-md border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Item</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Stock</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Unit Price</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-700">Value</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((it) => (
                  <tr key={it.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                    <td className="px-3 py-2 font-medium text-slate-900">{it.name}</td>
                    <td className="px-3 py-2 text-slate-700">
                      {Number(it.currentStock || 0)} {it.unit || ''}
                    </td>
                    <td className="px-3 py-2 text-slate-700">₹{Number(it.unitPrice || 0).toFixed(2)}</td>
                    <td className="px-3 py-2 text-slate-700">
                      ₹{(Number(it.currentStock || 0) * Number(it.unitPrice || 0)).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

