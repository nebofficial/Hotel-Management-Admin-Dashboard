'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PromoCodesPage() {
  const promos = [
    { id: 1, code: "EARLY20", discount: "20% off", expiry: "2024-02-29", used: 45, status: "Active" },
    { id: 2, code: "WEEKEND15", discount: "15% off", expiry: "2024-03-31", used: 32, status: "Active" },
    { id: 3, code: "SUMMER30", discount: "$30 off", expiry: "2024-06-30", used: 8, status: "Scheduled" },
    { id: 4, code: "NEWYEAR50", discount: "$50 off", expiry: "2024-01-31", used: 120, status: "Expired" },
  ]

  const getStatusColor = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-800"
    if (status === "Scheduled") return "bg-blue-100 text-blue-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <main className="p-4 space-y-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Promo Codes</h1>
        <p className="text-xs text-gray-500 mt-0.5">Marketing promotional codes</p>
      </div>

      <Card className="border border-gray-200 shadow-xs">
        <CardHeader className="pb-2 pt-3 px-3">
          <CardTitle className="text-sm font-semibold">Promotions (4)</CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-2">
            {promos.map((promo) => (
              <div key={promo.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-100">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{promo.code}</p>
                  <p className="text-xs text-gray-600">{promo.discount} • Expires: {promo.expiry}</p>
                  <p className="text-xs text-gray-500">{promo.used} uses</p>
                </div>
                <div className={`text-xs font-semibold px-1.5 py-0.5 rounded ${getStatusColor(promo.status)}`}>
                  {promo.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
