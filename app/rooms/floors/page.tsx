import { Suspense } from "react"
import FloorsPageContent from "./FloorsPageContent"

function FloorsLoading() {
  return (
    <main className="p-4 space-y-6">
      <div className="h-8 w-48 bg-gray-100 animate-pulse rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-lg bg-gray-100 animate-pulse" />
        ))}
      </div>
    </main>
  )
}

export default function FloorsPage() {
  return (
    <Suspense fallback={<FloorsLoading />}>
      <FloorsPageContent />
    </Suspense>
  )
}
