"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { fetchPropertiesList } from "@/services/api/multiPropertyApi"

const API_BASE = typeof window !== "undefined" && process.env.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : "http://localhost:5000"

export default function PropertyListPage() {
  const [properties, setProperties] = useState<{ id: string; name: string; city: string; rooms: number; occupancy: string; status: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPropertiesList(API_BASE)
      .then((r) => setProperties(r.properties || []))
      .catch(() => setProperties([]))
      .finally(() => setLoading(false))
  }, [])

  const getStatusColor = (status: string) =>
    status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"

  return (
    <main className="space-y-4 p-4">
      <div className="flex items-center gap-2 pb-2">
        <Building2 className="h-5 w-5 text-emerald-600" />
        <div>
          <h1 className="text-lg font-semibold text-gray-900">Property List</h1>
          <p className="text-xs text-gray-500">All hotel properties</p>
        </div>
      </div>

      <Card className="rounded-xl border border-gray-200 shadow-sm">
        <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50/50 px-4 py-3">
          <CardTitle className="text-sm font-semibold">Properties ({properties.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {loading ? (
            <div className="flex h-32 items-center justify-center text-gray-500">Loading...</div>
          ) : properties.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-500">No properties found.</p>
          ) : (
            <div className="space-y-2">
              {properties.map((prop) => (
                <div key={prop.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">{prop.name}</p>
                    <p className="text-xs text-gray-600">{prop.city} • {prop.rooms} rooms</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-gray-900">{prop.occupancy}</p>
                    <span className={`mt-0.5 inline-block rounded px-1.5 py-0.5 text-xs font-semibold ${getStatusColor(prop.status)}`}>
                      {prop.status}
                    </span>
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
