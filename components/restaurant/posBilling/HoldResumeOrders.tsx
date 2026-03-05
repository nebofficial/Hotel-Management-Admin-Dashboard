export default function HoldResumeOrders() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">
          Hold / resume orders
        </h2>
        <span className="text-[11px] text-slate-500">
          Use with busy tables to park bills
        </span>
      </div>
      <p className="text-[11px] text-slate-500">
        From the invoice tab, you can save a bill in{" "}
        <span className="font-semibold">On Hold</span> state. A future
        enhancement can list all held bills here with search by table / guest
        and allow resuming them into the active cart.
      </p>
      <p className="text-[11px] text-slate-500">
        Backend API is already prepared to store bills with status{" "}
        <code className="px-1 py-0.5 rounded bg-slate-100 text-[10px]">
          On Hold
        </code>{" "}
        so you can easily implement full hold / resume list later.
      </p>
    </section>
  )
}

