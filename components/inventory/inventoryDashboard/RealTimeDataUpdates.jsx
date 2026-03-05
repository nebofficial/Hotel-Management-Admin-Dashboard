'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'

export default function RealTimeDataUpdates({ onRefresh, lastUpdate, autoRefresh = true, interval = 30000 }) {
  const [isOnline, setIsOnline] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!autoRefresh || !isOnline) return
    const timer = setInterval(() => {
      if (onRefresh) {
        setIsRefreshing(true)
        onRefresh().finally(() => setIsRefreshing(false))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [autoRefresh, interval, isOnline, onRefresh])

  const handleManualRefresh = () => {
    setIsRefreshing(true)
    if (onRefresh) {
      onRefresh().finally(() => setIsRefreshing(false))
    }
  }

  return (
    <Card className="border-0 shadow-md bg-gradient-to-r from-cyan-50 to-blue-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnline ? (
              <Wifi className="h-5 w-5 text-green-600" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-600" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-800">
                {isOnline ? 'Auto-refresh active' : 'Offline mode'}
              </p>
              {lastUpdate && (
                <p className="text-xs text-gray-600">
                  Last update: {new Date(lastUpdate).toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing || !isOnline}
            className="p-2 rounded-lg bg-white hover:bg-gray-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
