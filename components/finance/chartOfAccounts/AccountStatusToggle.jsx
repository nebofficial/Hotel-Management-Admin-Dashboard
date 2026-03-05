'use client'

import { Label } from '@/components/ui/label'

export default function AccountStatusToggle({ value, onChange }) {
  const isActive = value === 'Active'

  return (
    <div>
      <Label className="text-gray-700">Status</Label>
      <div className="mt-2 flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isActive}
          onClick={() => onChange(isActive ? 'Inactive' : 'Active')}
          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isActive ? 'translate-x-5' : 'translate-x-1'}`}
          />
        </button>
        <span className={`text-sm font-medium ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
          {value || 'Active'}
        </span>
      </div>
    </div>
  )
}
