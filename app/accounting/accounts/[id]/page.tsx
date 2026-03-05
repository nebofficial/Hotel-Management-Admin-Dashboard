'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AccountDetailPage({ params }: { params: { id: string } }) {
  const account = {
    id: params.id,
    code: '1001',
    name: 'Cash',
    type: 'Asset',
    balance: '$125,300',
    status: 'Active',
    createdDate: '2023-01-15',
    lastModified: '2024-01-20',
  }

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <Link href="/accounting/accounts">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{account.name}</h1>
              <p className="text-xs text-gray-500 mt-0.5">Account Code: {account.code}</p>
            </div>
          </div>
          <Link href={`/accounting/accounts/${account.id}/edit`}>
            <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
              <Edit2 className="w-3.5 h-3.5" />
              Edit
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Account Type</p>
              <p className="text-sm font-semibold text-gray-900">{account.type}</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Balance</p>
              <p className="text-sm font-bold text-gray-900">{account.balance}</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
              <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                {account.status}
              </span>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Last Modified</p>
              <p className="text-xs text-gray-900">{account.lastModified}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
