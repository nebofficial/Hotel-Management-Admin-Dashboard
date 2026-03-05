'use client'

import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { AlertTriangle, Package, RefreshCw } from 'lucide-react'
import CustomerManagement from './CustomerManagement'
import DeliveryPartnerAssignment from './DeliveryPartnerAssignment'
import OnlineOrderIntegration from './OnlineOrderIntegration'
import PaymentTracking from './PaymentTracking'
import OrderStatusUpdate from './OrderStatusUpdate'
import DeliveryChargesSetup from './DeliveryChargesSetup'
import DeliveryAreaControl from './DeliveryAreaControl'
import NotificationSystem from './NotificationSystem'
import OrderTrackingID from './OrderTrackingID'
import PaymentModeSelection from './PaymentModeSelection'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export type TakeawayOrderStatus = 'Placed' | 'Packed' | 'OutForDelivery' | 'Delivered' | 'Cancelled'
export type PaymentStatus = 'Paid' | 'Pending' | 'Failed'
export type PaymentMode = 'COD' | 'Online'
export type OrderType = 'Takeaway' | 'Delivery'

export interface TakeawayOrderItem {
  id?: string
  name: string
  quantity: number
  price: number
}

export interface TakeawayDeliveryOrder {
  id: string
  trackingId: string
  orderType: OrderType
  customerId: string | null
  customerName: string | null
  customerPhone: string | null
  deliveryPartnerId: string | null
  status: TakeawayOrderStatus
  paymentStatus: PaymentStatus
  paymentMode: PaymentMode
  items: TakeawayOrderItem[]
  deliveryAddress: string | null
  pincode: string | null
  deliveryCharges: number
  subtotal: number
  totalAmount: number
  source: 'manual' | 'online'
  specialInstructions: string | null
  notes: string | null
  createdAt?: string
}

export interface TakeawayCustomer {
  id: string
  name: string
  phone: string | null
  email: string | null
  address: string | null
  pincode: string | null
  notes: string | null
}

export interface DeliveryPartner {
  id: string
  name: string
  phone: string | null
  isAvailable: boolean
  notes: string | null
}

export interface DeliveryArea {
  id: string
  pincode: string | null
  zoneName: string | null
  isActive: boolean
  notes: string | null
}

export interface DeliveryChargesConfig {
  id: string
  chargeType: 'fixed' | 'distance'
  fixedAmount: number
  perKmRate: number | null
  freeDeliveryAbove: number | null
  isActive: boolean
  notes: string | null
}

export interface TakeawayNotificationLog {
  id: string
  orderId: string | null
  trackingId: string | null
  channel: 'SMS' | 'WhatsApp'
  recipient: string | null
  message: string | null
  status: 'Sent' | 'Failed' | 'Pending'
  createdAt?: string
}

function toOrder(o: any): TakeawayDeliveryOrder {
  return {
    id: String(o.id),
    trackingId: String(o.trackingId || ''),
    orderType: (o.orderType === 'Takeaway' ? 'Takeaway' : 'Delivery') as OrderType,
    customerId: o.customerId || null,
    customerName: o.customerName != null ? String(o.customerName) : null,
    customerPhone: o.customerPhone != null ? String(o.customerPhone) : null,
    deliveryPartnerId: o.deliveryPartnerId || null,
    status: (o.status as TakeawayOrderStatus) || 'Placed',
    paymentStatus: (o.paymentStatus as PaymentStatus) || 'Pending',
    paymentMode: (o.paymentMode as PaymentMode) || 'COD',
    items: Array.isArray(o.items) ? o.items : [],
    deliveryAddress: o.deliveryAddress != null ? String(o.deliveryAddress) : null,
    pincode: o.pincode != null ? String(o.pincode) : null,
    deliveryCharges: Number(o.deliveryCharges || 0),
    subtotal: Number(o.subtotal || 0),
    totalAmount: Number(o.totalAmount || 0),
    source: o.source === 'online' ? 'online' : 'manual',
    specialInstructions: o.specialInstructions != null ? String(o.specialInstructions) : null,
    notes: o.notes != null ? String(o.notes) : null,
    createdAt: o.createdAt ? String(o.createdAt) : undefined,
  }
}

function toCustomer(c: any): TakeawayCustomer {
  return {
    id: String(c.id),
    name: String(c.name || ''),
    phone: c.phone != null ? String(c.phone) : null,
    email: c.email != null ? String(c.email) : null,
    address: c.address != null ? String(c.address) : null,
    pincode: c.pincode != null ? String(c.pincode) : null,
    notes: c.notes != null ? String(c.notes) : null,
  }
}

function toPartner(p: any): DeliveryPartner {
  return {
    id: String(p.id),
    name: String(p.name || ''),
    phone: p.phone != null ? String(p.phone) : null,
    isAvailable: Boolean(p.isAvailable),
    notes: p.notes != null ? String(p.notes) : null,
  }
}

function toArea(a: any): DeliveryArea {
  return {
    id: String(a.id),
    pincode: a.pincode != null ? String(a.pincode) : null,
    zoneName: a.zoneName != null ? String(a.zoneName) : null,
    isActive: Boolean(a.isActive),
    notes: a.notes != null ? String(a.notes) : null,
  }
}

function toChargesConfig(c: any): DeliveryChargesConfig {
  return {
    id: String(c.id),
    chargeType: c.chargeType === 'distance' ? 'distance' : 'fixed',
    fixedAmount: Number(c.fixedAmount || 0),
    perKmRate: c.perKmRate != null ? Number(c.perKmRate) : null,
    freeDeliveryAbove: c.freeDeliveryAbove != null ? Number(c.freeDeliveryAbove) : null,
    isActive: Boolean(c.isActive),
    notes: c.notes != null ? String(c.notes) : null,
  }
}

export default function TakeawayDelivery() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<TakeawayDeliveryOrder[]>([])
  const [customers, setCustomers] = useState<TakeawayCustomer[]>([])
  const [partners, setPartners] = useState<DeliveryPartner[]>([])
  const [areas, setAreas] = useState<DeliveryArea[]>([])
  const [chargesConfigs, setChargesConfigs] = useState<DeliveryChargesConfig[]>([])
  const [notifications, setNotifications] = useState<TakeawayNotificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)

  const loadData = async () => {
    if (!user?.hotelId) {
      setError('Hotel not selected. Please login again.')
      setLoading(false)
      return
    }
    const token = getToken()
    if (!token) {
      setError('Not authenticated. Please log in again.')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [ordersRes, customersRes, partnersRes, areasRes, chargesRes, notifRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-customers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-partners`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-areas`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-charges`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-notifications`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      const ordersData = ordersRes.ok ? await ordersRes.json().catch(() => ({})) : {}
      const customersData = customersRes.ok ? await customersRes.json().catch(() => ({})) : {}
      const partnersData = partnersRes.ok ? await partnersRes.json().catch(() => ({})) : {}
      const areasData = areasRes.ok ? await areasRes.json().catch(() => ({})) : {}
      const chargesData = chargesRes.ok ? await chargesRes.json().catch(() => ({})) : {}
      const notifData = notifRes.ok ? await notifRes.json().catch(() => ({})) : {}
      if (!ordersRes.ok) throw new Error((ordersData as any)?.message || `Failed to load (HTTP ${ordersRes.status})`)
      setOrders((Array.isArray((ordersData as any).orders) ? (ordersData as any).orders : []).map(toOrder))
      setCustomers((Array.isArray((customersData as any).customers) ? (customersData as any).customers : []).map(toCustomer))
      setPartners((Array.isArray((partnersData as any).partners) ? (partnersData as any).partners : []).map(toPartner))
      setAreas((Array.isArray((areasData as any).areas) ? (areasData as any).areas : []).map(toArea))
      setChargesConfigs((Array.isArray((chargesData as any).configs) ? (chargesData as any).configs : []).map(toChargesConfig))
      setNotifications((Array.isArray((notifData as any).logs) ? (notifData as any).logs : []).map((l: any) => ({ ...l, id: String(l.id) })))
    } catch (e: any) {
      setError(e?.message || 'Failed to load takeaway/delivery data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.hotelId])

  const upsertOrder = (next: TakeawayDeliveryOrder) => {
    setOrders((prev) => {
      const idx = prev.findIndex((p) => p.id === next.id)
      if (idx === -1) return [next, ...prev]
      const copy = [...prev]
      copy[idx] = next
      return copy
    })
  }

  const createOrder = async (payload: Partial<TakeawayDeliveryOrder>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-orders`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to create order (HTTP ${res.status})`)
    const o = (data as any).order
    if (o?.id) upsertOrder(toOrder(o))
    return data
  }

  const updateOrder = async (id: string, patch: Partial<TakeawayDeliveryOrder>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-orders/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to update order (HTTP ${res.status})`)
    const o = (data as any).order
    if (o?.id) upsertOrder(toOrder(o))
    return data
  }

  const deleteOrder = async (id: string) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-orders/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as any)?.message || `Failed to delete order (HTTP ${res.status})`)
    }
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const upsertCustomer = (c: TakeawayCustomer) => {
    setCustomers((prev) => {
      const idx = prev.findIndex((p) => p.id === c.id)
      if (idx === -1) return [c, ...prev]
      const copy = [...prev]
      copy[idx] = c
      return copy
    })
  }

  const createCustomer = async (payload: Partial<TakeawayCustomer>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-customers`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to create customer (HTTP ${res.status})`)
    const c = (data as any).customer
    if (c?.id) upsertCustomer(toCustomer(c))
    return data
  }

  const updateCustomer = async (id: string, patch: Partial<TakeawayCustomer>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-customers/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to update customer (HTTP ${res.status})`)
    const c = (data as any).customer
    if (c?.id) upsertCustomer(toCustomer(c))
    return data
  }

  const deleteCustomer = async (id: string) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-customers/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as any)?.message || `Failed to delete customer (HTTP ${res.status})`)
    }
    setCustomers((prev) => prev.filter((c) => c.id !== id))
  }

  const upsertPartner = (p: DeliveryPartner) => {
    setPartners((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id)
      if (idx === -1) return [p, ...prev]
      const copy = [...prev]
      copy[idx] = p
      return copy
    })
  }

  const createPartner = async (payload: Partial<DeliveryPartner>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-partners`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to create partner (HTTP ${res.status})`)
    const p = (data as any).partner
    if (p?.id) upsertPartner(toPartner(p))
    return data
  }

  const updatePartner = async (id: string, patch: Partial<DeliveryPartner>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-partners/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to update partner (HTTP ${res.status})`)
    const p = (data as any).partner
    if (p?.id) upsertPartner(toPartner(p))
    return data
  }

  const deletePartner = async (id: string) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-partners/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as any)?.message || `Failed to delete partner (HTTP ${res.status})`)
    }
    setPartners((prev) => prev.filter((p) => p.id !== id))
  }

  const upsertArea = (a: DeliveryArea) => {
    setAreas((prev) => {
      const idx = prev.findIndex((x) => x.id === a.id)
      if (idx === -1) return [a, ...prev]
      const copy = [...prev]
      copy[idx] = a
      return copy
    })
  }

  const createArea = async (payload: Partial<DeliveryArea>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-areas`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to create area (HTTP ${res.status})`)
    const a = (data as any).area
    if (a?.id) upsertArea(toArea(a))
    return data
  }

  const updateArea = async (id: string, patch: Partial<DeliveryArea>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-areas/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to update area (HTTP ${res.status})`)
    const a = (data as any).area
    if (a?.id) upsertArea(toArea(a))
    return data
  }

  const deleteArea = async (id: string) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-areas/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      throw new Error((data as any)?.message || `Failed to delete area (HTTP ${res.status})`)
    }
    setAreas((prev) => prev.filter((a) => a.id !== id))
  }

  const upsertChargesConfig = (c: DeliveryChargesConfig) => {
    setChargesConfigs((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id)
      if (idx === -1) return [c, ...prev]
      const copy = [...prev]
      copy[idx] = c
      return copy
    })
  }

  const createChargesConfig = async (payload: Partial<DeliveryChargesConfig>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-charges`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to create config (HTTP ${res.status})`)
    const c = (data as any).config
    if (c?.id) upsertChargesConfig(toChargesConfig(c))
    return data
  }

  const updateChargesConfig = async (id: string, patch: Partial<DeliveryChargesConfig>) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/delivery-charges/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to update config (HTTP ${res.status})`)
    const c = (data as any).config
    if (c?.id) upsertChargesConfig(toChargesConfig(c))
    return data
  }

  const logNotification = async (payload: { channel: 'SMS' | 'WhatsApp'; orderId?: string; trackingId?: string; recipient?: string; message?: string; status?: string }) => {
    if (!user?.hotelId) return
    const token = getToken()
    if (!token) throw new Error('Not authenticated')
    const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/takeaway-notifications`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error((data as any)?.message || `Failed to log notification (HTTP ${res.status})`)
    if ((data as any).log?.id) {
      setNotifications((prev) => [{ ...(data as any).log, id: String((data as any).log.id) }, ...prev])
    }
    return data
  }

  const orderStats = useMemo(() => {
    const base = { Placed: 0, Packed: 0, OutForDelivery: 0, Delivered: 0, Cancelled: 0 }
    orders.forEach((o) => { (base as any)[o.status] = ((base as any)[o.status] || 0) + 1 })
    return base
  }, [orders])

  const revenueToday = useMemo(() => {
    return orders.filter((o) => o.status === 'Delivered' && o.paymentStatus === 'Paid').reduce((s, o) => s + Number(o.totalAmount || 0), 0)
  }, [orders])

  if (!user?.hotelId) {
    return (
      <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <Card className="rounded-2xl border border-red-200 bg-red-50">
          <CardContent className="p-6 flex items-center gap-2 text-sm text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Hotel not selected. Please login again.</span>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="p-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 text-sm text-slate-600">Loading takeaway & delivery data…</CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Package className="h-4 w-4 text-amber-600" />
            Takeaway & Delivery
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Customers, orders, delivery partners, areas, charges, and notifications.
          </p>
        </div>
        <Button type="button" variant="outline" className="h-8" onClick={loadData}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        <Card className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm border-none">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide opacity-85">Orders</div>
            <div className="text-lg font-semibold">{orders.length}</div>
          </CardContent>
        </Card>
        {(['Placed', 'Packed', 'OutForDelivery', 'Delivered'] as const).map((s) => (
          <Card key={s} className="rounded-xl bg-white border border-slate-200 shadow-sm">
            <CardContent className="p-3">
              <div className="text-xs font-semibold text-slate-700">{s}</div>
              <div className="text-lg text-slate-900">{(orderStats as any)[s] ?? 0}</div>
            </CardContent>
          </Card>
        ))}
        <Card className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-sm border-none">
          <CardContent className="p-3">
            <div className="text-[11px] uppercase tracking-wide opacity-85">Revenue (Delivered)</div>
            <div className="text-lg font-semibold">₹{revenueToday.toFixed(0)}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="customers" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="partners">Delivery Partners</TabsTrigger>
          <TabsTrigger value="integration">Online Orders</TabsTrigger>
          <TabsTrigger value="payment">Payment Tracking</TabsTrigger>
          <TabsTrigger value="status">Order Status</TabsTrigger>
          <TabsTrigger value="charges">Delivery Charges</TabsTrigger>
          <TabsTrigger value="areas">Delivery Areas</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="tracking">Order Tracking ID</TabsTrigger>
          <TabsTrigger value="paymentmode">Payment Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <CustomerManagement
            customers={customers}
            onCreateCustomer={createCustomer}
            onUpdateCustomer={updateCustomer}
            onDeleteCustomer={deleteCustomer}
          />
        </TabsContent>
        <TabsContent value="partners">
          <DeliveryPartnerAssignment
            partners={partners}
            orders={orders}
            onUpdateOrder={updateOrder}
            onCreatePartner={createPartner}
            onUpdatePartner={updatePartner}
            onDeletePartner={deletePartner}
          />
        </TabsContent>
        <TabsContent value="integration">
          <OnlineOrderIntegration orders={orders} onRefresh={loadData} />
        </TabsContent>
        <TabsContent value="payment">
          <PaymentTracking orders={orders} onUpdateOrder={updateOrder} />
        </TabsContent>
        <TabsContent value="status">
          <OrderStatusUpdate orders={orders} onUpdateOrder={updateOrder} />
        </TabsContent>
        <TabsContent value="charges">
          <DeliveryChargesSetup
            configs={chargesConfigs}
            onCreateConfig={createChargesConfig}
            onUpdateConfig={updateChargesConfig}
          />
        </TabsContent>
        <TabsContent value="areas">
          <DeliveryAreaControl
            areas={areas}
            onCreateArea={createArea}
            onUpdateArea={updateArea}
            onDeleteArea={deleteArea}
          />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationSystem orders={orders} notifications={notifications} onSendLog={logNotification} />
        </TabsContent>
        <TabsContent value="tracking">
          <OrderTrackingID orders={orders} onCreateOrder={createOrder} />
        </TabsContent>
        <TabsContent value="paymentmode">
          <PaymentModeSelection orders={orders} onUpdateOrder={updateOrder} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
