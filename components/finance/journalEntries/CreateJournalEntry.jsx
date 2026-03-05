'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

export default function CreateJournalEntry({
  voucherNumber,
  date,
  onDateChange,
  rows,
  onRowChange,
  onAddRow,
  onRemoveRow,
  accounts,
  onSave,
  saving,
  narration,
  onNarrationChange,
  autoPost,
  onToggleAutoPost,
}) {
  const handleAccountChange = (idx, accountId) => {
    const account = accounts.find((a) => a.id === accountId)
    onRowChange(idx, {
      accountId,
      accountName: account ? account.name : '',
    })
  }

  return (
    <Card className="border-0 shadow-lg rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-emerald-50">Voucher No.</Label>
            <input
              type="text"
              value={voucherNumber || ''}
              readOnly
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 bg-white/70"
            />
          </div>
          <div>
            <Label className="text-xs text-emerald-50">Date</Label>
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900"
            />
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-2 space-y-2">
          <div className="flex items-center justify-between text-xs text-emerald-100">
            <span>Lines</span>
            <button
              type="button"
              onClick={onAddRow}
              className="px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[11px]"
            >
              + Add Row
            </button>
          </div>
          <div className="space-y-1 max-h-[200px] overflow-y-auto">
            {rows.map((row, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-5">
                  <select
                    value={row.accountId || ''}
                    onChange={(e) => handleAccountChange(idx, e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900 bg-white"
                  >
                    <option value="">Select account</option>
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Debit"
                    value={row.debit}
                    onChange={(e) => onRowChange(idx, { debit: e.target.value, credit: '' })}
                    className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Credit"
                    value={row.credit}
                    onChange={(e) => onRowChange(idx, { credit: e.target.value, debit: '' })}
                    className="w-full rounded-lg border border-emerald-200 px-2 py-1 text-xs text-emerald-900"
                  />
                </div>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => onRemoveRow(idx)}
                    className="text-[11px] text-emerald-50 px-1"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-xs text-emerald-50">Narration</Label>
          <textarea
            value={narration}
            onChange={(e) => onNarrationChange(e.target.value)}
            className="mt-1 w-full rounded-xl border border-emerald-200 px-3 py-2 text-sm text-emerald-900 min-h-[60px]"
            placeholder="Enter narration / description of transaction"
          />
        </div>

        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <input
              id="autoPost"
              type="checkbox"
              checked={autoPost}
              onChange={(e) => onToggleAutoPost(e.target.checked)}
              className="rounded border-emerald-200 text-emerald-600"
            />
            <label htmlFor="autoPost" className="text-emerald-50">
              Auto post to ledger
            </label>
          </div>
          <Button
            type="button"
            disabled={saving}
            onClick={onSave}
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-sm px-4"
          >
            {saving ? 'Saving…' : 'Save Journal'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

