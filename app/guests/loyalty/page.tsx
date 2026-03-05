"use client"

import { useEffect, useMemo, useState } from "react"
import { Gift, Coins, Award, History } from "lucide-react"
import { useAuth } from "@/app/auth-context"
import { GuestSectionHeader } from "@/components/guests/guest-section-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

const SUB_FEATURES = [
  "Assign loyalty points",
  "Auto-calculate points after checkout",
  "Redeem loyalty points",
  "Membership levels (Silver, Gold, Platinum)",
  "Offer special discounts",
  "Track reward usage history",
]

const MEMBERSHIPS = [
  { level: "Silver", minPoints: 0, discount: "5%", color: "bg-gray-200 text-gray-800" },
  { level: "Gold", minPoints: 2000, discount: "10%", color: "bg-amber-100 text-amber-800" },
  { level: "Platinum", minPoints: 5000, discount: "15%", color: "bg-purple-100 text-purple-800" },
]

interface LoyaltyMember {
  id: string
  name: string
  email: string
  points: number
  tier: string
  totalStays: number
  totalSpent: number
  lastUpdated: string
}

export default function LoyaltyPage() {
  const { user } = useAuth()
  const [members, setMembers] = useState<LoyaltyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [addInputs, setAddInputs] = useState<Record<string, string>>({})
  const [redeemInputs, setRedeemInputs] = useState<Record<string, string>>({})

  const fetchLoyalty = () => {
    if (!user?.hotelId) {
      setLoading(false)
      setMembers([])
      setError("No hotel associated with your account.")
      return
    }
    const token = localStorage.getItem("token")
    setLoading(true)
    setError(null)
    fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/loyalty`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (r) => {
        if (!r.ok) {
          const data = await r.json().catch(() => ({}))
          throw new Error(data?.message || `Failed to load loyalty data (${r.status})`)
        }
        return r.json()
      })
      .then((data) => {
        const items = (data.members || []).map((m: any) => ({
          id: String(m.id),
          name: [m.firstName, m.lastName].filter(Boolean).join(" ") || m.email || "—",
          email: m.email,
          points: Number(m.loyaltyPoints || 0),
          tier: m.loyaltyTier || "Silver",
          totalStays: Number(m.loyaltyTotalStays || 0),
          totalSpent: Number(m.loyaltyTotalSpent || 0),
          lastUpdated: m.loyaltyLastUpdated
            ? new Date(m.loyaltyLastUpdated).toISOString().slice(0, 10)
            : "",
        }))
        setMembers(items)
      })
      .catch((e) => {
        console.error(e)
        setError(e instanceof Error ? e.message : "Failed to load loyalty data.")
        setMembers([])
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    fetchLoyalty()
  }, [user?.hotelId])

  const addPoints = async (member: LoyaltyMember) => {
    if (!user?.hotelId) return
    const raw = addInputs[member.id] || ""
    const points = parseInt(raw, 10)
    if (!Number.isFinite(points) || points <= 0) {
      setError("Please enter a positive number of points to add.")
      return
    }
    setSavingId(member.id)
    setError(null)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/loyalty/${member.id}/add-points`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ points }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to add points (${res.status})`)
      }
      const data = await res.json()
      const g = data.guest
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                points: Number(g.loyaltyPoints || 0),
                tier: g.loyaltyTier || m.tier,
                totalStays: Number(g.loyaltyTotalStays || m.totalStays),
                totalSpent: Number(g.loyaltyTotalSpent || m.totalSpent),
                lastUpdated: g.loyaltyLastUpdated
                  ? new Date(g.loyaltyLastUpdated).toISOString().slice(0, 10)
                  : m.lastUpdated,
              }
            : m
        )
      )
      setAddInputs((prev) => ({ ...prev, [member.id]: "" }))
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : "Failed to add loyalty points.")
    } finally {
      setSavingId(null)
    }
  }

  const redeemPoints = async (member: LoyaltyMember) => {
    if (!user?.hotelId) return
    const raw = redeemInputs[member.id] || ""
    const points = parseInt(raw, 10)
    if (!Number.isFinite(points) || points <= 0) {
      setError("Please enter a positive number of points to redeem.")
      return
    }
    // Match backend rule: minimum redeemable points (LOYALTY_MIN_REDEEM = 100)
    if (points < 100) {
      setError("Minimum redeem is 100 points.")
      return
    }
    if (points > member.points) {
      setError("Cannot redeem more points than available.")
      return
    }
    setSavingId(member.id)
    setError(null)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(
        `${API_BASE}/api/hotel-data/${user.hotelId}/loyalty/${member.id}/redeem`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ points }),
        }
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.message || `Failed to redeem points (${res.status})`)
      }
      const data = await res.json()
      const g = data.guest
      setMembers((prev) =>
        prev.map((m) =>
          m.id === member.id
            ? {
                ...m,
                points: Number(g.loyaltyPoints || 0),
                tier: g.loyaltyTier || m.tier,
                totalStays: Number(g.loyaltyTotalStays || m.totalStays),
                totalSpent: Number(g.loyaltyTotalSpent || m.totalSpent),
                lastUpdated: g.loyaltyLastUpdated
                  ? new Date(g.loyaltyLastUpdated).toISOString().slice(0, 10)
                  : m.lastUpdated,
              }
            : m
        )
      )
      setRedeemInputs((prev) => ({ ...prev, [member.id]: "" }))
    } catch (e) {
      console.error(e)
      setError(e instanceof Error ? e.message : "Failed to redeem loyalty points.")
    } finally {
      setSavingId(null)
    }
  }

  const totals = useMemo(
    () =>
      members.reduce(
        (acc, m) => {
          acc.points += m.points
          acc.stays += m.totalStays
          acc.spent += m.totalSpent
          return acc
        },
        { points: 0, stays: 0, spent: 0 }
      ),
    [members]
  )

  return (
    <main className="p-4 space-y-6">
      <GuestSectionHeader
        icon={Gift}
        title="Loyalty Program"
        description="Assign and redeem loyalty points, manage membership levels (Silver, Gold, Platinum), offer discounts, and track reward usage."
        action={
          <Badge variant="secondary" className="gap-1">
            <Coins className="h-3.5 w-3.5" />
            1 point per 100 spent
          </Badge>
        }
      />

      <Accordion type="single" collapsible className="border border-gray-200 rounded-lg bg-gray-50/50">
        <AccordionItem value="sub-features" className="border-b-0 px-4">
          <AccordionTrigger className="text-sm font-medium text-gray-700 hover:no-underline">
            Sub-features
          </AccordionTrigger>
          <AccordionContent>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600 list-disc list-inside">
              {SUB_FEATURES.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {MEMBERSHIPS.map((m) => (
          <Card key={m.level} className="border border-gray-200 shadow-sm">
            <CardHeader className="pb-2 pt-4 px-4">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Award className="h-4 w-4 text-slate-600" />
                {m.level}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs text-gray-500">Min. points: {m.minPoints}</p>
              <p className="text-sm font-medium text-gray-900">Special discount: {m.discount}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-2 pt-4 px-4">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <History className="h-4 w-4 text-slate-600" />
            Members & loyalty summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Card className="border border-gray-200 shadow-xs">
              <CardContent className="p-3">
                <p className="text-xs text-gray-500">Total points (all members)</p>
                <p className="text-lg font-semibold text-gray-900">{totals.points}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-xs">
              <CardContent className="p-3">
                <p className="text-xs text-gray-500">Total stays</p>
                <p className="text-lg font-semibold text-gray-900">{totals.stays}</p>
              </CardContent>
            </Card>
            <Card className="border border-gray-200 shadow-xs">
              <CardContent className="p-3">
                <p className="text-xs text-gray-500">Total spent</p>
                <p className="text-lg font-semibold text-gray-900">₹{totals.spent.toFixed(2)}</p>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500 py-4">Loading loyalty members…</p>
          ) : members.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">
              No loyalty members yet. Add guests and assign points to start building loyalty.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-gray-100">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Member</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Tier</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">Points</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Total stays
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Total spent
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                      Last updated
                    </th>
                    <th className="px-3 py-2 text-right text-xs font-semibold text-gray-600">
                      Add / Redeem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50/60">
                      <td className="px-3 py-2 font-medium text-gray-900">
                        <div className="flex flex-col">
                          <span>{m.name}</span>
                          <span className="text-[11px] text-gray-500">{m.email}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          className={
                            m.tier === "Platinum"
                              ? "bg-purple-100 text-purple-800"
                              : m.tier === "Gold"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-200 text-gray-800"
                          }
                        >
                          {m.tier}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-900">{m.points}</td>
                      <td className="px-3 py-2 text-gray-600">{m.totalStays}</td>
                      <td className="px-3 py-2 text-gray-600">₹{m.totalSpent.toFixed(2)}</td>
                      <td className="px-3 py-2 text-gray-600">{m.lastUpdated || "—"}</td>
                      <td className="px-3 py-2 text-right">
                        <div className="flex flex-col sm:flex-row gap-2 justify-end">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              className="h-8 w-20"
                              placeholder="Pts"
                              value={addInputs[m.id] ?? ""}
                              onChange={(e) =>
                                setAddInputs((prev) => ({ ...prev, [m.id]: e.target.value }))
                              }
                            />
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={savingId === m.id}
                              onClick={() => addPoints(m)}
                            >
                              Add
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              inputMode="numeric"
                              min={0}
                              className="h-8 w-20"
                              placeholder="Pts"
                              value={redeemInputs[m.id] ?? ""}
                              onChange={(e) =>
                                setRedeemInputs((prev) => ({
                                  ...prev,
                                  [m.id]: e.target.value,
                                }))
                              }
                            />
                            <Button
                              size="xs"
                              variant="outline"
                              disabled={savingId === m.id}
                              onClick={() => redeemPoints(m)}
                            >
                              Redeem
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
