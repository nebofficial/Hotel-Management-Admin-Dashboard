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
import { useAuth } from '@/hooks/useAuth'
import { Search, Edit, Trash2, Plus, Loader2, Building2, Phone, Mail, Star } from 'lucide-react'

import AddSupplier from './AddSupplier'
import EditSupplier from './EditSupplier'
import SupplierContactDetails from './SupplierContactDetails'
import SupplierPaymentTerms from './SupplierPaymentTerms'
import SupplierHistory from './SupplierHistory'
import GSTNumber from './GSTNumber'
import BankDetails from './BankDetails'
import SupplierRating from './SupplierRating'
import PurchaseHistoryTracking from './PurchaseHistoryTracking'
import OutstandingPaymentView from './OutstandingPaymentView'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export default function SupplierManagement() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [suppliers, setSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [activeTab, setActiveTab] = useState('list')

  useEffect(() => {
    if (user?.hotelId) {
      loadSuppliers()
    }
  }, [user?.hotelId])

  const loadSuppliers = async () => {
    if (!user?.hotelId) {
      return
    }

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        alert('Not authenticated. Please log in again.')
        return
      }

      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/suppliers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: 'Failed to load suppliers' }))
        throw new Error(errorData.message || `HTTP ${res.status}: Failed to load suppliers`)
      }

      const data = await res.json()
      setSuppliers(data.suppliers || [])
    } catch (error) {
      console.error('Load suppliers error:', error)
      alert(error.message || 'Failed to load suppliers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget || !user?.hotelId) return

    setLoading(true)
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
      if (!token) {
        alert('Not authenticated. Please log in again.')
        return
      }

      const res = await fetch(`${API_BASE}/api/hotel-data/${user.hotelId}/suppliers/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to delete supplier')
      }

      alert('Supplier deleted successfully')
      setShowDeleteDialog(false)
      setDeleteTarget(null)
      loadSuppliers()
    } catch (error) {
      console.error('Delete supplier error:', error)
      alert(error.message || 'Failed to delete supplier')
    } finally {
      setLoading(false)
    }
  }

  const filteredSuppliers = suppliers.filter((supplier) => {
    const search = searchTerm.toLowerCase()
    return (
      supplier.name?.toLowerCase().includes(search) ||
      supplier.contactPerson?.toLowerCase().includes(search) ||
      supplier.email?.toLowerCase().includes(search) ||
      supplier.phone?.toLowerCase().includes(search) ||
      supplier.gstNumber?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 to-blue-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supplier Management</h1>
          <p className="text-gray-600 mt-1">Manage suppliers and vendor information</p>
        </div>
        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="list">Supplier List</TabsTrigger>
          <TabsTrigger value="details">Supplier Details</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card className="bg-white border-gray-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search suppliers by name, contact, email, phone, or GST..."
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
              ) : filteredSuppliers.length === 0 ? (
                <div className="text-center py-12">
                  <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">No suppliers found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSuppliers.map((supplier) => (
                    <div
                      key={supplier.id}
                      className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedSupplier(supplier)
                        setActiveTab('details')
                      }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{supplier.name}</h3>
                            <span
                              className={`px-2 py-0.5 rounded text-xs font-medium ${
                                supplier.isActive
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {supplier.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {supplier.rating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-gray-700">
                                  {Number(supplier.rating).toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            {supplier.contactPerson && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{supplier.contactPerson}</span>
                              </div>
                            )}
                            {supplier.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>{supplier.email}</span>
                              </div>
                            )}
                            {supplier.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <span>{supplier.phone}</span>
                              </div>
                            )}
                          </div>
                          {supplier.paymentTerms && (
                            <div className="mt-2">
                              <span className="text-xs text-gray-500">Payment Terms: </span>
                              <span className="text-xs font-medium text-gray-700">{supplier.paymentTerms}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedSupplier(supplier)
                              setShowEditModal(true)
                            }}
                            className="border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteTarget(supplier)
                              setShowDeleteDialog(true)
                            }}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          {selectedSupplier ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <SupplierContactDetails supplier={selectedSupplier} onUpdate={loadSuppliers} />
              <SupplierPaymentTerms supplier={selectedSupplier} onUpdate={loadSuppliers} />
              <GSTNumber supplier={selectedSupplier} onUpdate={loadSuppliers} />
              <BankDetails supplier={selectedSupplier} onUpdate={loadSuppliers} />
              <SupplierRating supplier={selectedSupplier} onUpdate={loadSuppliers} />
              <SupplierHistory supplier={selectedSupplier} />
              <PurchaseHistoryTracking supplier={selectedSupplier} />
              <OutstandingPaymentView supplier={selectedSupplier} />
            </div>
          ) : (
            <Card className="bg-white border-gray-200">
              <CardContent className="p-12 text-center">
                <Building2 className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Select a supplier from the list to view details</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Add New Supplier</h2>
                <Button variant="ghost" onClick={() => setShowAddModal(false)}>
                  ×
                </Button>
              </div>
              <AddSupplier
                onSuccess={(supplier) => {
                  setShowAddModal(false)
                  loadSuppliers()
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      {showEditModal && selectedSupplier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Edit Supplier</h2>
                <Button variant="ghost" onClick={() => setShowEditModal(false)}>
                  ×
                </Button>
              </div>
              <EditSupplier
                supplier={selectedSupplier}
                onSuccess={(supplier) => {
                  setShowEditModal(false)
                  setSelectedSupplier(supplier)
                  loadSuppliers()
                }}
              />
            </CardContent>
          </Card>
        </div>
      )}

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Supplier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.name}"? This action cannot be undone.
              {deleteTarget && (
                <span className="block mt-2 text-red-600 font-semibold">
                  Note: This supplier cannot be deleted if there are associated purchase orders.
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
