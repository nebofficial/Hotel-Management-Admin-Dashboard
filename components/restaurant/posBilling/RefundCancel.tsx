export default function RefundCancel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold text-slate-900">
          Refund / cancel bill
        </h2>
        <span className="text-[11px] text-slate-500">
          Track reasons for voids and refunds
        </span>
      </div>
      <p className="text-[11px] text-slate-500">
        This section is a placeholder for a full refund / cancellation flow.
        You can extend it to:
      </p>
      <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-0.5">
        <li>Select an existing bill by ID, table, or date.</li>
        <li>Choose refund type (full / partial) and amount.</li>
        <li>Capture mandatory reason and manager approval.</li>
        <li>Update bill status to{" "}
          <code className="px-1 py-0.5 rounded bg-slate-100 text-[10px]">
            Refunded
          </code>{" "}
          or{" "}
          <code className="px-1 py-0.5 rounded bg-slate-100 text-[10px]">
            Cancelled
          </code>.
        </li>
      </ul>
      <p className="text-[11px] text-slate-500">
        The restaurant bills backend can store refund reason, refunded amount,
        and the user who authorised the action for audit trails.
      </p>
    </section>
  )
}

