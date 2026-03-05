"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DoorOpen, User, Calendar, Package } from "lucide-react"

export type UsageCondition = "New" | "Good" | "Worn" | "Damaged"
export type IssuedType = "Room" | "Staff"

export interface UsageTrackingRecord {
  id: string
  linenItemId: string
  itemName: string
  quantity: number
  issuedTo: string
  issuedType: IssuedType
  condition: UsageCondition
  issuedDate: string
  returnedDate: string | null
  returnedCondition: UsageCondition | null
}

export interface UsageLinenItem {
  id: string
  itemName: string
  currentStock: number
}

interface UsageTrackingProps {
  usage: UsageTrackingRecord[]
  items: UsageLinenItem[]
  creating: boolean
  onIssue: (payload: {
    linenItemId: string
    itemName: string
    quantity: number
    issuedTo: string
    issuedType: IssuedType
    condition: UsageCondition
  }) => Promise<void> | void
  onReturn: (id: string, returnedCondition: UsageCondition) => Promise<void> | void
  saving: boolean
}

export function UsageTracking({
  usage,
  items,
  creating,
  onIssue,
  onReturn,
  saving,
}: UsageTrackingProps) {
  const [showForm, setShowForm] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState("")
  const [quantity, setQuantity] = useState<number>(1)
  const [issuedTo, setIssuedTo] = useState("")
  const [issuedType, setIssuedType] = useState<IssuedType>("Room")
  const [condition, setCondition] = useState<UsageCondition>("Good")

  const canSubmit = selectedItemId && quantity > 0 && issuedTo.trim()

  const handleIssue = async () => {
    if (!canSubmit || creating) return
    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return
    await onIssue({
      linenItemId: selectedItemId,
      itemName: item.itemName,
      quantity,
      issuedTo: issuedTo.trim(),
      issuedType,
      condition,
    })
    setSelectedItemId("")
    setQuantity(1)
    setIssuedTo("")
    setIssuedType("Room")
    setCondition("Good")
    setShowForm(false)
  }

  const activeUsage = usage.filter((u) => !u.returnedDate)
  const returnedUsage = usage.filter((u) => u.returnedDate)

  const conditionColor = (c: UsageCondition) => {
    if (c === "New") return "bg-emerald-100 text-emerald-800"
    if (c === "Good") return "bg-blue-100 text-blue-800"
    if (c === "Worn") return "bg-amber-100 text-amber-800"
    return "bg-rose-100 text-rose-800"
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-blue-50 to-blue-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-200 text-blue-700">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-blue-800">Active issues</p>
              <p className="text-xl font-bold text-blue-900">{activeUsage.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-emerald-50 to-emerald-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-200 text-emerald-700">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800">Returned</p>
              <p className="text-xl font-bold text-emerald-900">{returnedUsage.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-linear-to-br from-purple-50 to-purple-100">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-200 text-purple-700">
              <DoorOpen className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-purple-800">To rooms</p>
              <p className="text-xl font-bold text-purple-900">
                {activeUsage.filter((u) => u.issuedType === "Room").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white lg:col-span-2">
          <CardHeader className="pb-2 pt-4 px-4 flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Usage tracking
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="text-xs gap-1.5"
              onClick={() => setShowForm(!showForm)}
            >
              {showForm ? "Cancel" : "Issue linen"}
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            {showForm && (
              <div className="mb-4 p-3 rounded-lg bg-linear-to-r from-blue-50 to-purple-50 border border-blue-100 space-y-3 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="usage-item" className="text-[11px] text-slate-700">
                      Linen item
                    </Label>
                    <select
                      id="usage-item"
                      aria-label="Select linen item"
                      value={selectedItemId}
                      onChange={(e) => setSelectedItemId(e.target.value)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
                    >
                      <option value="">Select item</option>
                      {items.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.itemName} (Stock: {item.currentStock})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="usage-quantity" className="text-[11px] text-slate-700">
                      Quantity
                    </Label>
                    <Input
                      id="usage-quantity"
                      type="number"
                      min={1}
                      value={quantity || ""}
                      onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="usage-to" className="text-[11px] text-slate-700">
                      Issue to
                    </Label>
                    <Input
                      id="usage-to"
                      placeholder={issuedType === "Room" ? "Room number" : "Staff name"}
                      value={issuedTo}
                      onChange={(e) => setIssuedTo(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="usage-type" className="text-[11px] text-slate-700">
                      Type
                    </Label>
                    <select
                      id="usage-type"
                      aria-label="Select issue type"
                      value={issuedType}
                      onChange={(e) => setIssuedType(e.target.value as IssuedType)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
                    >
                      <option value="Room">Room</option>
                      <option value="Staff">Staff</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="usage-condition" className="text-[11px] text-slate-700">
                      Condition
                    </Label>
                    <select
                      id="usage-condition"
                      aria-label="Select condition"
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as UsageCondition)}
                      className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs text-gray-700 w-full"
                    >
                      <option value="New">New</option>
                      <option value="Good">Good</option>
                      <option value="Worn">Worn</option>
                      <option value="Damaged">Damaged</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    size="sm"
                    onClick={handleIssue}
                    disabled={!canSubmit || creating}
                    className="text-xs"
                  >
                    {creating ? "Issuing…" : "Issue linen"}
                  </Button>
                </div>
              </div>
            )}

            <div className="overflow-x-auto rounded-lg border border-slate-100">
              <table className="w-full text-xs md:text-sm">
                <thead className="border-b border-slate-200 bg-linear-to-r from-slate-50 to-slate-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Item</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Issued to</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Qty</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Condition</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Date</th>
                    <th className="px-3 py-2 text-left font-semibold text-slate-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {activeUsage.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                        No active linen issues.
                      </td>
                    </tr>
                  ) : (
                    activeUsage.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-100 hover:bg-linear-to-r hover:from-blue-50 hover:to-white"
                      >
                        <td className="px-3 py-2 font-medium text-slate-900">{u.itemName}</td>
                        <td className="px-3 py-2 text-slate-700">
                          <div className="flex items-center gap-1.5">
                            {u.issuedType === "Room" ? (
                              <DoorOpen className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                              <User className="h-3.5 w-3.5 text-purple-600" />
                            )}
                            <span>{u.issuedTo}</span>
                            <Badge
                              className={
                                u.issuedType === "Room"
                                  ? "bg-blue-50 text-blue-700"
                                  : "bg-purple-50 text-purple-700"
                              }
                              style={{ fontSize: "10px" }}
                            >
                              {u.issuedType}
                            </Badge>
                          </div>
                        </td>
                        <td className="px-3 py-2 text-slate-700 font-semibold">{u.quantity}</td>
                        <td className="px-3 py-2">
                          <Badge className={`text-[10px] ${conditionColor(u.condition)}`}>
                            {u.condition}
                          </Badge>
                        </td>
                        <td className="px-3 py-2 text-slate-600 text-xs">{u.issuedDate}</td>
                        <td className="px-3 py-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-[10px] h-6 px-2"
                            disabled={saving}
                            onClick={() => onReturn(u.id, u.condition)}
                          >
                            Mark returned
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-slate-100 shadow-sm rounded-2xl bg-white">
          <CardHeader className="pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-900">
              Recent returns
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-xs space-y-1.5">
            {returnedUsage.length === 0 ? (
              <p className="text-slate-500">No returns yet.</p>
            ) : (
              returnedUsage.slice(0, 10).map((u) => (
                <div
                  key={u.id}
                  className="rounded-md bg-slate-50 border border-slate-100 px-2.5 py-1.5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium text-slate-900">{u.itemName}</span>
                      <p className="text-[11px] text-slate-600">
                        {u.issuedTo} • {u.quantity} {u.quantity === 1 ? "piece" : "pieces"}
                      </p>
                    </div>
                    {u.returnedCondition && (
                      <Badge
                        className={`text-[10px] ${conditionColor(u.returnedCondition)}`}
                      >
                        {u.returnedCondition}
                      </Badge>
                    )}
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
