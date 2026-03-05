'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const offers = [
  { id: 1, name: 'Breakfast Combo', price: '$12', discount: '15%', valid: '2024-02-01 to 2024-02-28' },
  { id: 2, name: 'Lunch Special', price: '$15', discount: '20%', valid: '2024-02-01 to 2024-02-28' },
  { id: 3, name: 'Dinner Package', price: '$35', discount: '25%', valid: '2024-02-01 to 2024-02-28' },
]

export default function OffersPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Combo & Offers</h1>
          <p className="text-xs text-gray-500 mt-0.5">Manage combo offers and promotions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {offers.map((offer) => (
            <Card key={offer.id} className="border border-gray-200 shadow-xs">
              <CardContent className="p-3">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-900 text-sm">{offer.name}</p>
                  <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">{offer.discount}</span>
                </div>
                <p className="text-xs text-gray-600 mb-1">Price: <span className="font-medium text-gray-900">{offer.price}</span></p>
                <p className="text-xs text-gray-500">Valid: {offer.valid}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
