'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'

export default function CurrencyLanguagePage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Currency & Language Settings</h1>
          <p className="text-xs text-gray-500 mt-0.5">Configure system language and currency</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">System Currency</p>
                  <p className="text-sm font-semibold text-gray-900">USD ($)</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600">System Language</p>
                  <p className="text-sm font-semibold text-gray-900">English</p>
                </div>
                <Button variant="ghost" size="sm" className="h-7 px-2">
                  <Edit2 className="w-3.5 h-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardContent className="p-3">
            <p className="text-xs text-gray-600">Additional language and currency configurations available in system settings.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
