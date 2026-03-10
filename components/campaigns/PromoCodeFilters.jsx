'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export function PromoCodeFilters({ name, type, status, onChangeName, onChangeType, onChangeStatus, onReset }) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-sky-900 via-sky-800 to-slate-900 text-sky-50 p-4 flex flex-col lg:flex-row lg:items-end gap-3">
      <div className="flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-sky-200">
          Filters
        </p>
        <p className="text-[11px] text-sky-100/90">
          Filter campaigns by name, type and status.
        </p>
      </div>
      <div className="flex flex-wrap gap-3 items-end">
        <div className="space-y-1">
          <Label className="text-[11px] text-sky-50">Campaign Name</Label>
          <Input
            type="text"
            placeholder="Search by name"
            className="h-8 text-xs bg-slate-900/40 border-sky-500/70 text-sky-50 placeholder:text-sky-200/70"
            value={name || ''}
            onChange={(e) => onChangeName?.(e.target.value || '')}
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-sky-50">Type</Label>
          <select
            className="h-8 text-xs bg-slate-900/40 border-sky-500/70 text-sky-50 rounded-md px-2"
            value={type || ''}
            onChange={(e) => onChangeType?.(e.target.value || '')}
          >
            <option value="">All</option>
            <option value="email">Email</option>
            <option value="sms">SMS</option>
          </select>
        </div>
        <div className="space-y-1">
          <Label className="text-[11px] text-sky-50">Status</Label>
          <select
            className="h-8 text-xs bg-slate-900/40 border-sky-500/70 text-sky-50 rounded-md px-2"
            value={status || ''}
            onChange={(e) => onChangeStatus?.(e.target.value || '')}
          >
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="stopped">Stopped</option>
          </select>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center justify-center h-8 px-3 rounded-full text-[11px] font-medium border border-sky-200/80 text-sky-50 bg-slate-900/40 hover:bg-slate-800/60 transition-colors"
        >
          Clear filters
        </button>
      </div>
    </div>
  )
}

