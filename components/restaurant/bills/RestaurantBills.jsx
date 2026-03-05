'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/auth-context'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  getStats,
  getNextBillNumber,
  createBill,
  addItemToBill,
  applyDiscount,
  generateKOT,
  settleBill,
  processRefund,
  getBill,
  cancelBill,
} from '@/services/api/restaurantBillApi'
import BillStats from './BillStats'
import CreateBillPanel from './CreateBillPanel'
import OrderTypeSelector from './OrderTypeSelector'
import TableSelector from './TableSelector'
import MenuItemSelector from './MenuItemSelector'
import KOTPanel from './KOTPanel'
import OfferSelector from './OfferSelector'
import DiscountPanel from './DiscountPanel'
import TaxSummary from './TaxSummary'
import SplitBillModal from './SplitBillModal'
import PaymentPanel from './PaymentPanel'
import RefundModal from './RefundModal'
import ManagerApprovalModal from './ManagerApprovalModal'
import BillActions from './BillActions'

const getToken = () => (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function RestaurantBills() {
  const { user } = useAuth()
  const apiBase = user?.hotelId
    ? `${typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
        ? `http://${window.location.hostname}:5000`
        : API_BASE}/api/hotel-data/${user.hotelId}`
    : ''

  const [stats, setStats] = useState({})
  const [billNumber, setBillNumber] = useState('')
  const [bill, setBill] = useState(null)
  const [orderType, setOrderType] = useState('Dine-in')
  const [tableNo, setTableNo] = useState('T-01')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [cartItems, setCartItems] = useState([])
  const [discountType, setDiscountType] = useState('percent')
  const [discountValue, setDiscountValue] = useState(0)
  const [paymentMode, setPaymentMode] = useState('Cash')
  const [kot, setKot] = useState(null)
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [tables, setTables] = useState([])
  const [offers, setOffers] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [splitModalOpen, setSplitModalOpen] = useState(false)
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [pendingDiscount, setPendingDiscount] = useState(null)

  const fetchStats = useCallback(async () => {
    if (!apiBase) return
    try {
      const d = await getStats(apiBase)
      setStats(d)
    } catch (e) {
      console.error('Stats error:', e)
    }
  }, [apiBase])

  const fetchNextNumber = useCallback(async () => {
    if (!apiBase) return
    try {
      const d = await getNextBillNumber(apiBase)
      setBillNumber(d.billNumber || '')
    } catch (e) {
      setBillNumber('BILL-2026-0001')
    }
  }, [apiBase])

  const fetchMenu = useCallback(async () => {
    if (!apiBase || !getToken()) return
    try {
      const [catRes, itemRes] = await Promise.all([
        fetch(`${apiBase}/menu-categories`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch(`${apiBase}/menu-items`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ])
      const catData = await catRes.json().catch(() => ({}))
      const itemData = await itemRes.json().catch(() => ({}))
      setCategories(catData.categories || [])
      const items = (itemData.items || []).map((i) => ({
        ...i,
        categoryName: (catData.categories || []).find((c) => c.id === i.categoryId)?.name,
      }))
      setMenuItems(items)
    } catch (e) {
      console.error('Menu fetch error:', e)
    }
  }, [apiBase])

  const fetchTables = useCallback(async () => {
    if (!apiBase || !getToken()) return
    try {
      const res = await fetch(`${apiBase}/restaurant-tables`, { headers: { Authorization: `Bearer ${getToken()}` } })
      const data = await res.json().catch(() => ({}))
      setTables(data.tables || [])
      if ((data.tables || []).length > 0 && !tableNo) setTableNo(data.tables[0].tableNo)
    } catch (e) {
      console.error('Tables fetch error:', e)
    }
  }, [apiBase])

  const fetchOffers = useCallback(async () => {
    if (!apiBase || !getToken()) return
    try {
      const [comboRes, discountRes] = await Promise.all([
        fetch(`${apiBase}/combo-offers`, { headers: { Authorization: `Bearer ${getToken()}` } }),
        fetch(`${apiBase}/discount-offers`, { headers: { Authorization: `Bearer ${getToken()}` } }),
      ])
      const comboData = await comboRes.json().catch(() => ({}))
      const discountData = await discountRes.json().catch(() => ({}))
      const combos = (comboData.combos || []).map((c) => ({ ...c, discountType: 'Flat', discountValue: c.discountAmount }))
      const discounts = (discountData.discounts || []).filter((d) => d.isActive)
      setOffers([...combos, ...discounts])
    } catch (e) {
      console.error('Offers fetch error:', e)
    }
  }, [apiBase])

  useEffect(() => {
    fetchStats()
    fetchNextNumber()
    fetchMenu()
    fetchTables()
    fetchOffers()
  }, [fetchStats, fetchNextNumber, fetchMenu, fetchTables, fetchOffers])

  const subtotal = cartItems.reduce((s, i) => s + (Number(i.price) || 0) * (Number(i.quantity) || 1), 0)
  const discountAmount = discountType === 'percent' ? (subtotal * discountValue) / 100 : discountValue
  const taxableAmount = Math.max(subtotal - discountAmount, 0)
  const gstRate = 12
  const svcRate = 5
  const totalGst = (taxableAmount * gstRate) / 100
  const serviceCharge = (taxableAmount * svcRate) / 100
  const grossTotal = taxableAmount + totalGst + serviceCharge
  const totalAmount = Math.round(grossTotal)
  const roundOff = totalAmount - grossTotal
  const requiresApproval = discountAmount >= 500

  const handleCreateBill = async () => {
    if (!apiBase) {
      setError('Hotel not selected')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const table = orderType === 'Dine-in' ? tableNo : orderType
      const items = cartItems.map((i) => ({
        id: i.id,
        name: i.name,
        price: Number(i.price),
        quantity: Number(i.quantity),
        taxRate: i.taxRate ?? 12,
      }))
      const payload = {
        orderType,
        tableNo: table,
        guestName: customerName || null,
        customerPhone: customerPhone || null,
        items: items.length ? items : [],
      }
      const { bill: b } = await createBill(apiBase, payload)
      setBill(b)
      setCartItems([])
      if (items.length > 0) {
        const dAmt = discountAmount
        if (dAmt > 0) {
          const needsApproval = dAmt >= 500
          if (needsApproval) {
            setPendingDiscount({ billId: b.id, discountAmount: dAmt, discountPercent: discountType === 'percent' ? discountValue : 0 })
            setApprovalModalOpen(true)
            return
          }
          await applyDiscount(apiBase, b.id, { discountAmount: dAmt, managerApproved: true })
          const updated = await getBill(apiBase, b.id)
          setBill(updated.bill)
        }
      }
      fetchNextNumber()
      fetchStats()
    } catch (e) {
      setError(e.message || 'Failed to create bill')
    } finally {
      setLoading(false)
    }
  }

  const handleAddItem = (item) => {
    if (!bill) {
      const existing = cartItems.find((i) => i.id === item.id)
      if (existing) {
        setCartItems(cartItems.map((i) => (i.id === item.id ? { ...i, quantity: (i.quantity || 1) + 1 } : i)))
      } else {
        setCartItems([...cartItems, { ...item, quantity: 1, taxRate: item.taxRate ?? 12 }])
      }
      return
    }
    setLoading(true)
    addItemToBill(apiBase, bill.id, { id: item.id, name: item.name, price: item.price, quantity: 1, taxRate: item.taxRate ?? 12 })
      .then(({ bill: b }) => setBill(b))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  const handleApplyDiscount = async () => {
    if (!bill || discountAmount <= 0) return
    if (requiresApproval) {
      setPendingDiscount({ billId: bill.id, discountAmount, discountPercent: discountType === 'percent' ? discountValue : 0 })
      setApprovalModalOpen(true)
      return
    }
    setLoading(true)
    try {
      const payload = discountType === 'percent' ? { discountPercent: discountValue, managerApproved: true } : { discountAmount, managerApproved: true }
      const { bill: b } = await applyDiscount(apiBase, bill.id, payload)
      setBill(b)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleApprovalConfirm = async (opts) => {
    if (!pendingDiscount || !apiBase) return
    setLoading(true)
    try {
      const payload = {
        discountAmount: pendingDiscount.discountAmount,
        discountPercent: pendingDiscount.discountPercent,
        managerApproved: true,
        managerPin: opts?.managerPin,
      }
      const { bill: b } = await applyDiscount(apiBase, pendingDiscount.billId, payload)
      setBill(b)
      setPendingDiscount(null)
      setApprovalModalOpen(false)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateKOT = async () => {
    if (!bill || !apiBase) return
    setLoading(true)
    try {
      const { kot: k } = await generateKOT(apiBase, bill.id)
      setKot(k)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSettle = async () => {
    if (!bill || !apiBase) return
    setLoading(true)
    setError(null)
    try {
      const total = Number(bill.totalAmount || 0)
      const { bill: b } = await settleBill(apiBase, bill.id, {
        payments: [{ method: paymentMode, amount: total }],
        paymentMode,
      })
      setBill(b)
      setCartItems([])
      setDiscountType('none')
      setDiscountValue(0)
      setKot(null)
      fetchStats()
      fetchNextNumber()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRefund = async (payload) => {
    if (!bill || !apiBase) return
    setLoading(true)
    try {
      const { bill: b } = await processRefund(apiBase, bill.id, payload)
      setBill(b)
      setRefundModalOpen(false)
      fetchStats()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!bill || !apiBase || !confirm('Cancel this bill?')) return
    setLoading(true)
    try {
      await cancelBill(apiBase, bill.id)
      setBill(null)
      setCartItems([])
      setKot(null)
      fetchStats()
      fetchNextNumber()
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleNewBill = () => {
    setBill(null)
    setCartItems([])
    setKot(null)
    setDiscountType('percent')
    setDiscountValue(0)
    fetchNextNumber()
  }

  const displayBill = bill || {
    items: cartItems,
    subtotal,
    discountAmount,
    taxAmount: totalGst,
    serviceCharge,
    roundOff,
    totalAmount,
    taxBreakdown: { cgst: totalGst / 2, sgst: totalGst / 2, serviceCharge, roundOff: totalAmount - grossTotal },
    status: 'Pending',
  }

  const items = bill ? (bill.items || []) : cartItems

  if (!user?.hotelId) {
    return (
      <main className="p-4">
        <p className="text-slate-600">Please log in with a hotel to access restaurant billing.</p>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Restaurant Billing</h1>
        {bill && (
          <Button variant="outline" size="sm" onClick={handleNewBill}>
            New Bill
          </Button>
        )}
      </div>

      <BillStats stats={stats} />

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <CreateBillPanel
            billNumber={bill?.billNumber || billNumber}
            orderType={orderType}
            onOrderTypeChange={setOrderType}
            tableNo={tableNo}
            onTableChange={setTableNo}
            tables={tables}
            customerName={customerName}
            customerPhone={customerPhone}
            onCustomerNameChange={setCustomerName}
            onCustomerPhoneChange={setCustomerPhone}
          />

          <MenuItemSelector
            categories={categories}
            menuItems={menuItems}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onAddItem={handleAddItem}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <OfferSelector offers={offers} selectedOffer={selectedOffer} onSelect={setSelectedOffer} />
            <DiscountPanel
              discountType={discountType}
              discountValue={discountValue}
              onTypeChange={(t) => { setDiscountType(t); setDiscountValue(0) }}
              onValueChange={setDiscountValue}
              subtotal={displayBill.subtotal || subtotal}
              requiresApproval={requiresApproval}
              hasBill={!!bill}
              onApply={bill ? handleApplyDiscount : undefined}
              loading={loading}
            />
          </div>

          {!bill && (
            <Button onClick={handleCreateBill} disabled={loading || items.length === 0} className="w-full">
              {loading ? 'Creating...' : 'Create Bill'}
            </Button>
          )}
        </div>

        <div className="space-y-4">
          <Card className="border border-slate-200 sticky top-4">
            <CardHeader className="pb-2">
              <h3 className="text-sm font-semibold">Cart</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">{items.length} items</span>
                <BillActions
                  onPrint={() => window.print()}
                  onCancel={handleCancel}
                  onRefund={() => setRefundModalOpen(true)}
                  bill={bill}
                  loading={loading}
                />
              </div>
            </CardHeader>
            <CardContent className="p-2 pt-0 space-y-2">
              <div className="max-h-48 overflow-y-auto space-y-1">
                {items.map((i, idx) => (
                  <div key={i.id || idx} className="flex justify-between text-sm">
                    <span>{i.name} × {i.quantity || 1}</span>
                    <span>₹{((Number(i.price) || 0) * (Number(i.quantity) || 1)).toFixed(2)}</span>
                  </div>
                ))}
                {items.length === 0 && (
                  <p className="text-sm text-slate-500">No items</p>
                )}
              </div>

              <TaxSummary
                subtotal={displayBill.subtotal || subtotal}
                discountAmount={displayBill.discountAmount ?? discountAmount}
                taxableAmount={taxableAmount}
                cgst={displayBill.taxBreakdown?.cgst ?? totalGst / 2}
                sgst={displayBill.taxBreakdown?.sgst ?? totalGst / 2}
                serviceCharge={displayBill.taxBreakdown?.serviceCharge ?? serviceCharge}
                roundOff={displayBill.taxBreakdown?.roundOff ?? roundOff}
                totalAmount={displayBill.totalAmount ?? totalAmount}
              />

              {bill && bill.status === 'Pending' && (
                <>
                  <KOTPanel kot={kot} onGenerate={handleGenerateKOT} />
                  <PaymentPanel
                    paymentMode={paymentMode}
                    onModeChange={setPaymentMode}
                    totalAmount={displayBill.totalAmount}
                    onSettle={handleSettle}
                    loading={loading}
                    disabled={loading}
                  />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SplitBillModal
        open={splitModalOpen}
        onClose={() => setSplitModalOpen(false)}
        totalAmount={displayBill.totalAmount}
        onSplit={() => {}}
      />

      <RefundModal
        open={refundModalOpen}
        onClose={() => setRefundModalOpen(false)}
        bill={bill}
        onRefund={handleRefund}
        loading={loading}
      />

      <ManagerApprovalModal
        open={approvalModalOpen}
        onClose={() => { setApprovalModalOpen(false); setPendingDiscount(null) }}
        message={pendingDiscount ? `Manager approval required for discount of ₹${pendingDiscount.discountAmount?.toFixed(2)}` : ''}
        onApprove={handleApprovalConfirm}
        loading={loading}
      />
    </main>
  )
}
