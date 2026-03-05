'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangle, Plus, Trash2, Edit2, Table as TableIcon } from "lucide-react"
import type { RestaurantTable } from "./TableManagement"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  tables: RestaurantTable[]
  onRefresh: () => void
}

export default function TableCRUD({ tables, onRefresh }: Props) {
  const { user } = useAuth()
  const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null)
  const [creating, setCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    tableNo: "",
    floor: "",
    capacity: "2",
    status: "Available" as RestaurantTable["status"],
    notes: "",
  })

  const handleCreate = async () => {
    if (!user?.hotelId || !form.tableNo.trim()) {
      setError("Table number is required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableNo: form.tableNo.trim(),
            floor: form.floor.trim() || null,
            capacity: Number(form.capacity || 2),
            status: form.status,
            notes: form.notes.trim() || null,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to create table (HTTP ${res.status})`,
        )
      }

      setCreating(false)
      setForm({
        tableNo: "",
        floor: "",
        capacity: "2",
        status: "Available",
        notes: "",
      })
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to create table")
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = async () => {
    if (!editingTable || !user?.hotelId) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${editingTable.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tableNo: form.tableNo.trim(),
            floor: form.floor.trim() || null,
            capacity: Number(form.capacity || 2),
            status: form.status,
            notes: form.notes.trim() || null,
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to update table (HTTP ${res.status})`,
        )
      }

      setEditingTable(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to update table")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!user?.hotelId || !confirm("Delete this table?")) return

    setSaving(true)
    setError(null)
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/restaurant-tables/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(
          (data as any)?.message || `Failed to delete table (HTTP ${res.status})`,
        )
      }

      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to delete table")
    } finally {
      setSaving(false)
    }
  }

  const getStatusColor = (status: RestaurantTable["status"]) => {
    const colors = {
      Available: "bg-green-100 text-green-700 border-green-200",
      Occupied: "bg-red-100 text-red-700 border-red-200",
      Reserved: "bg-purple-100 text-purple-700 border-purple-200",
      Cleaning: "bg-amber-100 text-amber-700 border-amber-200",
      "Out of Service": "bg-slate-100 text-slate-700 border-slate-200",
    }
    return colors[status] || colors.Available
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <Card className="rounded-2xl bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-sm border-none flex-1">
          <CardContent className="p-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wide opacity-80">
                Total tables
              </div>
              <div className="text-lg font-semibold">
                {tables.length.toString().padStart(2, "0")}
              </div>
            </div>
            <TableIcon className="h-8 w-8 opacity-80" />
          </CardContent>
        </Card>
        <Button
          size="sm"
          className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700 ml-3"
          onClick={() => setCreating(true)}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          Add table
        </Button>
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
            Restaurant tables
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {tables.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No tables configured yet. Click "Add table" to create your first table.
              </div>
            ) : (
              tables.map((table) => (
                <div
                  key={table.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-900">
                        {table.tableNo}
                      </span>
                      <Badge className={`border text-[10px] font-medium ${getStatusColor(table.status)}`}>
                        {table.status}
                      </Badge>
                      {table.floor && (
                        <span className="text-[11px] text-slate-500">
                          Floor {table.floor}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Capacity: {table.capacity} •{" "}
                      {table.assignedWaiterName
                        ? `Waiter: ${table.assignedWaiterName}`
                        : "No waiter assigned"}
                      {table.currentGuestName && ` • Guest: ${table.currentGuestName}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 ml-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-slate-200 text-slate-600"
                      onClick={() => {
                        setEditingTable(table)
                        setForm({
                          tableNo: table.tableNo,
                          floor: table.floor || "",
                          capacity: table.capacity.toString(),
                          status: table.status,
                          notes: table.notes || "",
                        })
                      }}
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 border-rose-200 text-rose-600"
                      onClick={() => handleDelete(table.id)}
                      disabled={saving}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={creating || !!editingTable} onOpenChange={(open) => {
        if (!open) {
          setCreating(false)
          setEditingTable(null)
          setForm({
            tableNo: "",
            floor: "",
            capacity: "2",
            status: "Available",
            notes: "",
          })
        }
      }}>
        <DialogContent className="sm:max-w-md" showCloseButton>
          <DialogHeader>
            <DialogTitle>{editingTable ? "Edit table" : "Add table"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 pt-1">
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Table number *</label>
              <Input
                value={form.tableNo}
                onChange={(e) => setForm({ ...form, tableNo: e.target.value })}
                placeholder="e.g. T-01, Table 5"
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Floor</label>
                <Input
                  value={form.floor}
                  onChange={(e) => setForm({ ...form, floor: e.target.value })}
                  placeholder="e.g. Ground, 1"
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-medium text-slate-700">Capacity *</label>
                <Input
                  type="number"
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  placeholder="2"
                  min="1"
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700" htmlFor="table-status">Status</label>
              <select
                id="table-status"
                aria-label="Table status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as RestaurantTable["status"] })}
                className="h-8 text-xs w-full rounded-md border border-slate-200 bg-white px-2"
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Reserved">Reserved</option>
                <option value="Cleaning">Cleaning</option>
                <option value="Out of Service">Out of Service</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-medium text-slate-700">Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Optional notes"
                className="h-16 w-full rounded-md border border-slate-200 px-2 py-1.5 text-xs resize-none"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => {
                  setCreating(false)
                  setEditingTable(null)
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-8 text-xs bg-blue-600 hover:bg-blue-700"
                disabled={!form.tableNo.trim() || saving}
                onClick={editingTable ? handleUpdate : handleCreate}
              >
                {saving ? "Saving..." : editingTable ? "Save" : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}
