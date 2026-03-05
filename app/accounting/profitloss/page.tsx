'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ProfitLossPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Profit & Loss Statement</h1>
          <p className="text-xs text-gray-500 mt-0.5">Monthly financial performance</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Revenue</p>
              <div className="text-2xl font-bold text-gray-900">$45,200</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Expenses</p>
              <div className="text-2xl font-bold text-red-600">-$12,800</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">P&L Statement</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>Room Revenue</span>
                <span className="font-medium">$28,500</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>Food & Beverage</span>
                <span className="font-medium">$12,200</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span>Other Revenue</span>
                <span className="font-medium">$4,500</span>
              </div>
              <div className="flex justify-between py-1 font-semibold border-b-2 border-gray-300">
                <span>Total Revenue</span>
                <span>$45,200</span>
              </div>

              <div className="pt-2">
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>Salary & Wages</span>
                  <span className="font-medium">$5,600</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>Utilities</span>
                  <span className="font-medium">$2,200</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>Maintenance</span>
                  <span className="font-medium">$1,800</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-200">
                  <span>Other Expenses</span>
                  <span className="font-medium">$3,200</span>
                </div>
                <div className="flex justify-between py-1 font-semibold border-b-2 border-gray-300">
                  <span>Total Expenses</span>
                  <span>$12,800</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="flex justify-between py-2 font-bold text-lg bg-green-50 px-2 rounded">
                  <span>Net Profit</span>
                  <span className="text-green-600">$32,400</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
