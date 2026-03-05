'use client'

import { useMemo, useState } from "react"
import type { BarInventoryItem } from "./BarOrderTracking"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { AlertTriangle, Beer, Plus, TrendingDown } from "lucide-react"

interface Props {
  items: BarInventoryItem[]
  onCreateItem: (payload: Partial<BarInventoryItem>) => Promise<any>
  onUpdateItem: (id: string, patch: Partial<BarInventoryItem>) => Promise<any>
}

function stockBadge(item: BarInventoryItem) {
  const low = item.currentStock <= item.reorderLevel
  return low
    ? "bg-red-100 text-red-700 border-red-200"
    : "bg-emerald-100 text-emerald-700 border-emerald-200"
}

export default function AlcoholInventoryTracking({
  items,
  onCreateItem,
  onUpdateItem,
}: Props) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("ml")
  const [currentStock, setCurrentStock] = useState(1500)
  const [reorderLevel, setReorderLevel] = useState(300)
  const [isAlcohol, setIsAlcohol] = useState(true)
  const [bottleSizeMl, setBottleSizeMl] = useState(750)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sorted = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => (a.currentStock <= a.reorderLevel ? -1 : 1) - (b.currentStock <= b.reorderLevel ? -1 : 1))
  }, [items])

  const handleCreate = async () => {
    setError(null)
    if (!name.trim()) {
      setError("Name is required")
      return
    }
    setCreating(true)
    try {
      await onCreateItem({
        name: name.trim(),
        category: category.trim() || null,
        unit: unit.trim() || null,
        currentStock: Number(currentStock || 0),
        reorderLevel: Number(reorderLevel || 0),
        isAlcohol: Boolean(isAlcohol),
        bottleSizeMl: bottleSizeMl != null ? Number(bottleSizeMl || 0) : null,
      })
      setName("")
      setCategory("")
    } catch (e: any) {
      setError(e?.message || "Failed to create inventory item")
    } finally {
      setCreating(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-emerald-600 to-teal-600 text-white border-none shadow-sm">
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Beer className="h-4 w-4" />
            Alcohol Inventory Tracking
            <Badge className="bg-white/15 text-white border-none">
              Low-stock warnings
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs opacity-95">
          Stock cards with low-stock indicators. Backend-ready CRUD is enabled.
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
            Add / update bar inventory
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="inv-name">Name</Label>
              <Input
                id="inv-name"
                aria-label="Inventory item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Whisky, Beer, Wine…"
              />
            </div>
            <div className="md:col-span-1 space-y-1.5">
              <Label htmlFor="inv-category">Category</Label>
              <Input
                id="inv-category"
                aria-label="Inventory category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Whisky"
              />
            </div>
            <div className="md:col-span-1 space-y-1.5">
              <Label htmlFor="inv-unit">Unit</Label>
              <Input
                id="inv-unit"
                aria-label="Inventory unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="ml"
              />
            </div>
            <div className="md:col-span-1 space-y-1.5">
              <Label htmlFor="inv-stock">Stock</Label>
              <Input
                id="inv-stock"
                aria-label="Current stock"
                type="number"
                min={0}
                value={currentStock}
                onChange={(e) => setCurrentStock(Number(e.target.value || 0))}
              />
            </div>
            <div className="md:col-span-1 space-y-1.5">
              <Label htmlFor="inv-reorder">Reorder</Label>
              <Input
                id="inv-reorder"
                aria-label="Reorder level"
                type="number"
                min={0}
                value={reorderLevel}
                onChange={(e) => setReorderLevel(Number(e.target.value || 0))}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                aria-label="Is alcohol"
                checked={isAlcohol}
                onCheckedChange={(c) => setIsAlcohol(Boolean(c))}
              />
              <span className="text-sm text-slate-700">Alcohol item</span>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="inv-bottle" className="text-sm text-slate-700">
                Bottle size (ml)
              </Label>
              <Input
                id="inv-bottle"
                aria-label="Bottle size"
                type="number"
                min={0}
                value={bottleSizeMl}
                onChange={(e) => setBottleSizeMl(Number(e.target.value || 0))}
                className="h-9 w-[140px]"
              />
            </div>
            <Button
              type="button"
              disabled={creating}
              onClick={handleCreate}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add item
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {sorted.length === 0 ? (
          <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm sm:col-span-2 lg:col-span-3">
            <CardContent className="p-8 text-center text-sm text-slate-500">
              No inventory items yet. Add a few to start tracking stock.
            </CardContent>
          </Card>
        ) : (
          sorted.map((it) => {
            const low = it.currentStock <= it.reorderLevel
            return (
              <Card
                key={it.id}
                className="rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm font-semibold text-slate-900 flex items-center justify-between gap-2">
                    <span className="truncate">{it.name}</span>
                    <Badge className={`border ${stockBadge(it)}`}>
                      {low ? (
                        <>
                          <TrendingDown className="h-3.5 w-3.5 mr-1" />
                          Low
                        </>
                      ) : (
                        "OK"
                      )}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-3 pt-0 space-y-2">
                  <div className="text-xs text-slate-500">
                    {it.category || "Uncategorized"} • {it.isAlcohol ? "Alcohol" : "Non-alcohol"}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <Label htmlFor={`stock-${it.id}`}>Stock</Label>
                      <Input
                        id={`stock-${it.id}`}
                        aria-label={`Stock for ${it.name}`}
                        type="number"
                        min={0}
                        value={it.currentStock}
                        onChange={(e) =>
                          onUpdateItem(it.id, { currentStock: Number(e.target.value || 0) })
                        }
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor={`reorder-${it.id}`}>Reorder</Label>
                      <Input
                        id={`reorder-${it.id}`}
                        aria-label={`Reorder level for ${it.name}`}
                        type="number"
                        min={0}
                        value={it.reorderLevel}
                        onChange={(e) =>
                          onUpdateItem(it.id, { reorderLevel: Number(e.target.value || 0) })
                        }
                      />
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Bottle: {it.bottleSizeMl ? `${it.bottleSizeMl} ml` : "—"} • Unit: {it.unit || "—"}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </section>
  )
}

