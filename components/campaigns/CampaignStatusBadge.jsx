'use client'

export function CampaignStatusBadge({ status }) {
  const s = (status || 'draft').toLowerCase()
  const map = {
    draft: { label: 'Draft', className: 'bg-slate-200 text-slate-700' },
    scheduled: { label: 'Scheduled', className: 'bg-sky-100 text-sky-700' },
    active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Completed', className: 'bg-slate-800 text-slate-50' },
    stopped: { label: 'Stopped', className: 'bg-rose-100 text-rose-700' },
  }
  const cfg = map[s] || map.draft

  return (
    <span
      className={`inline-flex items-center justify-center min-w-[70px] h-6 rounded-full text-[10px] font-medium ${cfg.className}`}
    >
      {cfg.label}
    </span>
  )
}

