'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/app/auth-context'
import { Loader2, ArrowRightLeft } from 'lucide-react'

import TransferStockBetweenLocations from './TransferStockBetweenLocations'
import TransferHistory from './TransferHistory'
import ApproveTransfer from './ApproveTransfer'
import TrackTransferStatus from './TrackTransferStatus'
import PendingTransferList from './PendingTransferList'
import AutoStockDeduction from './AutoStockDeduction'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function StockTransfer() {
  const { user } = useAuth()
  const [locations, setLocations] = useState([])
  const [inventoryItems, setInventoryItems] = useState([])
  const [stockByLocation, setStockByLocation] = useState([])
  const [transfers, setTransfers] = useState([])
  const [selectedTransfer, setSelectedTransfer] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('new')

  const loadData = async () => {
    if (!user?.hotelId) {
      setLoading(false)
      return
    }
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (!token) {
      setLoading(false)
      return
    }
    setLoading(true)
    try {
      const [locRes, itemsRes, stockRes, transRes] = await Promise.all([
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/inventory-locations`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/inventory-items`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/item-stock-by-location`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/stock-transfers${statusFilter ? `?status=${statusFilter}` : ''}`, { headers: { Authorization: `Bearer ${token}` } }),
      ])
      if (locRes.ok) {
        const d = await locRes.json()
        setLocations(d.locations || [])
      } else {
        console.error('Failed to load locations:', locRes.status)
      }
      if (itemsRes.ok) {
        const d = await itemsRes.json()
        setInventoryItems(d.items || [])
      } else {
        console.error('Failed to load items:', itemsRes.status)
      }
      if (stockRes.ok) {
        const d = await stockRes.json()
        setStockByLocation(d.stock || [])
      } else {
        console.error('Failed to load stock by location:', stockRes.status)
      }
      if (transRes.ok) {
        const d = await transRes.json()
        setTransfers(d.transfers || [])
      } else {
        console.error('Failed to load transfers:', transRes.status)
      }
    } catch (e) {
      console.error('Error loading data:', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user?.hotelId) {
      loadData()
    }
  }, [user?.hotelId, statusFilter])

  const filteredTransfers = transfers.filter((t) => !searchTerm || t.transferNumber?.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-indigo-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Stock Transfer</h1>
        <p className="text-gray-600 mt-1">Transfer stock between stores and track history</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="new">New Transfer</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="detail">Transfer Detail</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {loading && locations.length === 0 && inventoryItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mb-2" />
              <p className="text-gray-600">Loading inventory data...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                {locations.length === 0 ? (
                  <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="p-6 text-center">
                      <p className="text-yellow-800 font-medium">No inventory locations found</p>
                      <p className="text-yellow-600 text-sm mt-1">Please create at least one inventory location first.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <TransferStockBetweenLocations
                    locations={locations}
                    inventoryItems={inventoryItems}
                    stockByLocation={stockByLocation}
                    onTransferCreated={(t) => {
                      setSelectedTransfer(t)
                      setActiveTab('detail')
                      loadData()
                    }}
                  />
                )}
              </div>
              <div>
                <PendingTransferList
                  transfers={transfers}
                  locations={locations}
                  onSelectTransfer={(t) => {
                    setSelectedTransfer(t)
                    setActiveTab('detail')
                  }}
                />
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <TransferHistory
            transfers={filteredTransfers}
            locations={locations}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilter={setStatusFilter}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <PendingTransferList transfers={transfers} locations={locations} onSelectTransfer={(t) => { setSelectedTransfer(t); setActiveTab('detail'); }} />
          </div>
        </TabsContent>

        <TabsContent value="detail" className="space-y-4">
          {selectedTransfer ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <TrackTransferStatus transfer={selectedTransfer} />
              <ApproveTransfer transfer={selectedTransfer} onApproved={(t) => { setSelectedTransfer(t); loadData(); }} />
              <AutoStockDeduction transfer={selectedTransfer} onCompleted={(t) => { setSelectedTransfer(t); loadData(); }} />
              <Card className="lg:col-span-2 bg-white">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Items in this transfer</h3>
                  <div className="space-y-2">
                    {(selectedTransfer.items || []).map((line, i) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span>{line.itemName || line.itemId}</span>
                        <span className="font-medium">{line.quantity} {line.unit || ''}</span>
                      </div>
                    ))}
                  </div>
                  {selectedTransfer.notes && (
                    <p className="text-sm text-gray-500 mt-3">Notes: {selectedTransfer.notes}</p>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center text-gray-500">
                <ArrowRightLeft className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Create a transfer or select one from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
