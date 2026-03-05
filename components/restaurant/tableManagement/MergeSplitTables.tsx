'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Merge, Split } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function MergeSplitTables({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [merging, setMerging] = useState(false)
  const [selectedTables, setSelectedTables] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleToggleTable = (tableId: string) => {
    setSelectedTables((prev) =>
      prev.includes(tableId)
        ? prev.filter((id) => id !== tableId)
        : [...prev, tableId],
    )
  }

  const handleMerge = async () => {
    if (!user?.hotelId || selectedTables.length < 2) {
      setError("Select at least 2 tables to merge")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const [firstTable, ...otherTables] = selectedTables
      const otherTableIds = otherTables

      // Update first table with merged info
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${firstTable}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mergedWith: otherTableIds,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to merge tables (HTTP ${res.status})`,
        )
      }

      setMerging(false)
      setSelectedTables([])
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to merge tables")
    } finally {
      setSaving(false)
    }
  }

  const mergedTables = tables.filter((t) => t.mergedWith && t.mergedWith.length > 0)

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-teal-500 via-cyan-500 to-blue-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Merged tables
            </div>
            <div className="text-lg font-semibold">{mergedTables.length}</div>
          </div>
          <Merge className="h-8 w-8 opacity-80" />
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
          <CardTitle className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Merge className="h-4 w-4 text-teal-600" />
            Merge / Split tables
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {mergedTables.length > 0 && (
              <div className="mb-3 p-2 rounded-lg bg-teal-50 border border-teal-200">
                <div className="text-xs font-semibold text-teal-900 mb-1">
                  Currently merged:
                </div>
                {mergedTables.map((table) => (
                  <div key={table.id} className="text-[11px] text-teal-700">
                    {table.tableNo} merged with:{" "}
                    {table.mergedWith.map((id) => {
                      const t = tables.find((tb) => tb.id === id)
                      return t?.tableNo
                    }).filter(Boolean).join(", ")}
                  </div>
                ))}
              </div>
            )}
            <Button
              size="sm"
              className="h-8 px-3 text-xs bg-teal-600 hover:bg-teal-700 w-full"
              onClick={() => setMerging(true)}
            >
              <Merge className="h-3.5 w-3.5 mr-1" />
              Merge tables
            </Button>
            <div className="text-[11px] text-slate-500 pt-1">
              Select multiple tables to merge them into one larger seating area.
              Merged tables share the same status and can be split later.
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={merging} onOpenChange={setMerging}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>Merge tables</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 pt-1 max-h-[60vh] overflow-y-auto">
            <div className="text-xs text-slate-500">
              Select tables to merge (minimum 2)
            </div>
            <div className="space-y-1.5">
              {tables.map((table) => (
                <div
                  key={table.id}
                  className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-colors ${
                    selectedTables.includes(table.id)
                      ? "border-teal-500 bg-teal-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                  onClick={() => handleToggleTable(table.id)}
                >
                  <div>
                    <div className="text-xs font-medium text-slate-900">
                      {table.tableNo}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Capacity: {table.capacity} • {table.status}
                    </div>
                  </div>
                  {selectedTables.includes(table.id) && (
                    <div className="h-4 w-4 rounded-full bg-teal-600" />
                  )}
                </div>
              ))}
            </div>
            {selectedTables.length > 0 && (
              <div className="p-2 rounded bg-teal-50 border border-teal-200">
                <div className="text-xs font-semibold text-teal-900 mb-1">
                  Selected ({selectedTables.length}):
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedTables.map((id) => {
                    const table = tables.find((t) => t.id === id)
                    return table ? (
                      <Badge
                        key={id}
                        className="bg-teal-100 text-teal-700 border-teal-200 text-[10px]"
                      >
                        {table.tableNo}
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setMerging(false)
                  setSelectedTables([])
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-teal-600 hover:bg-teal-700"
                onClick={handleMerge}
                disabled={saving || selectedTables.length < 2}
              >
                {saving ? "Merging..." : "Merge"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
