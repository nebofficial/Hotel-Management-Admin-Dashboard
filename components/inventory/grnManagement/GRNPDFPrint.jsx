'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Download, Printer, Loader2 } from 'lucide-react'

export default function GRNPDFPrint({ grn }) {
  const [loading, setLoading] = useState(false)

  if (!grn) return null

  const handlePrint = () => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups to print GRN')
      return
    }

    const itemsHtml = Array.isArray(grn.receivedItems)
      ? grn.receivedItems
          .map(
            (item, index) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.itemName || ''}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.orderedQty || 0}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.receivedQty || 0}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.acceptedQty || 0}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">${item.rejectedQty || 0}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">₹${Number(item.unitPrice || 0).toFixed(2)}</td>
        <td style="border: 1px solid #ddd; padding: 8px;">₹${Number((item.acceptedQty || 0) * (item.unitPrice || 0)).toFixed(2)}</td>
      </tr>
    `
          )
          .join('')
      : ''

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GRN ${grn.grnNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .info { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .footer { margin-top: 30px; text-align: right; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>GOODS RECEIPT NOTE (GRN)</h1>
            <h2>${grn.grnNumber}</h2>
          </div>
          <div class="info">
            <p><strong>Date:</strong> ${new Date(grn.receivedDate).toLocaleDateString()}</p>
            <p><strong>Status:</strong> ${grn.status}</p>
            ${grn.notes ? `<p><strong>Notes:</strong> ${grn.notes}</p>` : ''}
          </div>
          <table>
            <thead>
              <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">S.No</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Item Name</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Ordered Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Received Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Accepted Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Rejected Qty</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Unit Price</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <div class="footer">
            <p><strong>Total Amount:</strong> ₹${Number(grn.totalAmount || 0).toFixed(2)}</p>
            <p><strong>Total Items:</strong> ${grn.totalItems || 0}</p>
            <p><strong>Accepted Items:</strong> ${grn.totalAcceptedItems || 0}</p>
            <p><strong>Rejected Items:</strong> ${grn.totalRejectedItems || 0}</p>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    setTimeout(() => {
      printWindow.print()
    }, 250)
  }

  const handleDownload = () => {
    handlePrint() // For now, use print functionality
  }

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <FileText className="h-5 w-5" />
          GRN PDF Print
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">GRN Number:</span>
                <span className="font-semibold text-gray-900">{grn.grnNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium text-gray-900">
                  {new Date(grn.receivedDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-semibold text-gray-900">
                  ₹{Number(grn.totalAmount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              disabled={loading}
              className="flex-1 bg-gray-600 hover:bg-gray-700"
            >
              <Printer className="mr-2 h-4 w-4" />
              Print GRN
            </Button>
            <Button
              onClick={handleDownload}
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
