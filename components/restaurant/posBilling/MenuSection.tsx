export interface MenuItem {
  id: string
  name: string
  category: string
  price: number
  taxRate: number
}

interface Props {
  menu: MenuItem[]
  onAddItem: (item: MenuItem) => void
}

export default function MenuSection({ menu, onAddItem }: Props) {
  const categories = Array.from(new Set(menu.map((m) => m.category)))

  return (
    <section className="space-y-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">Menu</h2>
        <p className="text-[11px] text-slate-500">
          Tap an item to add to the cart
        </p>
      </div>
      <div className="h-[320px] overflow-y-auto pr-1">
        {categories.map((cat) => (
          <div key={cat} className="mb-2">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide mb-1">
              {cat}
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {menu
                .filter((m) => m.category === cat)
                .map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onAddItem(item)}
                    className="text-left rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-[11px] hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                  >
                    <div className="font-medium text-slate-900 truncate">
                      {item.name}
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-[11px] text-slate-500">
                        ₹{item.price.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded">
                        GST {item.taxRate}%
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

