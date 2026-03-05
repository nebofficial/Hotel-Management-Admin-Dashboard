"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Rooms & Property: no hub page. Each feature lives on its own menu page.
 * Redirect to Room List as the default landing.
 */
export default function RoomsPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/rooms/list")
  }, [router])
  return null
}
