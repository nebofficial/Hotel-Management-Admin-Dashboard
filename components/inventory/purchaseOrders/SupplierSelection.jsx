'use client'

import { useState, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Search, Building2 } from 'lucide-react'

export default function SupplierSelection({ suppliers = [], value, onChange }) {
  const [query, setQuery] = useState('')
  
  const filtered = useMemo(() => {
    if (!query.trim()) return suppliers
    const q = query.toLowerCase()
    return suppliers.filter((s) => 
      String(s.name || '').toLowerCase().includes(q) ||
      String(s.email || '').toLowerCase().includes(q) ||
      String(s.phone || '').includes(q)
    )
  }, [suppliers, query])

  const selected = useMemo(() => suppliers.find((s) => String(s.id) === String(value)) || null, [suppliers, value])

  return (
    <div className="space-y-1.5 relative">
      <Label htmlFor="supplier-select" className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-slate-600" />
        Supplier *
      </Label>
      {selected && !query ? (
        <div className="rounded-md border border-green-200 bg-green-50 px-3 py-2">
          <p className="text-sm font-medium text-green-900">{selected.name}</p>
          {selected.email && <p className="text-xs text-green-700">{selected.email}</p>}
          <button
            type="button"
            onClick={() => {
              onChange?.(null)
              setQuery('')
            }}
            className="text-xs text-green-700 hover:text-green-900 mt-1"
          >
            Change supplier
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="supplier-select"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search supplier by name, email, or phone…"
              className="pl-9 text-sm"
            />
          </div>
          {query && filtered.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {filtered.map((supplier) => (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => {
                    onChange?.(supplier.id)
                    setQuery('')
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 border-b last:border-0"
                >
                  <p className="text-sm font-medium text-slate-900">{supplier.name}</p>
                  {supplier.email && <p className="text-xs text-slate-500">{supplier.email}</p>}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
