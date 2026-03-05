import type { CartItem } from "./CartSection"
import type { PaymentState } from "./PaymentSection"
import type { TaxBreakdown } from "./TaxCalculation"

interface Props {
  tableNo: string
  guestName: string
  items: CartItem[]
  subtotal: number
  discountAmount: number
  taxBreakdown: TaxBreakdown
  payment: PaymentState
  lastSavedBill: any
  loading: boolean
  onConfirm: () => void
  onHold: () => void
}

export default function InvoicePreview({
  tableNo,
  guestName,
  items,
  subtotal,
  discountAmount,
  taxBreakdown,
  payment,
  lastSavedBill,
  loading,
  onConfirm,
  onHold,
}: Props) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">
          Invoice preview
        </h2>
        <div className="text-right text-[10px] text-slate-500">
          <div>Table: {tableNo}</div>
          {guestName && <div>Guest: {guestName}</div>}
        </div>
      </div>
      <div className="border border-slate-200 rounded-lg overflow-hidden">
        <table className="w-full text-[11px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="py-1 px-2 text-left font-medium text-slate-600">
                Item
              </th>
              <th className="py-1 px-2 text-right font-medium text-slate-600">
                Qty
              </th>
              <th className="py-1 px-2 text-right font-medium text-slate-600">
                Rate
              </th>
              <th className="py-1 px-2 text-right font-medium text-slate-600">
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="py-4 px-2 text-center text-[11px] text-slate-400"
                >
                  No items in the bill yet.
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-1 px-2 text-slate-800">{item.name}</td>
                  <td className="py-1 px-2 text-right text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-1 px-2 text-right text-slate-700">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="py-1 px-2 text-right text-slate-900">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="space-y-0.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-medium text-slate-900">
            ₹{subtotal.toFixed(2)}
          </span>
        </div>
        {discountAmount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Discount</span>
            <span className="font-medium text-emerald-700">
              -₹{discountAmount.toFixed(2)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="text-slate-500">CGST + SGST</span>
          <span className="font-medium text-slate-900">
            ₹{taxBreakdown.totalTax.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Service charge</span>
          <span className="font-medium text-slate-900">
            ₹{taxBreakdown.serviceCharge.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Round-off</span>
          <span className="font-medium text-slate-900">
            ₹{taxBreakdown.roundOff.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200 mt-1">
          <span className="text-slate-700 font-semibold">Net payable</span>
          <span className="text-base font-semibold text-emerald-700">
            ₹{taxBreakdown.grossTotal.toFixed(2)}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-500">Payment mode</span>
        <span className="font-medium text-slate-900">{payment.method}</span>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <div className="text-[10px] text-slate-500">
          {lastSavedBill?.id ? (
            <span>
              Last bill ID:{" "}
              <span className="font-mono text-slate-700">
                {String(lastSavedBill.id).slice(0, 8)}
              </span>
            </span>
          ) : (
            <span>Bill will be saved to backend when you confirm.</span>
          )}
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onHold}
            disabled={loading || !items.length}
            className="px-2.5 py-1 rounded-md border border-slate-300 bg-white text-[11px] text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Hold
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading || !items.length}
            className="px-3 py-1 rounded-md bg-emerald-600 text-white text-[11px] font-medium hover:bg-emerald-700 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Confirm & print"}
          </button>
        </div>
      </div>
    </section>
  )
}

