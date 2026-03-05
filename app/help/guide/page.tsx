'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen } from 'lucide-react'

export default function UserGuidePage() {
  const topics = [
    { id: 1, title: 'Getting Started', description: 'Learn the basics of the hotel management system', articles: '5' },
    { id: 2, title: 'Reservations', description: 'Manage guest reservations and bookings', articles: '8' },
    { id: 3, title: 'Accounting', description: 'Handle financial transactions and reports', articles: '6' },
    { id: 4, title: 'Housekeeping', description: 'Manage room cleaning and maintenance', articles: '4' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">User Guide</h1>
          <p className="text-xs text-gray-500 mt-0.5">Learn how to use the system</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {topics.map((topic) => (
            <Card key={topic.id} className="border border-gray-200 shadow-xs rounded-md">
              <CardContent className="p-3">
                <div className="flex gap-2">
                  <BookOpen className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-900">{topic.title}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">{topic.description}</p>
                    <p className="text-xs text-gray-500 mt-1">{topic.articles} articles</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}
