'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  RefreshCw,
  Gift,
} from "lucide-react"
import CreateComboMeals from "./CreateComboMeals"
import DiscountOffers from "./DiscountOffers"
import CouponCodes from "./CouponCodes"
import TimeBasedOffers from "./TimeBasedOffers"
import FestivalPromotions from "./FestivalPromotions"
import BuyOneGetOne from "./BuyOneGetOne"
import MinimumOrderValue from "./MinimumOrderValue"
import ValidityPeriod from "./ValidityPeriod"
import AutoApplyOffer from "./AutoApplyOffer"
import OfferPriorityRules from "./OfferPriorityRules"
import LimitedQuantityOffer from "./LimitedQuantityOffer"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface ComboOffer {
  id: string
  name: string
  description: string | null
  items: Array<{ menuItemId: string; name: string; quantity: number; price: number }>
  comboPrice: number
  originalPrice: number
  discountAmount: number
  discountPercentage: number | null
  imageUrl: string | null
  isActive: boolean
  displayOrder: number
}

export interface DiscountOffer {
  id: string
  name: string
  description: string | null
  discountType: "Percentage" | "Flat"
  discountValue: number
  minOrderValue: number | null
  maxDiscountAmount: number | null
  applicableItems: string[] | null
  applicableCategories: string[] | null
  priority: number
  isActive: boolean
  startDate: string | null
  endDate: string | null
  startTime: string | null
  endTime: string | null
  limitedQuantity: number | null
  usedQuantity: number
  autoApply: boolean
}

export interface CouponCode {
  id: string
  code: string
  name: string
  description: string | null
  discountType: "Percentage" | "Flat"
  discountValue: number
  minOrderValue: number | null
  maxDiscountAmount: number | null
  maxUses: number | null
  usedCount: number
  maxUsesPerUser: number
  isActive: boolean
  startDate: string | null
  endDate: string | null
  applicableItems: string[] | null
  applicableCategories: string[] | null
}

export default function ComboOffers() {
  const { user } = useAuth()
  const [combos, setCombos] = useState<ComboOffer[]>([])
  const [discounts, setDiscounts] = useState<DiscountOffer[]>([])
  const [coupons, setCoupons] = useState<CouponCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadData = async () => {
    if (!user?.hotelId) {
      setError("Hotel not selected. Please login again.")
      setLoading(false)
      return
    }

    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (!token) {
      setError("Not authenticated. Please log in again.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const [combosRes, discountsRes, couponsRes] = await Promise.all([
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/combo-offers`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/discount-offers`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/coupon-codes`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ])

      const combosJson = combosRes.ok
        ? await combosRes.json().catch(() => ({}))
        : {}
      const discountsJson = discountsRes.ok
        ? await discountsRes.json().catch(() => ({}))
        : {}
      const couponsJson = couponsRes.ok
        ? await couponsRes.json().catch(() => ({}))
        : {}

      setCombos((combosJson as any).combos || [])
      setDiscounts((discountsJson as any).discounts || [])
      setCoupons((couponsJson as any).coupons || [])

    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load combo offers data. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.hotelId])

  if (loading) {
    return (
      <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
        <div className="pb-1">
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Gift className="h-4 w-4 text-purple-600" />
            Combo offers & promotions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Loading offers data…</p>
        </div>
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 flex items-center justify-center text-sm text-slate-500">
            Loading combo offers, discounts, and coupons from backend…
          </CardContent>
        </Card>
      </main>
    )
  }

  const activeCombos = combos.filter((c) => c.isActive).length
  const activeDiscounts = discounts.filter((d) => d.isActive).length
  const activeCoupons = coupons.filter((c) => c.isActive).length

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Gift className="h-4 w-4 text-purple-600" />
            Combo offers & promotions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage combo meals, discounts, coupons, time-based offers, and promotional campaigns.
          </p>
        </div>
        <button
          type="button"
          onClick={loadData}
          disabled={loading || !user?.hotelId}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Features checklist */}
      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <CardContent className="p-3">
          <div className="text-xs font-semibold text-slate-700 mb-2">Combo / Offers — Features</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Create Combo Meals
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Discount Offers
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Coupon Codes
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Time-Based Offers
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Festival Promotions
            </div>
            <div className="flex items-center gap-1.5 text-slate-500 mt-1 sm:mt-0">
              <span className="text-slate-400 font-medium">▸</span> Sub-features:
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Buy 1 Get 1
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Minimum Order Value
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Validity Period
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Auto Apply Offer
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Offer Priority Rules
            </div>
            <div className="flex items-center gap-1.5 text-slate-600">
              <span className="text-green-600 font-medium">✓</span> Limited Quantity Offer
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <Card className="rounded-xl bg-linear-to-r from-purple-500 to-pink-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Active combos
            </span>
            <span className="text-lg font-semibold">
              {activeCombos.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-blue-500 to-cyan-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Active discounts
            </span>
            <span className="text-lg font-semibold">
              {activeDiscounts.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-emerald-500 to-teal-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide opacity-80">
              Active coupons
            </span>
            <span className="text-lg font-semibold">
              {activeCoupons.toString().padStart(2, "0")}
            </span>
          </CardContent>
        </Card>
      </div>

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="combos" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="combos">Combo meals</TabsTrigger>
          <TabsTrigger value="discounts">Discounts</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="time">Time-based</TabsTrigger>
          <TabsTrigger value="festival">Festivals</TabsTrigger>
          <TabsTrigger value="bogo">BOGO</TabsTrigger>
          <TabsTrigger value="minorder">Min order</TabsTrigger>
          <TabsTrigger value="validity">Validity</TabsTrigger>
          <TabsTrigger value="auto">Auto apply</TabsTrigger>
          <TabsTrigger value="priority">Priority</TabsTrigger>
          <TabsTrigger value="limited">Limited qty</TabsTrigger>
        </TabsList>

        <TabsContent value="combos" className="space-y-3">
          <CreateComboMeals combos={combos} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="discounts" className="space-y-3">
          <DiscountOffers discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="coupons" className="space-y-3">
          <CouponCodes coupons={coupons} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="time" className="space-y-3">
          <TimeBasedOffers discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="festival" className="space-y-3">
          <FestivalPromotions discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="bogo" className="space-y-3">
          <BuyOneGetOne discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="minorder" className="space-y-3">
          <MinimumOrderValue discounts={discounts} coupons={coupons} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="validity" className="space-y-3">
          <ValidityPeriod discounts={discounts} coupons={coupons} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="auto" className="space-y-3">
          <AutoApplyOffer discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="priority" className="space-y-3">
          <OfferPriorityRules discounts={discounts} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="limited" className="space-y-3">
          <LimitedQuantityOffer discounts={discounts} onRefresh={loadData} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
