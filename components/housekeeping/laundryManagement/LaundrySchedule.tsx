"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export type LaundryCycleType = "Daily" | "Weekly" | "On-Demand"

export interface LaundryScheduleTask {
  id: string
  loadNumber: string
  itemType: string
  quantity: number
  scheduledDate: string
  cycleType: LaundryCycleType
  status: string
}

interface LaundryScheduleProps {
  selectedDate: string
  tasks: LaundryScheduleTask[]
  creating: boolean
  onCreate: (payload: {
    loadNumber: string
    itemType: string
    quantity: number
    scheduledDate: string
    cycleType: LaundryCycleType
  }) => Promise<void> | void
}

const ITEM_TYPES = ["Bed Sheets", "Towels", "Pillow Cases", "Blankets", "Curtains", "Table Linens"]

export function LaundrySchedule({
  selectedDate,
  tasks,
  creating,
  onCreate,
}: LaundryScheduleProps) {
  const [loadNumber, setLoadNumber] = useState("")
  const [itemType, setItemType] = useState("")
  const [quantity, setQuantity] = useState<number>(0)
  const [localDate, setLocalDate] = useState(selectedDate)
  const [cycleType, setCycleType] = useState<LaundryCycleType>("Daily")

  const canSubmit = loadNumber.trim() && itemType && quantity > 0 && localDate

  const handleSubmit = async () => {
    if (!canSubmit || creating) return
    await onCreate({
      loadNumber: loadNumber.trim(),
      itemType,
      quantity,
      scheduledDate: localDate,
      cycleType,
    })
    setLoadNumber("")
    setItemType("")
    setQuantity(0)
    setCycleType("Daily")
  }

  const todaysTasks = tasks.filter((t) => t.scheduledDate === selectedDate)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Schedule laundry load
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="laundry-load-number" className="text-[11px] text-slate-700">
                Load number
              </Label>
              <Input
                id="laundry-load-number"
                placeholder="e.g., LD-2024-001"
                value={loadNumber}
                onChange={(e) => setLoadNumber(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="laundry-item-type" className="text-[11px] text-slate-700">
                Item type
              </Label>
              <select
                id="laundry-item-type"
                aria-label="Select item type"
                value={itemType}
                onChange={(e) => setItemType(e.target.value)}
                className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
              >
                <option value="">Select type</option>
                {ITEM_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label htmlFor="laundry-quantity" className="text-[11px] text-slate-700">
                Quantity
              </Label>
              <Input
                id="laundry-quantity"
                type="number"
                min={1}
                value={quantity || ""}
                onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="laundry-date" className="text-[11px] text-slate-700">
                Scheduled date
              </Label>
              <Input
                id="laundry-date"
                type="date"
                value={localDate}
                onChange={(e) => setLocalDate(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="laundry-cycle" className="text-[11px] text-slate-700">
                Cycle type
              </Label>
              <select
                id="laundry-cycle"
                aria-label="Select cycle type"
                value={cycleType}
                onChange={(e) => setCycleType(e.target.value as LaundryCycleType)}
                className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
              >
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="On-Demand">On-Demand</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit || creating}
              className="text-xs"
            >
              {creating ? "Scheduling…" : "Schedule load"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Today&apos;s schedule ({todaysTasks.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0 text-xs space-y-1.5">
          {todaysTasks.length === 0 ? (
            <p className="text-slate-500">No loads scheduled for today.</p>
          ) : (
            todaysTasks.map((t) => (
              <div
                key={t.id}
                className="rounded-md bg-slate-50 px-2 py-1.5 border border-slate-100"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-slate-900">{t.loadNumber}</span>
                    <p className="text-[11px] text-slate-600">
                      {t.itemType} • {t.quantity} items • {t.cycleType}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
