'use client'

import { useEffect, useState, useMemo } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AlertCircle, ShoppingCart, RefreshCw, Search } from 'lucide-react'
import CreatePurchaseOrder from './CreatePurchaseOrder'
import EditCancelPO from './EditCancelPO'
import POStatusTracking from './POStatusTracking'
import ApprovePurchaseOrder from './ApprovePurchaseOrder'
import PartialDeliverySupport from './PartialDeliverySupport'
import PDFExport from './PDFExport'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function PurchaseOrders() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const [orders, setOrders] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [approving, setApproving] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

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
      const [ordersRes, suppliersRes, itemsRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/suppliers?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/inventory-items?isActive=true`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      const ordersJson = ordersRes.ok ? await ordersRes.json().catch(() => ({})) : {}
      const suppliersJson = suppliersRes.ok ? await suppliersRes.json().catch(() => ({})) : {}
      const itemsJson = itemsRes.ok ? await itemsRes.json().catch(() => ({})) : {}

      if (!ordersRes.ok) {
        throw new Error(ordersJson?.message || `Failed to load orders (HTTP ${ordersRes.status})`)
      }

      setOrders(Array.isArray(ordersJson.orders) ? ordersJson.orders : [])
      setSuppliers(Array.isArray(suppliersJson.suppliers) ? suppliersJson.suppliers : [])
      setInventoryItems(Array.isArray(itemsJson.items) ? itemsJson.items : [])

      const first = (ordersJson.orders || [])[0]
      setSelectedOrderId((prev) => prev || first?.id || null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load purchase orders')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [effectiveHotelId])

  const selectedOrder = useMemo(
    () => orders.find((o) => String(o.id) === String(selectedOrderId)) || null,
    [orders, selectedOrderId],
  )

  const displayList = useMemo(() => {
    let filtered = [...orders]
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(
        (o) =>
          String(o.orderNumber || '').toLowerCase().includes(q) ||
          String(o.supplierId || '').includes(q)
      )
    }
    if (statusFilter) {
      filtered = filtered.filter((o) => String(o.status) === statusFilter)
    }
    return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [orders, query, statusFilter])

  const createOrder = async (payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setCreating(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to create (HTTP ${res.status})`)
      await loadAll({ silent: true })
      if (data?.order?.id) setSelectedOrderId(String(data.order.id))
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to create purchase order')
    } finally {
      setCreating(false)
    }
  }

  const updateOrder = async (id, payload) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to update (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to update purchase order')
    } finally {
      setSaving(false)
    }
  }

  const approveOrder = async (id) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setApproving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders/${id}/approve`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to approve (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to approve purchase order')
    } finally {
      setApproving(false)
    }
  }

  const receiveOrder = async (id, receivedItems) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setReceiving(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders/${id}/receive`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ receivedItems }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to receive (HTTP ${res.status})`)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to receive purchase order')
    } finally {
      setReceiving(false)
    }
  }

  const cancelOrder = async (id) => {
    if (!effectiveHotelId) return
    const token = getToken()
    if (!token) return
    setCancelling(true)
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/hotel-data/${effectiveHotelId}/purchase-orders/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data?.message || `Failed to cancel (HTTP ${res.status})`)
      setSelectedOrderId(null)
      await loadAll({ silent: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to cancel purchase order')
    } finally {
      setCancelling(false)
    }
  }

  const handlePDFExport = (order) => {
    // Simple PDF generation - in production, use a library like jsPDF or send to backend
    const printWindow = window.open('', '_blank')
    const content = `
      <html>
        <head><title>Purchase Order ${order.orderNumber}</title></head>
        <body style="font-family: Arial; padding: 20px;">
          <h1>Purchase Order: ${order.orderNumber}</h1>
          <p>Date: ${new Date(order.orderDate).toLocaleDateString()}</p>
          <p>Status: ${order.status}</p>
          <h2>Items</h2>
          <table border="1" style="width:100%; border-collapse: collapse;">
            <tr><th>Item</th><th>Quantity</th><th>Price</th><th>Total</th></tr>
            ${(order.items || []).map((item) => `
              <tr>
                <td>${item.name}</td>
                <td>${item.quantity} ${item.unit || ''}</td>
                <td>₹${item.price}</td>
                <td>₹${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          <p><strong>Subtotal: ₹${Number(order.subtotal || 0).toFixed(2)}</strong></p>
          <p><strong>Tax (${order.taxRate}%): ₹${Number(order.taxAmount || 0).toFixed(2)}</strong></p>
          <p><strong>Total: ₹${Number(order.totalAmount || 0).toFixed(2)}</strong></p>
        </body>
      </html>
    `
    printWindow.document.write(content)
    printWindow.document.close()
    printWindow.print()
  }

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4 flex items-center gap-2 text-amber-800">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-sm">Select a hotel or log in with a hotel account to manage purchase orders.</p>
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
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Purchase Orders
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Create, approve, track, and manage supplier purchase orders
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
                placeholder="Search PO number…"
                className="w-full bg-transparent text-sm outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="">All Statuses</option>
              <option value="Draft">Draft</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Ordered">Ordered</option>
              <option value="Received">Received</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : displayList.length === 0 ? (
              <p className="text-sm text-slate-500">No purchase orders.</p>
            ) : (
              <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
                {displayList.map((order) => {
                  const active = String(order.id) === String(selectedOrderId)
                  const supplier = suppliers.find((s) => String(s.id) === String(order.supplierId))
                  return (
                    <button
                      key={order.id}
                      type="button"
                      onClick={() => setSelectedOrderId(String(order.id))}
                      className={`w-full text-left rounded-md border px-3 py-2 transition-colors ${
                        active
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-900 truncate font-mono">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-slate-500 truncate">
                            {supplier?.name || 'Unknown Supplier'}
                          </p>
                          <p className="text-xs text-slate-500">
                            ₹{Number(order.totalAmount || 0).toLocaleString()}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                            order.status === 'Received'
                              ? 'bg-green-100 text-green-700'
                              : order.status === 'Cancelled'
                                ? 'bg-red-100 text-red-700'
                                : order.status === 'Approved' || order.status === 'Ordered'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="xl:col-span-2 space-y-4">
          {selectedOrder && (
            <POStatusTracking
              status={selectedOrder.status}
              orderNumber={selectedOrder.orderNumber}
              approvedAt={selectedOrder.approvedAt}
              expectedDeliveryDate={selectedOrder.expectedDeliveryDate}
            />
          )}

          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
              <TabsTrigger value="create" className="text-xs">Create</TabsTrigger>
              <TabsTrigger value="edit" className="text-xs">Edit</TabsTrigger>
              <TabsTrigger value="receive" className="text-xs">Receive</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="mt-4">
              <CreatePurchaseOrder
                suppliers={suppliers}
                inventoryItems={inventoryItems}
                onCreate={createOrder}
                creating={creating}
              />
            </TabsContent>

            <TabsContent value="edit" className="mt-4">
              <EditCancelPO
                order={selectedOrder}
                suppliers={suppliers}
                inventoryItems={inventoryItems}
                onUpdate={updateOrder}
                saving={saving}
              />
            </TabsContent>

            <TabsContent value="receive" className="mt-4">
              {selectedOrder ? (
                <PartialDeliverySupport
                  items={selectedOrder.items || []}
                  receivedItems={selectedOrder.receivedItems || []}
                  onReceivedChange={(receivedItems) => receiveOrder(selectedOrder.id, receivedItems)}
                />
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Select a purchase order to receive items.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="actions" className="mt-4 space-y-3">
              {selectedOrder ? (
                <>
                  <ApprovePurchaseOrder
                    order={selectedOrder}
                    onApprove={approveOrder}
                    onCancel={cancelOrder}
                    canApprove={user?.role === 'admin' || user?.role === 'manager'}
                  />
                  <PDFExport order={selectedOrder} onExport={handlePDFExport} />
                </>
              ) : (
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-slate-500">Select a purchase order to perform actions.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </main>
  )
}
