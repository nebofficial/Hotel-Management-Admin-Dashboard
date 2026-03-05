"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, TrendingUp, TrendingDown, Package } from "lucide-react"

export interface StockLinenItem {
  id: string
  itemName: string
  category: string
  currentStock: number
  minimumThreshold: number
  maximumCapacity: number | null
  unit: string
  location: string | null
}

interface StockManagementProps {
  items: StockLinenItem[]
  creating: boolean
  onCreate: (payload: {
    itemName: string
    category: string
    currentStock: number
    minimumThreshold: number
    maximumCapacity: number | null
    unit: string
    location: string | null
  }) => Promise<void> | void
  onUpdateStock: (id: string, stock: number) => Promise<void> | void
  saving: boolean
}

const CATEGORIES = ["Bedding", "Bath", "Uniform", "Other"]
const UNITS = ["pieces", "sets", "pairs"]

export function StockManagement({
  items,
  creating,
  onCreate,
  onUpdateStock,
  saving,
}: StockManagementProps) {
  const [showForm, setShowForm] = useState(false)
  const [itemName, setItemName] = useState("")
  const [category, setCategory] = useState("Bedding")
  const [currentStock, setCurrentStock] = useState<number>(0)
  const [minimumThreshold, setMinimumThreshold] = useState<number>(50)
  const [maximumCapacity, setMaximumCapacity] = useState<string>("")
  const [unit, setUnit] = useState("pieces")
  const [location, setLocation] = useState("")

  const canSubmit = itemName.trim() && category

  const handleSubmit = async () => {
    if (!canSubmit || creating) return
    await onCreate({
      itemName: itemName.trim(),
      category,
      currentStock,
      minimumThreshold,
      maximumCapacity: maximumCapacity ? Number(maximumCapacity) : null,
      unit,
      location: location.trim() || null,
    })
    setItemName("")
    setCategory("Bedding")
    setCurrentStock(0)
    setMinimumThreshold(50)
    setMaximumCapacity("")
    setUnit("pieces")
    setLocation("")
    setShowForm(false)
  }

  const getStockStatus = (item: StockLinenItem) => {
    if (item.currentStock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-800" }
    if (item.currentStock < item.minimumThreshold) return { label: "Low Stock", color: "bg-amber-100 text-amber-800" }
    if (item.maximumCapacity && item.currentStock >= item.maximumCapacity) return { label: "Full", color: "bg-blue-100 text-blue-800" }
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-800" }
  }

  const lowStockItems = items.filter((i) => i.currentStock < i.minimumThreshold)

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-200 text-emerald-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800">Total items</p>
              <p className="text-xl font-bold text-emerald-900">{items.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-amber-50 to-amber-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-200 text-amber-700">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-amber-800">Low stock alerts</p>
              <p className="text-xl font-bold text-amber-900">{lowStockItems.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-200 text-blue-700">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800">Total stock</p>
              <p className="text-xl font-bold text-blue-900">
                {items.reduce((sum, i) => sum + i.currentStock, 0)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-200 text-purple-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-800">Categories</p>
              <p className="text-xl font-bold text-purple-900">
                {new Set(items.map((i) => i.category)).size}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Stock overview
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5"
              onClick={() => setShowForm(!showForm)}
            >
              <Plus className="h-3.5 w-3.5" />
              {showForm ? "Cancel" : "Add item"}
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {showForm && (
              <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="item-name" className="text-[11px] text-slate-700">
                      Item name
                    </Label>
                    <Input
                      id="item-name"
                      placeholder="e.g., Bed Sheets"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-category" className="text-[11px] text-slate-700">
                      Category
                    </Label>
                    <select
                      id="item-category"
                      aria-label="Select category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-stock" className="text-[11px] text-slate-700">
                      Initial stock
                    </Label>
                    <Input
                      id="item-stock"
                      type="number"
                      min={0}
                      value={currentStock || ""}
                      onChange={(e) => setCurrentStock(Number(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-threshold" className="text-[11px] text-slate-700">
                      Minimum threshold
                    </Label>
                    <Input
                      id="item-threshold"
                      type="number"
                      min={0}
                      value={minimumThreshold || ""}
                      onChange={(e) => setMinimumThreshold(Number(e.target.value) || 0)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-capacity" className="text-[11px] text-slate-700">
                      Max capacity (optional)
                    </Label>
                    <Input
                      id="item-capacity"
                      type="number"
                      min={0}
                      value={maximumCapacity}
                      onChange={(e) => setMaximumCapacity(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="item-unit" className="text-[11px] text-slate-700">
                      Unit
                    </Label>
                    <select
                      id="item-unit"
                      aria-label="Select unit"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
                    >
                      {UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="item-location" className="text-[11px] text-slate-700">
                    Storage location (optional)
                  </Label>
                  <Input
                    id="item-location"
                    placeholder="e.g., Floor 2 Storage"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleSubmit}
                    disabled={!canSubmit || creating}
                    className="text-xs"
                  >
                    {creating ? "Saving…" : "Add item"}
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-xs md:text-sm">
                <thead className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Item</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Category</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Stock</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Threshold</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                        No linen items. Add your first item to get started.
                      </td>
                    </tr>
                  ) : (
                    items.map((item) => {
                      const status = getStockStatus(item)
                      return (
                        <tr
                          key={item.id}
                          className="border-b border-slate-100 hover:bg-linear-to-r hover:from-slate-50 hover:to-white"
                        >
                          <td className="px-3 py-2 font-medium text-slate-900">{item.itemName}</td>
                          <td className="px-3 py-2 text-slate-700">
                            <Badge className="bg-blue-50 text-blue-700 text-[10px]">
                              {item.category}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-slate-700 font-semibold">
                            {item.currentStock} {item.unit}
                          </td>
                          <td className="px-3 py-2 text-slate-600 text-xs">
                            Min: {item.minimumThreshold}
                            {item.maximumCapacity && ` / Max: ${item.maximumCapacity}`}
                          </td>
                          <td className="px-3 py-2">
                            <Badge className={`text-[10px] ${status.color}`}>
                              {status.label}
                            </Badge>
                          </td>
                          <td className="px-3 py-2">
                            <Input
                              type="number"
                              min={0}
                              defaultValue={item.currentStock}
                              className="h-7 w-20 text-xs"
                              onBlur={(e) => {
                                const newStock = Number(e.target.value)
                                if (!isNaN(newStock) && newStock !== item.currentStock) {
                                  onUpdateStock(item.id, newStock)
                                }
                              }}
                              disabled={saving}
                            />
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-rose-50 to-rose-100">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-rose-900">
              Low stock alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs space-y-2">
            {lowStockItems.length === 0 ? (
              <p className="text-rose-700">All items are well stocked! 🎉</p>
            ) : (
              lowStockItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-md bg-white border border-rose-200 px-2.5 py-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-900">{item.itemName}</span>
                      <p className="text-[11px] text-slate-600">
                        Stock: {item.currentStock} / Min: {item.minimumThreshold} {item.unit}
                      </p>
                    </div>
                    <Badge className="bg-rose-100 text-rose-800 text-[10px]">
                      Reorder needed
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
