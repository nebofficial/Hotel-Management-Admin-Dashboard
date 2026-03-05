'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Leaf } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function VegNonVegTag({ items, categories, onRefresh }: Props) {
  const { user } = useAuth()
  const [toggling, setToggling] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleToggle = async (item: MenuItem) => {
    if (!user?.hotelId) return

    setToggling(item.id)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/menu-items/${item.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isVeg: !item.isVeg }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to toggle tag (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to toggle tag")
    } finally {
      setToggling(null)
    }
  }

  const vegCount = items.filter((i) => i.isVeg).length
  const nonVegCount = items.length - vegCount

  return (
    <section className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Card className="rounded-xl bg-linear-to-r from-green-500 to-emerald-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Vegetarian
              </div>
              <div className="text-lg font-semibold">{vegCount}</div>
            </div>
            <Leaf className="h-6 w-6 opacity-80" />
          </CardContent>
        </Card>
        <Card className="rounded-xl bg-linear-to-r from-red-500 to-rose-500 text-white shadow-sm border-none">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Non-vegetarian
              </div>
              <div className="text-lg font-semibold">{nonVegCount}</div>
            </div>
            <span className="text-2xl">🍖</span>
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

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Veg / Non-Veg tags
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage tags for.
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] ${
                        item.isVeg
                          ? "bg-green-100 text-green-700 border-green-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                    >
                      {item.isVeg ? "🥗 Veg" : "🍖 Non-Veg"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      disabled={toggling === item.id}
                      className={`h-7 px-2.5 rounded-md text-xs font-medium border transition-colors ${
                        item.isVeg
                          ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                          : "border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                      } disabled:opacity-50`}
                    >
                      {toggling === item.id
                        ? "Updating..."
                        : item.isVeg
                        ? "Mark Non-Veg"
                        : "Mark Veg"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
