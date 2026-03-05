'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Send } from 'lucide-react'

export default function CampaignsPage() {
  const campaigns = [
    { id: 1, name: 'Winter Getaway', type: 'Email', recipients: '5,240', sent: '4,850', status: 'Active' },
    { id: 2, name: 'Corporate Booking', type: 'SMS', recipients: '1,200', sent: '1,200', status: 'Completed' },
    { id: 3, name: 'Festival Discount', type: 'Email', recipients: '3,500', sent: '0', status: 'Draft' },
  ]

  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2">
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Email / SMS Campaigns</h1>
            <p className="text-xs text-gray-500 mt-0.5">Create and manage marketing campaigns</p>
          </div>
          <Button className="h-8 text-xs gap-1.5 bg-red-600 hover:bg-red-700">
            <Plus className="w-3.5 h-3.5" />
            New Campaign
          </Button>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Campaign</th>
                    <th className="text-left py-2 px-2 font-semibold text-gray-700">Type</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Recipients</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Sent</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Status</th>
                    <th className="text-center py-2 px-2 font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-2 text-gray-900 font-medium">{campaign.name}</td>
                      <td className="py-2 px-2 text-gray-700">{campaign.type}</td>
                      <td className="py-2 px-2 text-center">{campaign.recipients}</td>
                      <td className="py-2 px-2 text-center font-medium">{campaign.sent}</td>
                      <td className="py-2 px-2 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${campaign.status === 'Completed' ? 'bg-green-100 text-green-700' : campaign.status === 'Draft' ? 'bg-gray-100 text-gray-700' : 'bg-blue-100 text-blue-700'}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <Button variant="ghost" size="sm" className="h-7 px-2">
                          <Send className="w-3.5 h-3.5" />
                        </Button>
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
