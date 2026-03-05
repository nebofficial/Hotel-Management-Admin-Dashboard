'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PropertyListPage() {
  const properties = [
    { id: 1, name: "Grand Hotel Downtown", city: "New York", rooms: 250, occupancy: "87%", status: "Active" },
    { id: 2, name: "Beachside Resort", city: "Miami", rooms: 180, occupancy: "92%", status: "Active" },
    { id: 3, name: "Mountain Lodge", city: "Denver", rooms: 120, occupancy: "64%", status: "Active" },
    { id: 4, name: "City Inn Express", city: "Chicago", rooms: 200, occupancy: "78%", status: "Maintenance" },
  ]

  const getStatusColor = (status: string) => {
    return status === "Active" ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Properties</h1>
        <p className="text-xs text-gray-500 mt-0.5">All hotel properties</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Properties (4)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {properties.map((prop) => (
              <div key={prop.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{prop.name}</p>
                  <p className="text-xs text-gray-600">{prop.city} • {prop.rooms} rooms</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-gray-900">{prop.occupancy}</p>
                  <div className={`text-xs font-semibold px-1.5 py-0.5 rounded mt-0.5 inline-block ${getStatusColor(prop.status)}`}>
                    {prop.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
