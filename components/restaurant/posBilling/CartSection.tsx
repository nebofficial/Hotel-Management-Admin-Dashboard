export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  taxRate: number
  notes?: string
}

interface Props {
  items: CartItem[]
  onChangeItems: (items: CartItem[]) => void
  subtotal: number
}

export default function CartSection({ items, onChangeItems, subtotal }: Props) {
  const updateQty = (id: string, delta: number) => {
    onChangeItems(
      items
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(item.quantity + delta, 0) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    )
  }

  const removeItem = (id: string) => {
    onChangeItems(items.filter((i) => i.id !== id))
  }

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">Cart</h2>
        <button
          type="button"
          onClick={() => onChangeItems([])}
          className="text-[11px] text-slate-500 hover:text-rose-600"
        >
          Clear all
        </button>
      </div>
      <div className="h-[320px] overflow-y-auto pr-1 rounded-lg border border-slate-200 bg-white">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-slate-400">
            No items added yet. Select from the menu.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-2 py-1.5 gap-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-slate-900 truncate">
                    {item.name}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    ₹{item.price.toFixed(2)} × {item.quantity}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, -1)}
                    className="h-6 w-6 rounded-full border border-slate-200 bg-slate-50 text-[11px] leading-none"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-[11px] text-slate-900">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQty(item.id, 1)}
                    className="h-6 w-6 rounded-full border border-emerald-500 bg-emerald-50 text-[11px] leading-none text-emerald-700"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="h-6 w-6 rounded-full border border-rose-200 bg-rose-50 text-[11px] leading-none text-rose-600"
                    title="Remove item"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-slate-500">Subtotal</span>
        <span className="font-semibold text-slate-900">
          ₹{subtotal.toFixed(2)}
        </span>
      </div>
    </section>
  )
}

