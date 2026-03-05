'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Package } from "lucide-react"
import type { MenuItem, MenuCategory } from "./MenuManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  items: MenuItem[]
  categories: MenuCategory[]
  onRefresh: () => void
}

export default function StockLinkedItems({ items, categories, onRefresh }: Props) {
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
          body: JSON.stringify({ stockLinked: !item.stockLinked }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to toggle stock link (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to toggle stock link")
    } finally {
      setToggling(null)
    }
  }

  const linkedCount = items.filter((i) => i.stockLinked).length

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-sky-500 via-blue-500 to-indigo-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Stock-linked items
            </div>
            <div className="text-lg font-semibold">{linkedCount}</div>
          </div>
          <Package className="h-8 w-8 opacity-80" />
        </CardContent>
      </Card>

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
            Stock-linked items
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {items.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No items to manage.
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
                    {item.stockLinked && item.stockItemId && (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Linked to stock ID: {item.stockItemId.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`text-[10px] ${
                        item.stockLinked
                          ? "bg-sky-100 text-sky-700 border-sky-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {item.stockLinked ? "Linked" : "Not linked"}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleToggle(item)}
                      disabled={toggling === item.id}
                      className={`h-7 px-2.5 rounded-md text-xs font-medium border transition-colors ${
                        item.stockLinked
                          ? "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                          : "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
                      } disabled:opacity-50`}
                    >
                      {toggling === item.id
                        ? "Updating..."
                        : item.stockLinked
                        ? "Unlink"
                        : "Link"}
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
