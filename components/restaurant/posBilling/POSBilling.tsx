'use client'

import { useMemo, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  CreditCard,
  Loader2,
  ReceiptIndianRupee,
  UtensilsCrossed,
} from "lucide-react"
import CartSection, { CartItem } from "./CartSection"
import MenuSection, { MenuItem } from "./MenuSection"
import PaymentSection, { PaymentState } from "./PaymentSection"
import DiscountManagement, { DiscountState } from "./DiscountManagement"
import TaxCalculation, { TaxBreakdown } from "./TaxCalculation"
import InvoicePreview from "./InvoicePreview"
import SplitBill from "./SplitBill"
import HoldResumeOrders from "./HoldResumeOrders"
import RefundCancel from "./RefundCancel"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface PosBillPayload {
  id?: string
  tableNo: string
  guestName?: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  taxAmount: number
  serviceCharge: number
  roundOff: number
  totalAmount: number
  status: "Pending" | "Paid" | "Cancelled" | "Refunded" | "On Hold"
  payment: PaymentState
  taxBreakdown: TaxBreakdown
  splitInfo?: any
}

export default function POSBilling() {
  const { user } = useAuth()

  const [selectedTable, setSelectedTable] = useState("T-01")
  const [guestName, setGuestName] = useState("")
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [paymentState, setPaymentState] = useState<PaymentState>({
    method: "Cash",
    cashAmount: 0,
    cardAmount: 0,
    upiAmount: 0,
  })
  const [discountState, setDiscountState] = useState<DiscountState>({
    type: "none",
    value: 0,
  })
  const [serviceChargeRate] = useState(5) // %
  const [gstRate] = useState(12) // total GST %
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastSavedBill, setLastSavedBill] = useState<PosBillPayload | null>(
    null,
  )

  const menu: MenuItem[] = useMemo(
    () => [
      {
        id: "M1",
        name: "Paneer Tikka",
        category: "Starters",
        price: 280,
        taxRate: 12,
      },
      {
        id: "M2",
        name: "Chicken Biryani",
        category: "Main Course",
        price: 350,
        taxRate: 12,
      },
      {
        id: "M3",
        name: "Veg Fried Rice",
        category: "Main Course",
        price: 260,
        taxRate: 12,
      },
      {
        id: "M4",
        name: "Masala Dosa",
        category: "South Indian",
        price: 180,
        taxRate: 5,
      },
      {
        id: "M5",
        name: "Cold Coffee",
        category: "Beverages",
        price: 140,
        taxRate: 18,
      },
      {
        id: "M6",
        name: "Gulab Jamun",
        category: "Desserts",
        price: 120,
        taxRate: 5,
      },
    ],
    [],
  )

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  )

  const discountAmount = useMemo(() => {
    if (discountState.type === "amount") return discountState.value
    if (discountState.type === "percent")
      return (subtotal * discountState.value) / 100
    return 0
  }, [discountState, subtotal])

  const taxableAmount = Math.max(subtotal - discountAmount, 0)

  const taxBreakdown = useMemo<TaxBreakdown>(() => {
    const gst = (taxableAmount * gstRate) / 100
    const halfGst = gst / 2
    const serviceCharge = (taxableAmount * serviceChargeRate) / 100
    const gross = taxableAmount + gst + serviceCharge
    const rounded = Math.round(gross)
    const roundOff = rounded - gross

    return {
      taxableAmount,
      cgst: halfGst,
      sgst: halfGst,
      serviceCharge,
      totalTax: gst,
      roundOff,
      grossTotal: rounded,
    }
  }, [taxableAmount, gstRate, serviceChargeRate])

  const handleSaveBill = async (status: PosBillPayload["status"]) => {
    if (!user?.hotelId) {
      setError("Hotel not selected. Please login again.")
      return
    }
    if (!cartItems.length) {
      setError("Add at least one item to the cart.")
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload: PosBillPayload = {
        tableNo: selectedTable,
        guestName: guestName || undefined,
        items: cartItems,
        subtotal,
        discountAmount,
        taxAmount: taxBreakdown.totalTax,
        serviceCharge: taxBreakdown.serviceCharge,
        roundOff: taxBreakdown.roundOff,
        totalAmount: taxBreakdown.grossTotal,
        status,
        payment: paymentState,
        taxBreakdown,
      }

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null

      console.log("Saving bill payload:", payload)

      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-bills`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      )

      console.log("Response status:", res.status, res.statusText)

      if (!res.ok) {
        let errorData: any = {}
        try {
          const text = await res.text()
          console.log("Error response text:", text)
          errorData = text ? JSON.parse(text) : {}
        } catch (e) {
          console.error("Failed to parse error response:", e)
        }
        
        const errorMsg = errorData?.message || `Failed to save bill (HTTP ${res.status})`
        const validationErrors = Array.isArray(errorData?.errors)
          ? errorData.errors.map((e: any) => e?.msg || e?.message || e?.param || String(e)).filter(Boolean).join(", ")
          : ""
        const errorDetail = errorData?.error || ""
        
        const fullError = [
          errorMsg,
          validationErrors && `Validation: ${validationErrors}`,
          errorDetail && `Details: ${errorDetail}`,
          `Status: ${res.status} ${res.statusText}`
        ].filter(Boolean).join(" | ")
        
        console.error("Full error:", fullError)
        throw new Error(fullError)
      }

      const saved = await res.json().catch(() => null)
      setLastSavedBill(saved?.bill || payload)
    } catch (e: any) {
      console.error("Error saving bill:", e)
      const errorMessage = e?.message || "Failed to save bill"
      
      // Show helpful message based on error
      if (errorMessage.includes("404") || errorMessage.includes("Route not found")) {
        setError("Backend route not found. Please restart your backend server to register the new restaurant-bills route.")
      } else if (errorMessage.includes("Database error") || errorMessage.includes("table may not exist")) {
        setError("Database table not found. Please restart your backend server to sync the restaurant_bills table.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ReceiptIndianRupee className="h-5 w-5 text-emerald-600" />
            Restaurant POS billing
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Fast billing for dine-in, takeaway, and room service with GST-ready
            invoices.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 flex items-center gap-1">
            <UtensilsCrossed className="h-3.5 w-3.5 text-emerald-500" />
            Table:
            <select
              aria-label="Select table"
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="ml-1 rounded-md border border-slate-200 bg-white px-1.5 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }).map((_, idx) => {
                const no = (idx + 1).toString().padStart(2, "0")
                return (
                  <option key={no} value={`T-${no}`}>
                    T-{no}
                  </option>
                )
              })}
            </select>
          </span>
          <span className="px-2 py-0.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-600 flex items-center gap-1">
            <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
            Mode: <span className="font-medium">{paymentState.method}</span>
          </span>
        </div>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="rounded-2xl border border-slate-200 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2 pt-3 px-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <UtensilsCrossed className="h-4 w-4 text-emerald-600" />
              Order & menu
            </CardTitle>
            <input
              placeholder="Guest name / Room no (optional)"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <MenuSection
                menu={menu}
                onAddItem={(item) => {
                  setCartItems((prev) => {
                    const existing = prev.find((p) => p.id === item.id)
                    if (existing) {
                      return prev.map((p) =>
                        p.id === item.id
                          ? { ...p, quantity: p.quantity + 1 }
                          : p,
                      )
                    }
                    return [
                      ...prev,
                      { ...item, quantity: 1, notes: "", id: item.id },
                    ]
                  })
                }}
              />
              <CartSection
                items={cartItems}
                onChangeItems={setCartItems}
                subtotal={subtotal}
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <DiscountManagement
            subtotal={subtotal}
            state={discountState}
            onChange={setDiscountState}
          />
          <TaxCalculation breakdown={taxBreakdown} />
          <PaymentSection
            total={taxBreakdown.grossTotal}
            state={paymentState}
            onChange={setPaymentState}
          />
        </div>
      </div>

      <Tabs defaultValue="invoice" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="invoice">Invoice preview</TabsTrigger>
          <TabsTrigger value="split">Split bill</TabsTrigger>
          <TabsTrigger value="hold">Hold / resume</TabsTrigger>
          <TabsTrigger value="refund">Refund / cancel</TabsTrigger>
        </TabsList>
        <TabsContent value="invoice" className="space-y-3">
          <InvoicePreview
            tableNo={selectedTable}
            guestName={guestName}
            items={cartItems}
            subtotal={subtotal}
            discountAmount={discountAmount}
            taxBreakdown={taxBreakdown}
            payment={paymentState}
            lastSavedBill={lastSavedBill}
            loading={loading}
            onConfirm={() => handleSaveBill("Paid")}
            onHold={() => handleSaveBill("On Hold")}
          />
        </TabsContent>
        <TabsContent value="split">
          <SplitBill items={cartItems} total={taxBreakdown.grossTotal} />
        </TabsContent>
        <TabsContent value="hold">
          <HoldResumeOrders />
        </TabsContent>
        <TabsContent value="refund">
          <RefundCancel />
        </TabsContent>
      </Tabs>

      {loading && (
        <div className="fixed inset-x-0 bottom-4 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white text-xs px-3 py-1.5 shadow-lg pointer-events-auto">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving bill…
          </div>
        </div>
      )}
    </main>
  )
}

