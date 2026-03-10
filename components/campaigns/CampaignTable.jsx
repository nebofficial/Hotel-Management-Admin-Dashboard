'use client'

import { CampaignStatusBadge } from './CampaignStatusBadge'

export function CampaignTable({ campaigns = [], onEdit, onSendNow, onStop }) {
  return (
    <div className="rounded-2xl border-0 bg-gradient-to-br from-sky-500/10 via-blue-500/5 to-indigo-500/10 shadow-sm overflow-hidden">
      <div className="px-4 pt-4 pb-2 border-b border-sky-200/60">
        <p className="text-sm font-semibold text-slate-800">Campaign Management</p>
        <p className="text-[11px] text-slate-600">
          Central hub for managing email and SMS campaigns.
        </p>
      </div>
      <div className="overflow-x-auto">
        {campaigns.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">No campaigns created yet.</p>
        ) : (
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-sky-100/80 border-b border-sky-200/60">
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Campaign Name</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Type</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Target Segment</th>
                <th className="text-left py-2.5 px-3 font-semibold text-slate-700">Scheduled Date</th>
                <th className="text-center py-2.5 px-3 font-semibold text-slate-700">Status</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Sent</th>
                <th className="text-right py-2.5 px-3 font-semibold text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-sky-100/80 last:border-0 hover:bg-sky-50/60"
                >
                  <td className="py-2 px-3 font-semibold text-slate-900">{c.name}</td>
                  <td className="py-2 px-3 text-slate-700">
                    {c.type === 'sms' ? 'SMS' : 'Email'}
                  </td>
                  <td className="py-2 px-3 text-slate-700">{c.segment || 'All guests'}</td>
                  <td className="py-2 px-3 text-slate-700">
                    {c.scheduledAt ? String(c.scheduledAt).slice(0, 16) : '-'}
                  </td>
                  <td className="py-2 px-3 text-center">
                    <CampaignStatusBadge status={c.status} />
                  </td>
                  <td className="py-2 px-3 text-right text-slate-800">
                    {Number(c.sentCount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <div className="inline-flex gap-1">
                      <button
                        type="button"
                        className="px-2 h-6 rounded-full border border-sky-500/70 text-sky-800 bg-white text-[10px] font-medium hover:bg-sky-50"
                        onClick={() => onEdit?.(c)}
                      >
                        Edit
                      </button>
                      {c.status !== 'completed' && c.status !== 'stopped' && (
                        <button
                          type="button"
                          className="px-2 h-6 rounded-full border border-emerald-500/70 text-emerald-800 bg-white text-[10px] font-medium hover:bg-emerald-50"
                          onClick={() => onSendNow?.(c)}
                        >
                          Send
                        </button>
                      )}
                      {c.status === 'active' || c.status === 'scheduled' ? (
                        <button
                          type="button"
                          className="px-2 h-6 rounded-full border border-rose-300 text-rose-700 bg-white text-[10px] font-medium hover:bg-rose-50"
                          onClick={() => onStop?.(c)}
                        >
                          Stop
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

