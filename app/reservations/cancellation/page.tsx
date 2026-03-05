'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const cancellations = [
  { id: 1, guest: 'Alex Brown', reservationId: 'RES-001', checkIn: '2024-02-01', reason: 'Personal', status: 'Cancelled', refund: '$500' },
  { id: 2, guest: 'Sarah Wilson', reservationId: 'RES-002', checkIn: '2024-02-05', reason: 'No-Show', status: 'No-Show', refund: '$0' },
  { id: 3, guest: 'Mike Davis', reservationId: 'RES-003', checkIn: '2024-02-10', reason: 'Business Closure', status: 'Cancelled', refund: '$800' },
]

export default function CancellationPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Cancellations</h1>
          <p className="text-xs text-gray-500 mt-0.5">View and manage cancellations and no-shows</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Cancellations</p>
              <div className="text-xl font-bold text-gray-900">12</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total No-Shows</p>
              <div className="text-xl font-bold text-gray-900">3</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Refunds</p>
              <div className="text-xl font-bold text-gray-900">$5,200</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-white border border-gray-200 rounded-md">
          <table className="w-full text-xs">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Guest</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Reservation ID</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Check-in</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Status</th>
                <th className="px-3 py-2 text-left font-semibold text-gray-700">Refund</th>
              </tr>
            </thead>
            <tbody>
              {cancellations.map((item) => (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-900">{item.guest}</td>
                  <td className="px-3 py-2 text-gray-600">{item.reservationId}</td>
                  <td className="px-3 py-2 text-gray-600">{item.checkIn}</td>
                  <td className="px-3 py-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900">{item.refund}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
