'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

export default function TakeawayPage() {
  const router = useRouter()

  return (
    <main className="p-4">
      <div className="pb-2">
        <h1 className="text-lg font-semibold text-gray-900">Takeaway & Delivery</h1>
        <p className="text-xs text-gray-500 mt-0.5">Manage takeaway and delivery orders</p>
      </div>
      <Card className="border border-gray-200 shadow-sm max-w-md">
        <CardContent className="p-6 flex flex-col items-center gap-4">
          <Package className="h-12 w-12 text-slate-500" />
          <p className="text-sm text-gray-600 text-center">
            Use the full Takeaway & Delivery dashboard for customers, orders, delivery partners, areas, and notifications.
          </p>
          <Button onClick={() => router.push('/restaurant/takeaway-delivery')}>
            Open Takeaway & Delivery Dashboard
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
