import { Suspense } from 'react'
import AuditLogsPage from '@/components/system/auditLogs/AuditLogsPage'

function AuditLoading() {
  return (
    <main className="p-4 md:p-6 space-y-4">
      <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-20 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    </main>
  )
}

export default function AuditLogsRoutePage() {
  return (
    <Suspense fallback={<AuditLoading />}>
      <AuditLogsPage />
    </Suspense>
  )
}

