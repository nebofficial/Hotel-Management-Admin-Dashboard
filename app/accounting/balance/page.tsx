'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function BalanceSheetPage() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        <div className="pb-2">
          <h1 className="text-lg font-semibold text-gray-900">Balance Sheet</h1>
          <p className="text-xs text-gray-500 mt-0.5">As of January 20, 2024</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Assets</p>
              <div className="text-2xl font-bold text-gray-900">$845,600</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-xs rounded-md">
            <CardContent className="p-2.5">
              <p className="text-xs text-gray-600 font-medium mb-1">Total Liabilities</p>
              <div className="text-2xl font-bold text-red-600">$234,200</div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-gray-200 shadow-xs rounded-md">
          <CardHeader className="pb-2 pt-3 px-3">
            <CardTitle className="text-sm font-semibold">Assets & Liabilities</CardTitle>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <div className="space-y-3 text-xs">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">ASSETS</h3>
                <div className="space-y-1 pl-2 border-l-2 border-gray-300">
                  <div className="flex justify-between py-1">
                    <span>Cash & Bank</span>
                    <span className="font-medium">$125,300</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Accounts Receivable</span>
                    <span className="font-medium">$234,500</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Fixed Assets</span>
                    <span className="font-medium">$485,800</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold border-t border-gray-200 pt-1">
                    <span>Total Assets</span>
                    <span>$845,600</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">LIABILITIES</h3>
                <div className="space-y-1 pl-2 border-l-2 border-gray-300">
                  <div className="flex justify-between py-1">
                    <span>Accounts Payable</span>
                    <span className="font-medium">$89,500</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Short-term Debt</span>
                    <span className="font-medium">$144,700</span>
                  </div>
                  <div className="flex justify-between py-1 font-semibold border-t border-gray-200 pt-1">
                    <span>Total Liabilities</span>
                    <span>$234,200</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between py-2 font-bold text-lg bg-green-50 px-2 rounded mt-2">
                <span>Equity</span>
                <span className="text-green-600">$611,400</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
