'use client'

import dynamic from 'next/dynamic'

const RestaurantBills = dynamic(
  () => import('@/components/restaurant/bills/RestaurantBills'),
  { ssr: false }
)

export default function RestaurantBillsPage() {
  return <RestaurantBills />
}
