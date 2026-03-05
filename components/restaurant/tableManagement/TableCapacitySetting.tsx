'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertTriangle, Users } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function TableCapacitySetting({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingCapacity, setEditingCapacity] = useState<{ id: string; capacity: number } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newCapacity, setNewCapacity] = useState("")

  const handleUpdateCapacity = async () => {
    if (!editingCapacity || !user?.hotelId || !newCapacity) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${editingCapacity.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ capacity: Number(newCapacity) }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update capacity (HTTP ${res.status})`,
        )
      }

      setEditingCapacity(null)
      setNewCapacity("")
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update capacity")
    } finally {
      setSaving(false)
    }
  }

  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0)
  const avgCapacity = tables.length > 0 ? totalCapacity / tables.length : 0

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-500 via-purple-500 to-fuchsia-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Average capacity
            </div>
            <div className="text-lg font-semibold">
              {avgCapacity.toFixed(1)} seats
            </div>
          </div>
          <Users className="h-8 w-8 opacity-80" />
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
            Table capacity settings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {tables.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tables to manage capacity for.
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900">
                      {table.tableNo}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-violet-700">
                      {table.capacity} seats
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => {
                        setEditingCapacity({ id: table.id, capacity: table.capacity })
                        setNewCapacity(table.capacity.toString())
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {editingCapacity && (
        <Card className="rounded-2xl border border-violet-200 bg-violet-50 shadow-sm">
          <CardContent className="p-3 space-y-2">
            <div className="text-xs font-semibold text-violet-900">
              Update capacity
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                placeholder="Capacity"
                min="1"
                className="h-8 text-xs flex-1"
              />
              <Button
                size="sm"
                className="h-8 px-3 text-xs bg-violet-600 hover:bg-violet-700"
                onClick={handleUpdateCapacity}
                disabled={saving || !newCapacity}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => {
                  setEditingCapacity(null)
                  setNewCapacity("")
                }}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  )
}
