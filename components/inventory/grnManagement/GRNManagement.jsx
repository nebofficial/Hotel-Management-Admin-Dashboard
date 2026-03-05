'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAuth } from '@/app/auth-context'
import { Search, FileText, Plus, Loader2, Package, CheckCircle2, XCircle } from 'lucide-react'

import CreateGRNFromPO from './CreateGRNFromPO'
import VerifyDeliveredItems from './VerifyDeliveredItems'
import UpdateStockAutomatically from './UpdateStockAutomatically'
import AcceptRejectItems from './AcceptRejectItems'
import QuantityVerification from './QuantityVerification'
import DamagedItemEntry from './DamagedItemEntry'
import BatchNumberEntry from './BatchNumberEntry'
import ExpiryDateRecording from './ExpiryDateRecording'
import AutoStockUpdate from './AutoStockUpdate'
import GRNPDFPrint from './GRNPDFPrint'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function GRNManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [grns, setGrns] = useState([])
  const [purchaseOrders, setPurchaseOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedGRN, setSelectedGRN] = useState(null)
  const [activeTab, setActiveTab] = useState('list')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)

  useEffect(() => {
    if (user?.hotelId) {
      loadGRNs()
      loadPurchaseOrders()
    }
  }, [user?.hotelId])

  const loadGRNs = async () => {
    if (!user?.hotelId) return

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        alert('Not authenticated. Please log in again.')
        return
      }

      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/grns`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to load GRNs' }))
        throw new Error(errorData.message || 'Failed to load GRNs')
      }

      const data = await res.json()
      setGrns(data.grns || [])
    } catch (error) {
      console.error('Load GRNs error:', error)
      alert(error.message || 'Failed to load GRNs')
    } finally {
      setLoading(false)
    }
  }

  const loadPurchaseOrders = async () => {
    if (!user?.hotelId) return

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/purchase-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setPurchaseOrders(data.orders || [])
      }
    } catch (error) {
      console.error('Load purchase orders error:', error)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !user?.hotelId) return

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/grns/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to delete GRN' }))
        throw new Error(errorData.message || 'Failed to delete GRN')
      }

      alert('GRN deleted successfully')
      setShowDeleteDialog(false)
      setDeleteTarget(null)
      loadGRNs()
    } catch (error) {
      console.error('Delete GRN error:', error)
      alert(error.message || 'Failed to delete GRN')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      Draft: 'bg-gray-100 text-gray-700',
      Pending: 'bg-yellow-100 text-yellow-700',
      Verified: 'bg-blue-100 text-blue-700',
      Approved: 'bg-green-100 text-green-700',
      Rejected: 'bg-red-100 text-red-700',
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const filteredGRNs = grns.filter((grn) => {
    const search = searchTerm.toLowerCase()
    return (
      grn.grnNumber?.toLowerCase().includes(search) ||
      grn.status?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GRN Management</h1>
          <p className="text-gray-600 mt-1">Manage Goods Receipt Notes and verification</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="list">GRN List</TabsTrigger>
          <TabsTrigger value="create">Create GRN</TabsTrigger>
          <TabsTrigger value="details" disabled={!selectedGRN}>GRN Details</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search GRNs by number or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : filteredGRNs.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No GRNs found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredGRNs.map((grn) => (
                    <div
                      key={grn.id}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedGRN(grn)
                        setActiveTab('details')
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{grn.grnNumber}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(grn.status)}`}>
                              {grn.status}
                            </span>
                            {grn.stockUpdated && (
                              <CheckCircle2 className="h-4 w-4 text-green-600" title="Stock Updated" />
                            )}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-gray-600">
                            <div>
                              <span className="text-gray-500">Date: </span>
                              <span>{new Date(grn.receivedDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Items: </span>
                              <span>{grn.totalItems || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Accepted: </span>
                              <span className="text-green-600 font-medium">{grn.totalAcceptedItems || 0}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">Total: </span>
                              <span className="font-semibold">₹{Number(grn.totalAmount || 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedGRN(grn)
                              setActiveTab('details')
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            View
                          </Button>
                          {grn.status === 'Draft' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                setDeleteTarget(grn)
                                setShowDeleteDialog(true)
                              }}
                              className="border-red-300 text-red-700 hover:bg-red-50"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="space-y-4">
          <CreateGRNFromPO purchaseOrders={purchaseOrders} onGRNCreated={(grn) => {
            loadGRNs()
            setSelectedGRN(grn)
            setActiveTab('details')
          }} />
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedGRN ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <VerifyDeliveredItems grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <AcceptRejectItems grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <QuantityVerification grn={selectedGRN} />
              <DamagedItemEntry grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <BatchNumberEntry grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <ExpiryDateRecording grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <UpdateStockAutomatically grn={selectedGRN} onUpdate={(grn) => {
                setSelectedGRN(grn)
                loadGRNs()
              }} />
              <AutoStockUpdate grn={selectedGRN} />
              <GRNPDFPrint grn={selectedGRN} />
            </div>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Select a GRN from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete GRN</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.grnNumber}"? This action cannot be undone.
              {deleteTarget && deleteTarget.status !== 'Draft' && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Note: Only Draft GRNs can be deleted.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
