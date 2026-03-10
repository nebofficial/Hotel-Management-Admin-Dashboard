'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function PayrollTable({ entries, onMarkPaid }) {
  const list = entries || []
  return (
    <Card className="border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-rose-50 to-red-50">
        <CardTitle className="text-sm font-semibold">Payroll Table</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {list.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">Generate payroll to see entries</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px]">
                  <th className="py-2 px-2 text-left">Employee</th>
                  <th className="py-2 px-2 text-right">Basic</th>
                  <th className="py-2 px-2 text-right">Allowances</th>
                  <th className="py-2 px-2 text-right">Deductions</th>
                  <th className="py-2 px-2 text-right">Net</th>
                  <th className="py-2 px-2 text-center">Status</th>
                  <th className="py-2 px-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {list.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="py-2 px-2 font-medium">{e.staffName}</td>
                    <td className="py-2 px-2 text-right">{Number(e.basicSalary).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right">{Number(e.allowancesTotal).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right">{Number((e.deductionsTotal || 0) + (e.leaveDeduction || 0)).toLocaleString()}</td>
                    <td className="py-2 px-2 text-right font-medium">{Number(e.netSalary).toLocaleString()}</td>
                    <td className="py-2 px-2 text-center">
                      <Badge className={e.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>{e.status}</Badge>
                    </td>
                    <td className="py-2 px-2 text-right">
                      {e.status !== 'paid' && <button type="button" className="text-[10px] text-emerald-600 hover:underline" onClick={() => onMarkPaid?.(e.id)}>Mark Paid</button>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
