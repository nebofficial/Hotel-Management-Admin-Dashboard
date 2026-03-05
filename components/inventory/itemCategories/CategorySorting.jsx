'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowDown, ArrowUp, GripVertical, ListOrdered, Save } from 'lucide-react'

function move(arr, from, to) {
  const next = [...arr]
  const item = next.splice(from, 1)[0]
  next.splice(to, 0, item)
  return next
}

export default function CategorySorting({ categories = [], onSaveOrder, saving }) {
  const initial = useMemo(() => [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)), [categories])
  const [order, setOrder] = useState(initial)

  useEffect(() => setOrder(initial), [initial])

  const ids = useMemo(() => order.map((c) => c.id), [order])

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-base text-slate-900">
          <ListOrdered className="h-5 w-5 text-amber-600" />
          Category Sorting
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        <p className="text-sm text-slate-600">
          Adjust display priority using Up/Down and save the new order.
        </p>

        {order.length === 0 ? (
          <p className="text-sm text-slate-500">No categories to sort.</p>
        ) : (
          <div className="space-y-2">
            {order.map((c, idx) => (
              <div
                key={c.id}
                className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2"
              >
                <GripVertical className="h-4 w-4 text-slate-400" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {c.parentId ? '↳ ' : ''}
                    {c.name}
                  </p>
                  <p className="text-xs text-slate-500">Order: {idx + 1}</p>
                </div>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={idx === 0}
                    onClick={() => setOrder(move(order, idx, idx - 1))}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={idx === order.length - 1}
                    onClick={() => setOrder(move(order, idx, idx + 1))}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          type="button"
          className="w-full bg-amber-600 hover:bg-amber-700"
          disabled={order.length === 0 || saving}
          onClick={() => onSaveOrder?.(ids)}
        >
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving…' : 'Save Order'}
        </Button>
      </CardContent>
    </Card>
  )
}

