'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Layers, RefreshCw, Search } from 'lucide-react'
import AddCategory from './AddCategory'
import EditCategory from './EditCategory'
import DeleteCategory from './DeleteCategory'
import CategoryWiseItemView from './CategoryWiseItemView'
import CategorySorting from './CategorySorting'
import BulkCategoryImport from './BulkCategoryImport'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function ItemCategories() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [importing, setImporting] = useState(false)
  const [reordering, setReordering] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  const loadAll = async (opts = { silent: false }) => {
    if (!effectiveHotelId) {
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }

    if (!opts.silent) setLoading(true)
    setRefreshing(opts.silent)
    setError(null)
    try {
      const [catsRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories?includeInactive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const catsJson = catsRes.ok ? await catsRes.json().catch(() => ({})) : {}
      const itemsJson = itemsRes.ok ? await itemsRes.json().catch(() => ({})) : {}

      if (!catsRes.ok) {
        throw new Error(catsJson?.message || `Failed to load categories (HTTP ${catsRes.status})`)
      }

      setCategories(Array.isArray(catsJson.categories) ? catsJson.categories : [])
      setItems(Array.isArray(itemsJson.items) ? itemsJson.items : [])

      const first = (catsJson.categories || [])[0]
      setSelectedCategoryId((prev) => prev || first?.id || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveHotelId])

  const selectedCategory = useMemo(
    () => categories.find((c) => String(c.id) === String(selectedCategoryId)) || null,
    [categories, selectedCategoryId],
  )

  const displayList = useMemo(() => {
    const q = query.trim().toLowerCase()
    const sorted = [...categories].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    if (!q) return sorted
    return sorted.filter((c) => String(c.name || '').toLowerCase().includes(q))
  }, [categories, query])

  const createCategory = async (payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to create (HTTP ${res.status})`)
      await loadAll({ silent: true })
      if (data?.category?.id) setSelectedCategoryId(String(data.category.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create category')
    } finally {
      setCreating(false)
    }
  }

  const updateCategory = async (id, payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to update (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update category')
    } finally {
      setSaving(false)
    }
  }

  const deleteCategory = async (id) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to delete (HTTP ${res.status})`)
      setSelectedCategoryId(null)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete category')
    } finally {
      setDeleting(false)
    }
  }

  const saveOrder = async (orderIds) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setReordering(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories/reorder`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: orderIds }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to reorder (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to save order')
    } finally {
      setReordering(false)
    }
  }

  const bulkImport = async (cats) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setImporting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories/bulk-import`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: cats }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to import (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Bulk import failed')
    } finally {
      setImporting(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select a hotel or log in with a hotel account to manage categories.</p>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-[calc(100vh-3rem)]">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Item Categories
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Add, edit, sort, import, and manage inventory category visibility.
          </p>
        </div>
        <button
          type="button"
          onClick={() => loadAll({ silent: true })}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-3 flex items-center gap-2 text-red-800 text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg xl:col-span-1">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search categories…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : displayList.length === 0 ? (
              <p className="text-sm text-slate-500">No categories.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {displayList.map((c) => {
                  const active = String(c.id) === String(selectedCategoryId)
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setSelectedCategoryId(String(c.id))}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        active
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">
                            {c.parentId ? '↳ ' : ''}
                            {c.name}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {c.isActive === false ? 'Inactive' : 'Active'} • Order {Number(c.sortOrder || 0) + 1}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            c.isActive === false ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-700'
                          }`}
                        >
                          {c.isActive === false ? 'OFF' : 'ON'}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            <DeleteCategory category={selectedCategory} onDelete={deleteCategory} deleting={deleting} />
          </CardContent>
        </Card>

        <div className="xl:col-span-2 space-y-4">
          <Tabs defaultValue="manage" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="manage" className="text-xs">
                Manage
              </TabsTrigger>
              <TabsTrigger value="items" className="text-xs">
                Items
              </TabsTrigger>
              <TabsTrigger value="sorting" className="text-xs">
                Sorting
              </TabsTrigger>
              <TabsTrigger value="import" className="text-xs">
                Bulk import
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manage" className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              <AddCategory categories={categories} onCreate={createCategory} creating={creating} />
              <EditCategory
                categories={categories}
                category={selectedCategory}
                onUpdate={updateCategory}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="items" className="mt-4">
              <CategoryWiseItemView
                categories={categories}
                items={items}
                selectedCategoryId={selectedCategoryId}
                onSelectCategory={setSelectedCategoryId}
              />
            </TabsContent>

            <TabsContent value="sorting" className="mt-4">
              <CategorySorting categories={categories} onSaveOrder={saveOrder} saving={reordering} />
            </TabsContent>

            <TabsContent value="import" className="mt-4">
              <BulkCategoryImport onImport={bulkImport} importing={importing} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}

