'use client'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import OrderTypeSelector from './OrderTypeSelector'
import TableSelector from './TableSelector'

export default function CreateBillPanel({
  billNumber = '',
  orderType = 'Dine-in',
  onOrderTypeChange,
  tableNo,
  onTableChange,
  tables = [],
  customerName = '',
  customerPhone = '',
  onCustomerNameChange,
  onCustomerPhoneChange,
}) {
  return (
    <Card className="border border-slate-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">Create Bill</h3>
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            {billNumber || 'BILL-2026-0001'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-2 pt-0 space-y-3">
        <OrderTypeSelector value={orderType} onChange={onOrderTypeChange} />
        {orderType === 'Dine-in' && (
          <TableSelector
            tables={tables}
            value={tableNo}
            onChange={onTableChange}
            disabled={!tables.length}
          />
        )}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Customer Name</Label>
            <Input
              placeholder="Guest name"
              value={customerName}
              onChange={(e) => onCustomerNameChange?.(e.target.value)}
              className="h-9 mt-0.5"
            />
          </div>
          <div>
            <Label className="text-xs">Phone</Label>
            <Input
              placeholder="Phone"
              value={customerPhone}
              onChange={(e) => onCustomerPhoneChange?.(e.target.value)}
              className="h-9 mt-0.5"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
