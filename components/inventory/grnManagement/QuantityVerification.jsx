'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react'

export default function QuantityVerification({ grn }) {
  if (!grn || !Array.isArray(grn.receivedItems)) return null

  const verifyQuantities = () => {
    return grn.receivedItems.map((item) => {
      const orderedQty = Number(item.orderedQty || 0)
      const receivedQty = Number(item.receivedQty || 0)
      const acceptedQty = Number(item.acceptedQty || 0)
      const rejectedQty = Number(item.rejectedQty || 0)
      const damagedQty = Number(item.damagedQty || 0)
      
      const totalProcessed = acceptedQty + rejectedQty + damagedQty
      const variance = receivedQty - orderedQty
      
      let status = 'ok'
      let message = 'Quantity matches'
      let icon = CheckCircle2
      let color = 'text-green-600'
      
      if (receivedQty !== orderedQty) {
        status = 'variance'
        message = `Variance: ${variance > 0 ? '+' : ''}${variance}`
        icon = AlertTriangle
        color = variance > 0 ? 'text-blue-600' : 'text-red-600'
      }
      
      if (totalProcessed !== receivedQty) {
        status = 'mismatch'
        message = `Mismatch: Processed ${totalProcessed} but received ${receivedQty}`
        icon = XCircle
        color = 'text-red-600'
      }
      
      return {
        ...item,
        status,
        message,
        icon,
        color,
        variance,
        totalProcessed,
      }
    })
  }

  const verifiedItems = verifyQuantities()
  const allValid = verifiedItems.every((item) => item.status === 'ok')
  const hasVariance = verifiedItems.some((item) => item.status === 'variance')
  const hasMismatch = verifiedItems.some((item) => item.status === 'mismatch')

  return (
    <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-teal-900">
          <CheckCircle2 className="h-5 w-5" />
          Quantity Verification
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {verifiedItems.map((item, index) => {
            const Icon = item.icon
            return (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{item.itemName}</h4>
                  <div className={`flex items-center gap-1 ${item.color}`}>
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.message}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Ordered:</span> {item.orderedQty}
                  </div>
                  <div>
                    <span className="font-medium">Received:</span> {item.receivedQty}
                  </div>
                  <div className="text-green-600">
                    <span className="font-medium">Accepted:</span> {item.acceptedQty}
                  </div>
                  <div className="text-red-600">
                    <span className="font-medium">Rejected:</span> {item.rejectedQty}
                  </div>
                  <div className="text-orange-600">
                    <span className="font-medium">Damaged:</span> {item.damagedQty}
                  </div>
                </div>
              </div>
            )
          })}

          <div className={`rounded-lg p-4 ${
            allValid ? 'bg-green-50 border border-green-200' :
            hasMismatch ? 'bg-red-50 border border-red-200' :
            'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center gap-2">
              {allValid ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">All quantities verified</span>
                </>
              ) : hasMismatch ? (
                <>
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="font-semibold text-red-900">Quantity mismatches detected</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  <span className="font-semibold text-yellow-900">Variances detected - review required</span>
                </>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
