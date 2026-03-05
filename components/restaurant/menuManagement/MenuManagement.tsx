'use client'

import { useEffect, useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  AlertTriangle,
  ChefHat,
  RefreshCw,
  UtensilsCrossed,
} from "lucide-react"
import FoodItems from "./FoodItems"
import CategoryManagement from "./CategoryManagement"
import PricingControl from "./PricingControl"
import AvailabilityToggle from "./AvailabilityToggle"
import TaxConfiguration from "./TaxConfiguration"
import ImageUpload from "./ImageUpload"
import VegNonVegTag from "./VegNonVegTag"
import AddOns from "./AddOns"
import TimeBasedPricing from "./TimeBasedPricing"
import StockLinkedItems from "./StockLinkedItems"
import RecipeMapping from "./RecipeMapping"
import ComboLinking from "./ComboLinking"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export interface MenuCategory {
  id: string
  name: string
  description: string | null
  displayOrder: number
  isActive: boolean
  colorTag: string | null
}

export interface MenuItem {
  id: string
  name: string
  description: string | null
  categoryId: string
  price: number
  taxRate: number
  isAvailable: boolean
  isVeg: boolean
  imageUrl: string | null
  addOns: Array<{ name: string; price: number }>
  timeBasedPricing: any
  stockLinked: boolean
  stockItemId: string | null
  recipeMapping: any
  comboLinked: boolean
  comboItems: string[]
  displayOrder: number
}

export default function MenuManagement() {
  const { user } = useAuth()
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
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
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/menu-categories?includeInactive=true`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
        fetch(
          `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items`,
          { headers: { Authorization: `Bearer ${token}` } },
        ),
      ])

      const categoriesJson = categoriesRes.ok
        ? await categoriesRes.json().catch(() => ({}))
        : {}
      const itemsJson = itemsRes.ok
        ? await itemsRes.json().catch(() => ({}))
        : {}

      const cats = (categoriesJson as any).categories || []
      setCategories(
        cats.map((c: any) => ({
          id: String(c.id),
          name: String(c.name),
          description: c.description ? String(c.description) : null,
          displayOrder: Number(c.displayOrder || 0),
          isActive: c.isActive !== false,
          colorTag: c.colorTag ? String(c.colorTag) : null,
        })),
      )

      const its = (itemsJson as any).items || []
      setItems(
        its.map((i: any) => ({
          id: String(i.id),
          name: String(i.name),
          description: i.description ? String(i.description) : null,
          categoryId: String(i.categoryId),
          price: Number(i.price || 0),
          taxRate: Number(i.taxRate || 0),
          isAvailable: i.isAvailable !== false,
          isVeg: i.isVeg !== false,
          imageUrl: i.imageUrl ? String(i.imageUrl) : null,
          addOns: Array.isArray(i.addOns) ? i.addOns : [],
          timeBasedPricing: i.timeBasedPricing || null,
          stockLinked: Boolean(i.stockLinked),
          stockItemId: i.stockItemId ? String(i.stockItemId) : null,
          recipeMapping: i.recipeMapping || null,
          comboLinked: Boolean(i.comboLinked),
          comboItems: Array.isArray(i.comboItems) ? i.comboItems : [],
          displayOrder: Number(i.displayOrder || 0),
        })),
      )
    } catch (e: any) {
      console.error(e)
      setError(
        e instanceof Error
          ? e.message
          : "Failed to load menu data. Please try again.",
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
            <ChefHat className="h-4 w-4 text-orange-600" />
            Menu management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">Loading menu data…</p>
        </div>
        <Card className="rounded-2xl border border-slate-200 bg-white">
          <CardContent className="p-6 flex items-center justify-center text-sm text-slate-500">
            Loading categories and items from backend…
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4 bg-[#f3f4f6] min-h-[calc(100vh-3rem)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <ChefHat className="h-4 w-4 text-orange-600" />
            Menu management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage food items, categories, pricing, availability, taxes, and
            more for your restaurant menu.
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

      {error && (
        <Card className="border border-red-100 bg-red-50 rounded-xl">
          <CardContent className="p-2.5 flex items-center gap-2 text-xs text-red-800">
            <AlertTriangle className="h-4 w-4" />
            <span>{error}</span>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="items" className="space-y-3">
        <TabsList className="bg-white border border-slate-200 rounded-full px-1 py-0.5 text-xs flex flex-wrap gap-1">
          <TabsTrigger value="items" className="flex items-center gap-1">
            <UtensilsCrossed className="h-3 w-3" />
            Food items
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-1">
            <ChefHat className="h-3 w-3" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-1">
            💰 Pricing
          </TabsTrigger>
          <TabsTrigger value="availability" className="flex items-center gap-1">
            ✓ Availability
          </TabsTrigger>
          <TabsTrigger value="tax" className="flex items-center gap-1">
            📊 Tax
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-1">
            🖼️ Images
          </TabsTrigger>
          <TabsTrigger value="veg" className="flex items-center gap-1">
            🥗 Veg/Non-Veg
          </TabsTrigger>
          <TabsTrigger value="addons" className="flex items-center gap-1">
            ➕ Add-ons
          </TabsTrigger>
          <TabsTrigger value="time" className="flex items-center gap-1">
            ⏰ Time pricing
          </TabsTrigger>
          <TabsTrigger value="stock" className="flex items-center gap-1">
            📦 Stock link
          </TabsTrigger>
          <TabsTrigger value="recipe" className="flex items-center gap-1">
            📝 Recipe
          </TabsTrigger>
          <TabsTrigger value="combo" className="flex items-center gap-1">
            🍽️ Combos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-3">
          <FoodItems
            items={items}
            categories={categories}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="categories" className="space-y-3">
          <CategoryManagement
            categories={categories}
            onRefresh={loadData}
          />
        </TabsContent>

        <TabsContent value="pricing" className="space-y-3">
          <PricingControl items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="availability" className="space-y-3">
          <AvailabilityToggle items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="tax" className="space-y-3">
          <TaxConfiguration items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="images" className="space-y-3">
          <ImageUpload items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="veg" className="space-y-3">
          <VegNonVegTag items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="addons" className="space-y-3">
          <AddOns items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="time" className="space-y-3">
          <TimeBasedPricing items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="stock" className="space-y-3">
          <StockLinkedItems items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="recipe" className="space-y-3">
          <RecipeMapping items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>

        <TabsContent value="combo" className="space-y-3">
          <ComboLinking items={items} categories={categories} onRefresh={loadData} />
        </TabsContent>
      </Tabs>
    </main>
  )
}
