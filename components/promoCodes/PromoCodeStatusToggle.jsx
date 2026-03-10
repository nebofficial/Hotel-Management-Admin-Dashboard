'use client'

export function PromoCodeStatusToggle({ isActive, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center justify-center h-6 px-2 rounded-full text-[10px] font-medium transition-colors ${
        isActive
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          : 'bg-slate-200 text-slate-700 border border-slate-300'
      }`}
    >
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}
