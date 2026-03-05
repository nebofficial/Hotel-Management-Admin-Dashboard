export interface DiscountState {
  type: "none" | "percent" | "amount"
  value: number
  approvedBy?: string
}

interface Props {
  subtotal: number
  state: DiscountState
  onChange: (state: DiscountState) => void
}

export default function DiscountManagement({
  subtotal,
  state,
  onChange,
}: Props) {
  const handleTypeChange = (type: DiscountState["type"]) => {
    onChange({ ...state, type, value: 0 })
  }

  const maxPercent = 50

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">
          Discount management
        </h2>
        <span className="text-[10px] text-slate-500">
          Subtotal: ₹{subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-[11px]">
        <button
          type="button"
          onClick={() => handleTypeChange("none")}
          className={`px-2 py-0.5 rounded-full border text-[11px] ${
            state.type === "none"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          No discount
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("percent")}
          className={`px-2 py-0.5 rounded-full border text-[11px] ${
            state.type === "percent"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          %
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange("amount")}
          className={`px-2 py-0.5 rounded-full border text-[11px] ${
            state.type === "amount"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-slate-50 text-slate-700 border-slate-200"
          }`}
        >
          ₹
        </button>
      </div>
      {state.type !== "none" && (
        <div className="space-y-1">
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              value={state.value || ""}
              min={0}
              max={state.type === "percent" ? maxPercent : subtotal}
              onChange={(e) =>
                onChange({
                  ...state,
                  value: Number(e.target.value || 0),
                })
              }
              className="h-8 flex-1 rounded-md border border-slate-200 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder={
                state.type === "percent"
                  ? `Discount % (max ${maxPercent}%)`
                  : "Flat discount amount"
              }
            />
            <input
              type="text"
              value={state.approvedBy || ""}
              onChange={(e) =>
                onChange({
                  ...state,
                  approvedBy: e.target.value || undefined,
                })
              }
              className="h-8 w-28 rounded-md border border-slate-200 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Manager ID"
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Higher discounts can require manager approval. Store approver ID
            here for audit trail.
          </p>
        </div>
      )}
      {state.type !== "none" && (
        <div className="flex items-center justify-between text-[11px] pt-1">
          <span className="text-slate-500">Discount value</span>
          <span className="font-semibold text-emerald-700">
            {state.type === "percent"
              ? `${state.value.toFixed(1)}%`
              : `₹${state.value.toFixed(2)}`}
          </span>
        </div>
      )}
    </section>
  )
}

