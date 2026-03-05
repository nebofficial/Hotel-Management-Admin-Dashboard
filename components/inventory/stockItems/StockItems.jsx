'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, Package, RefreshCw } from 'lucide-react'
import AddNewItem from './AddNewItem'
import EditItemDetails from './EditItemDetails'
import DeleteItem from './DeleteItem'
import ViewItemStock from './ViewItemStock'
import ItemSearchFilter from './ItemSearchFilter'
import StockHistoryTracking from './StockHistoryTracking'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function StockItems() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [selectedItemId, setSelectedItemId] = useState(null)
  const [stockHistory, setStockHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')

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
      const [itemsRes, catsRes, suppliersRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-categories?includeInactive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/suppliers?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const itemsJson = itemsRes.ok ? await itemsRes.json().catch(() => ({})) : {}
      const catsJson = catsRes.ok ? await catsRes.json().catch(() => ({})) : {}
      const suppliersJson = suppliersRes.ok ? await suppliersRes.json().catch(() => ({})) : {}

      setItems(Array.isArray(itemsJson.items) ? itemsJson.items : [])
      setCategories(Array.isArray(catsJson.categories) ? catsJson.categories : [])
      setSuppliers(Array.isArray(suppliersJson.suppliers) ? suppliersJson.suppliers : [])

      const first = (itemsJson.items || [])[0]
      setSelectedItemId((prev) => prev || first?.id || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load items')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const loadHistory = async (itemId) => {
    if (!effectiveHotelId || !itemId) return
    const token = getToken()
    if (!token) return

    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${effectiveHotelId}/stock-history?itemId=${itemId}&limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const data = res.ok ? await res.json().catch(() => ({})) : {}
      setStockHistory(Array.isArray(data.history) ? data.history : [])
    } catch (e) {
      console.error('Failed to load history:', e)
    }
  }

  useEffect(() => {
    if (effectiveHotelId) {
      loadAll()
    }
  }, [effectiveHotelId])

  useEffect(() => {
    if (selectedItemId) {
      loadHistory(selectedItemId)
    }
  }, [selectedItemId])

  const selectedItem = useMemo(
    () => items.find((it) => String(it.id) === String(selectedItemId)) || null,
    [items, selectedItemId],
  )

  const filteredItems = useMemo(() => {
    let filtered = items
    const q = query.trim().toLowerCase()
    if (q) {
      filtered = filtered.filter(
        (it) =>
          String(it.name || '').toLowerCase().includes(q) ||
          String(it.sku || '').toLowerCase().includes(q) ||
          String(it.barcode || '').toLowerCase().includes(q)
      )
    }
    if (categoryFilter) {
      filtered = filtered.filter((it) => String(it.category || '') === categoryFilter)
    }
    return filtered
  }, [items, query, categoryFilter])

  const createItem = async (payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to create (HTTP ${res.status})`)
      await loadAll({ silent: true })
      if (data?.item?.id) setSelectedItemId(String(data.item.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create item')
    } finally {
      setCreating(false)
    }
  }

  const updateItem = async (id, payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to update (HTTP ${res.status})`)
      await loadAll({ silent: true })
      await loadHistory(id)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update item')
    } finally {
      setSaving(false)
    }
  }

  const deleteItem = async (id) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to delete (HTTP ${res.status})`)
      setSelectedItemId(null)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete item')
    } finally {
      setDeleting(false)
    }
  }

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select a hotel or log in with a hotel account to manage stock items.</p>
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
            <Package className="h-5 w-5 text-blue-600" />
            Stock Items Management
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage inventory items, track stock levels, pricing, expiry dates, and batches.
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

      <ItemSearchFilter
        query={query}
        category={categoryFilter}
        onQueryChange={setQuery}
        onCategoryChange={setCategoryFilter}
        categories={categories}
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="border-0 shadow-lg xl:col-span-1">
          <CardContent className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-slate-900">Items ({filteredItems.length})</h3>
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : filteredItems.length === 0 ? (
              <p className="text-sm text-slate-500">No items found.</p>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {filteredItems.map((it) => {
                  const active = String(it.id) === String(selectedItemId)
                  const isLow = Number(it.currentStock || 0) < Number(it.reorderLevel || 0)
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => setSelectedItemId(String(it.id))}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        active
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate">{it.name}</p>
                          <p className="text-xs text-slate-500 truncate">{it.category || 'Uncategorized'}</p>
                          {it.sku && <p className="text-xs text-slate-400">SKU: {it.sku}</p>}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-semibold text-slate-900">
                            {Number(it.currentStock || 0).toLocaleString()} {it.unit || ''}
                          </p>
                          {isLow && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                              LOW
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
            {selectedItem && <DeleteItem item={selectedItem} onDelete={deleteItem} deleting={deleting} />}
          </CardContent>
        </Card>

        <div className="xl:col-span-2 space-y-4">
          {selectedItem && (
            <ViewItemStock
              currentStock={selectedItem.currentStock}
              reorderLevel={selectedItem.reorderLevel}
              unit={selectedItem.unit}
            />
          )}

          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="add" className="text-xs">
                Add Item
              </TabsTrigger>
              <TabsTrigger value="edit" className="text-xs">
                Edit Item
              </TabsTrigger>
              <TabsTrigger value="history" className="text-xs">
                Stock History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="add" className="mt-4">
              <AddNewItem
                categories={categories}
                suppliers={suppliers}
                onCreate={createItem}
                creating={creating}
              />
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <EditItemDetails
                categories={categories}
                suppliers={suppliers}
                item={selectedItem}
                onUpdate={updateItem}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <StockHistoryTracking history={stockHistory} loading={false} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
