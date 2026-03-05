export interface TaxBreakdown {
  taxableAmount: number
  cgst: number
  sgst: number
  serviceCharge: number
  totalTax: number
  roundOff: number
  grossTotal: number
}

interface Props {
  breakdown: TaxBreakdown
}

export default function TaxCalculation({ breakdown }: Props) {
  const { taxableAmount, cgst, sgst, serviceCharge, totalTax, roundOff, grossTotal } =
    breakdown

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">Tax & charges</h2>
        <span className="text-[10px] text-slate-500">
          GST + service charge + round-off
        </span>
      </div>
      <div className="space-y-0.5 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Taxable amount</span>
          <span className="font-medium text-slate-900">
            ₹{taxableAmount.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">CGST</span>
          <span className="font-medium text-slate-900">₹{cgst.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">SGST</span>
          <span className="font-medium text-slate-900">₹{sgst.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Service charge</span>
          <span className="font-medium text-slate-900">
            ₹{serviceCharge.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Total tax</span>
          <span className="font-semibold text-slate-900">
            ₹{totalTax.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Round-off</span>
          <span className="font-medium text-slate-900">
            ₹{roundOff.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-dashed border-slate-200 mt-1">
          <span className="text-slate-600 font-semibold">Bill total</span>
          <span className="text-base font-semibold text-emerald-700">
            ₹{grossTotal.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  )
}

