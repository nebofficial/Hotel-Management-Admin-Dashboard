'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, User } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function AssignWaiter({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [assigning, setAssigning] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [waiterId, setWaiterId] = useState("")
  const [waiterName, setWaiterName] = useState("")

  const handleAssign = async (tableId: string) => {
    if (!user?.hotelId || !waiterName.trim()) {
      setError("Waiter name is required")
      return
    }

    setAssigning(tableId)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${tableId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedWaiterId: waiterId.trim() || null,
            assignedWaiterName: waiterName.trim(),
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to assign waiter (HTTP ${res.status})`,
        )
      }

      setWaiterId("")
      setWaiterName("")
      setAssigning(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to assign waiter")
      setAssigning(null)
    }
  }

  const handleUnassign = async (tableId: string) => {
    if (!user?.hotelId) return

    setAssigning(tableId)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${tableId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedWaiterId: null,
            assignedWaiterName: null,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to unassign waiter (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to unassign waiter")
    } finally {
      setAssigning(null)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-indigo-500 via-blue-500 to-cyan-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Tables with waiters
            </div>
            <div className="text-lg font-semibold">
              {tables.filter((t) => t.assignedWaiterName).length} / {tables.length}
            </div>
          </div>
          <User className="h-8 w-8 opacity-80" />
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
            Waiter assignment
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {tables.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tables to assign waiters to.
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
                    {table.assignedWaiterName ? (
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Waiter: {table.assignedWaiterName}
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        No waiter assigned
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {table.assignedWaiterName ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleUnassign(table.id)}
                        disabled={assigning === table.id}
                      >
                        {assigning === table.id ? "Removing..." : "Unassign"}
                      </Button>
                    ) : (
                      <div className="flex items-center gap-1.5">
                        <Input
                          value={assigning === table.id ? waiterName : ""}
                          onChange={(e) => setWaiterName(e.target.value)}
                          placeholder="Waiter name"
                          className="h-7 text-xs w-32"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && waiterName.trim()) {
                              handleAssign(table.id)
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-7 px-2 text-xs bg-indigo-600 hover:bg-indigo-700"
                          onClick={() => handleAssign(table.id)}
                          disabled={assigning === table.id || !waiterName.trim()}
                        >
                          {assigning === table.id ? "Assigning..." : "Assign"}
                        </Button>
                      </div>
                    )}
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
