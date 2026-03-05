'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit2, Eye } from 'lucide-react'
import Link from 'next/link'

export default function ChartOfAccountsPage() {
  const accounts = [
    { id: 1, code: '1001', name: 'Cash', type: 'Asset', balance: '$125,300', status: 'Active' },
    { id: 2, code: '1002', name: 'Bank Account', type: 'Asset', balance: '$456,200', status: 'Active' },
    { id: 3, code: '2001', name: 'Accounts Payable', type: 'Liability', balance: '$89,500', status: 'Active' },
    { id: 4, code: '3001', name: 'Revenue', type: 'Income', balance: '$245,600', status: 'Active' },
    { id: 5, code: '4001', name: 'Expenses', type: 'Expense', balance: '$78,900', status: 'Active' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Chart of Accounts</h1>
            <p className="text-xs text-gray-500 mt-0.5">Manage all accounting accounts</p>
          </div>
          <Link href="/accounting/accounts/create">
            <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
              <Plus className="w-3.5 h-3.5" />
              New Account
            </Button>
          </Link>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Code</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Account Name</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Type</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Balance</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{account.code}</td>
                      <td className="py-2 px-2 text-gray-700">{account.name}</td>
                      <td className="py-2 px-2 text-gray-700">{account.type}</td>
                      <td className="py-2 px-2 text-gray-900 font-medium">{account.balance}</td>
                      <td className="py-2 px-2">
                        <span className="inline-block bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs font-medium">
                          {account.status}
                        </span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link href={`/accounting/accounts/${account.id}`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
                            </Button>
                          </Link>
                          <Link href={`/accounting/accounts/${account.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
