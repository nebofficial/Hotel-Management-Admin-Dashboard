import type { CartItem } from "./CartSection"

interface Props {
  items: CartItem[]
  total: number
}

export default function SplitBill({ items, total }: Props) {
  const seats = 4
  const equalShare = seats ? total / seats : total

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">Split bill</h2>
        <span className="text-[11px] text-slate-500">
          Total: ₹{total.toFixed(2)}
        </span>
      </div>
      {items.length === 0 ? (
        <p className="text-[11px] text-slate-400">
          Add items to cart before splitting the bill.
        </p>
      ) : (
        <>
          <p className="text-[11px] text-slate-500">
            This is a simple equal-split preview. You can extend it to split by
            items or seats and send separate invoices.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
            {Array.from({ length: seats }).map((_, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-[11px]"
              >
                <div className="font-semibold text-slate-800 mb-0.5">
                  Seat {idx + 1}
                </div>
                <div className="text-slate-600">
                  ₹{equalShare.toFixed(2)} (approx)
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  )
}

