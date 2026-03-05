export interface PaymentState {
  method: "Cash" | "Card" | "UPI" | "Split"
  cashAmount: number
  cardAmount: number
  upiAmount: number
}

interface Props {
  total: number
  state: PaymentState
  onChange: (state: PaymentState) => void
}

export default function PaymentSection({ total, state, onChange }: Props) {
  const setMethod = (method: PaymentState["method"]) => {
    onChange({ ...state, method })
  }

  const changeField = (field: keyof PaymentState, value: number) => {
    onChange({ ...state, [field]: value })
  }

  const balance =
    state.method === "Split"
      ? total - (state.cashAmount + state.cardAmount + state.upiAmount)
      : total - (state.method === "Cash"
          ? state.cashAmount
          : state.method === "Card"
          ? state.cardAmount
          : state.upiAmount)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900 flex items-center gap-1">
          Payment
        </h2>
        <span className="text-[11px] text-slate-500">
          Payable: ₹{total.toFixed(2)}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        {(["Cash", "Card", "UPI", "Split"] as PaymentState["method"][]).map(
          (m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMethod(m)}
              className={`px-2 py-0.5 rounded-full border ${
                state.method === m
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-slate-50 text-slate-700 border-slate-200"
              }`}
            >
              {m}
            </button>
          ),
        )}
      </div>
      {state.method === "Cash" && (
        <div className="space-y-1">
          <label className="text-[11px] text-slate-600">Cash received</label>
          <input
            type="number"
            value={state.cashAmount || ""}
            min={0}
            onChange={(e) =>
              changeField("cashAmount", Number(e.target.value || 0))
            }
            className="h-8 w-full rounded-md border border-slate-200 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Enter cash amount"
          />
        </div>
      )}
      {state.method === "Card" && (
        <div className="space-y-1">
          <label className="text-[11px] text-slate-600">Card amount</label>
          <input
            type="number"
            value={state.cardAmount || ""}
            min={0}
            onChange={(e) =>
              changeField("cardAmount", Number(e.target.value || 0))
            }
            className="h-8 w-full rounded-md border border-slate-200 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Enter card amount"
          />
        </div>
      )}
      {state.method === "UPI" && (
        <div className="space-y-1">
          <label className="text-[11px] text-slate-600">UPI amount</label>
          <input
            type="number"
            value={state.upiAmount || ""}
            min={0}
            onChange={(e) =>
              changeField("upiAmount", Number(e.target.value || 0))
            }
            className="h-8 w-full rounded-md border border-slate-200 px-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            placeholder="Enter UPI amount"
          />
        </div>
      )}
      {state.method === "Split" && (
        <div className="space-y-1">
          <label className="text-[11px] text-slate-600">
            Split across modes
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <input
              type="number"
              value={state.cashAmount || ""}
              min={0}
              onChange={(e) =>
                changeField("cashAmount", Number(e.target.value || 0))
              }
              className="h-8 rounded-md border border-slate-200 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Cash"
            />
            <input
              type="number"
              value={state.cardAmount || ""}
              min={0}
              onChange={(e) =>
                changeField("cardAmount", Number(e.target.value || 0))
              }
              className="h-8 rounded-md border border-slate-200 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="Card"
            />
            <input
              type="number"
              value={state.upiAmount || ""}
              min={0}
              onChange={(e) =>
                changeField("upiAmount", Number(e.target.value || 0))
              }
              className="h-8 rounded-md border border-slate-200 px-2 text-[11px] focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              placeholder="UPI"
            />
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-dashed border-slate-200 mt-1">
        <span className="text-slate-500">
          {balance > 0 ? "Balance to collect" : "Change to return"}
        </span>
        <span className="font-semibold text-slate-900">
          ₹{Math.abs(balance).toFixed(2)}
        </span>
      </div>
    </section>
  )
}

