'use client'

export default function PropertyFilter({ value, onChange, properties = [] }) {
  if (!properties || properties.length <= 1) return null

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-gray-600">Property:</span>
      <select
        value={value || 'all'}
        onChange={(e) => onChange?.(e.target.value)}
        className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs"
      >
        <option value="all">All Properties</option>
        {properties.map((p) => (
          <option key={p.id} value={p.id}>{p.name || p.id}</option>
        ))}
      </select>
    </div>
  )
}
