'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'

export default function MenuItemSelector({
  categories = [],
  menuItems = [],
  searchQuery = '',
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onAddItem,
}) {
  const filtered = menuItems.filter((m) => {
    const matchCat = !selectedCategory || m.categoryId === selectedCategory || m.categoryName === selectedCategory
    const matchSearch =
      !searchQuery ||
      (m.name || '').toLowerCase().includes((searchQuery || '').toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-violet-50/80 to-purple-50/50">
      <CardHeader className="pb-2">
        <h3 className="text-sm font-semibold text-slate-800">Menu & Items</h3>
        <div className="relative mt-2">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search food items..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-8 h-9"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          <button
            type="button"
            onClick={() => onCategoryChange?.(null)}
            className={`px-2 py-1 rounded text-xs font-medium ${
              !selectedCategory ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => onCategoryChange?.(c.id)}
              className={`px-2 py-1 rounded text-xs font-medium ${
                selectedCategory === c.id ? 'bg-violet-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <div className="h-[280px] overflow-y-auto grid grid-cols-2 gap-2">
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onAddItem?.(item)}
              disabled={!item.isAvailable}
              className="text-left p-3 rounded-lg border border-slate-200 bg-white hover:border-violet-400 hover:bg-violet-50/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="font-medium text-slate-900 text-sm truncate">{item.name}</div>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-slate-600">₹{Number(item.price || 0).toFixed(2)}</span>
                <span className="text-[10px] text-violet-600 bg-violet-50 px-1 py-0.5 rounded">
                  GST {Number(item.taxRate || 0)}%
                </span>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 flex items-center justify-center h-24 text-sm text-slate-500">
              No items found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
