'use client'

import { useState } from "react"
import { useAuth } from "@/app/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, User } from "lucide-react"
import type { KitchenKOT } from "./KitchenKOT"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

interface Props {
  kots: KitchenKOT[]
  onRefresh: () => void
}

export default function ChefAssignment({ kots, onRefresh }: Props) {
  const { user } = useAuth()
  const [assigning, setAssigning] = useState<string | null>(null)
  const [chefName, setChefName] = useState("")
  const [chefId, setChefId] = useState("")
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const unassignedKOTs = kots.filter((kot) => !kot.assignedChefName && kot.status !== "Completed" && kot.status !== "Cancelled")

  const handleAssign = async (kotId: string) => {
    if (!user?.hotelId || !chefName.trim()) {
      setError("Chef name is required")
      return
    }

    setSaving(true)
    setError(null)
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/kitchen-kots/${kotId}`,
        {
          method: "PUT",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignedChefId: chefId.trim() || null,
            assignedChefName: chefName.trim(),
          }),
        },
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error((data as any)?.message || `Failed to assign chef (HTTP ${res.status})`)
      }

      setChefName("")
      setChefId("")
      setAssigning(null)
      onRefresh()
    } catch (e: any) {
      console.error(e)
      setError(e?.message || "Failed to assign chef")
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3">
      <Card className="rounded-2xl bg-linear-to-r from-violet-500 to-purple-500 text-white shadow-sm border-none">
        <CardContent className="p-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-wide opacity-80">
              Unassigned KOTs
            </div>
            <div className="text-lg font-semibold">
              {unassignedKOTs.length.toString().padStart(2, "0")}
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
            Assign chef to specific KOT
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {unassignedKOTs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                All active KOTs have chefs assigned.
              </div>
            ) : (
              unassignedKOTs.map((kot) => (
                <div
                  key={kot.id}
                  className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 bg-slate-50/50"
                >
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-900 font-mono">{kot.kotNumber}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Table {kot.tableNo} • {kot.items.length} items
                    </div>
                  </div>
                  {assigning === kot.id ? (
                    <div className="flex items-center gap-1.5">
                      <Input
                        value={chefId}
                        onChange={(e) => setChefId(e.target.value)}
                        placeholder="Chef ID (optional)"
                        className="h-7 text-xs w-24"
                      />
                      <Input
                        value={chefName}
                        onChange={(e) => setChefName(e.target.value)}
                        placeholder="Chef name *"
                        className="h-7 text-xs w-32"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && chefName.trim()) {
                            handleAssign(kot.id)
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        className="h-7 px-2 text-xs bg-violet-600 hover:bg-violet-700"
                        onClick={() => handleAssign(kot.id)}
                        disabled={saving || !chefName.trim()}
                      >
                        {saving ? "Assigning..." : "Assign"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 px-2 text-xs"
                        onClick={() => {
                          setAssigning(null)
                          setChefName("")
                          setChefId("")
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      onClick={() => setAssigning(kot.id)}
                    >
                      Assign chef
                    </Button>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold text-slate-900">
            Assigned KOTs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {kots.filter((kot) => kot.assignedChefName).length === 0 ? (
              <div className="py-4 text-center text-xs text-slate-400">
                No KOTs with assigned chefs.
              </div>
            ) : (
              kots
                .filter((kot) => kot.assignedChefName)
                .map((kot) => (
                  <div
                    key={kot.id}
                    className="flex items-center justify-between p-2 rounded-lg border border-slate-200 bg-slate-50/50"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-slate-900 font-mono">{kot.kotNumber}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Chef: {kot.assignedChefName} • Table {kot.tableNo}
                      </div>
                    </div>
                    <Badge className="border text-[10px] bg-violet-100 text-violet-700 border-violet-200">
                      Assigned
                    </Badge>
                  </div>
                ))
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}
