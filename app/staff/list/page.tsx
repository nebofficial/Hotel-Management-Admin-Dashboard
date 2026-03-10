'use client'

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/app/auth-context"
import { fetchStaffMembers } from "@/services/api/staffApi"
import { Plus } from "lucide-react"

function getApiBaseUrl() {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  if (
    typeof window !== "undefined" &&
    window.location.hostname !== "localhost" &&
    window.location.hostname !== "127.0.0.1"
  ) {
    return `http://${window.location.hostname}:5000`
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
}

export default function StaffListPage() {
  const { user, hotel } = useAuth()
  const effectiveHotelId = user?.hotelId || hotel?.id
  const apiBase = effectiveHotelId ? `${getApiBaseUrl()}/api/hotel-data/${effectiveHotelId}` : ""

  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!apiBase) {
      setLoading(false)
      return
    }
    const load = async () => {
      try {
        const res = await fetchStaffMembers(apiBase)
        setStaff(res.staff || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load staff")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [apiBase])

  const getStatusColor = (active: boolean) =>
    active ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"

  if (!effectiveHotelId) {
    return (
      <main className="p-4">
        <p className="text-gray-600">Select a hotel to view staff list.</p>
      </main>
    )
  }

  return (
    <main className="p-4 space-y-4">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Staff List</h1>
          <p className="text-xs text-gray-500 mt-0.5">All hotel staff members</p>
        </div>
        <Button asChild size="sm" className="gap-1.5">
          <Link href="/staff/list/create">
            <Plus className="w-4 h-4" />
            Add Staff
          </Link>
        </Button>
      </div>

      {error && (
        <div className="p-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg">
          {error}
        </div>
      )}

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">
            Staff ({staff.length})
            {loading ? " — Loading…" : ""}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {loading ? (
            <div className="py-8 text-center text-sm text-gray-500">Loading staff…</div>
          ) : staff.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-500">No staff members yet. Add your first staff member.</div>
          ) : (
            <div className="space-y-2">
              {staff.map((member: any) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.role || "—"}</p>
                    <p className="text-xs text-gray-500">{member.department || "—"}</p>
                  </div>
                  <div
                    className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusColor(member.isActive !== false)}`}
                  >
                    {member.isActive !== false ? "Active" : "Inactive"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
