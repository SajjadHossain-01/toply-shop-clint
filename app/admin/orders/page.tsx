'use client'

import { useState, useRef } from 'react'
import { Search, Eye, Phone, X, Check, Printer } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvoiceTemplate } from '@/components/admin/invoice-template'
import { useReactToPrint } from 'react-to-print'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'




export default function OrdersPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewModal, setViewModal] = useState<{ open: boolean; order: any }>({ open: false, order: null })
  const [statusModal, setStatusModal] = useState<{ open: boolean; orderId: string }>({ open: false, orderId: '' })
  const [callModal, setCallModal] = useState<{ open: boolean; customer: string; phone: string }>({ open: false, customer: '', phone: '' })
  const [printModal, setPrintModal] = useState<{ open: boolean; order: any }>({ open: false, order: null })
  
  const invoiceRef = useRef<HTMLDivElement>(null)
const axiosSecure=useAxiosSecure()
  const handlePrintInvoice = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${printModal.order?.id || printModal.order?._id || 'Order'}`,
  })

  // ১. React Query দিয়ে সব অর্ডার ডাটাবেজ থেকে নিয়ে আসা
  const { data: orders = [], isLoading, isError } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: async () => {
      const response = await axiosSecure.get('/orders')
      return response.data
    }
  })

  // ২. React Query Mutation দিয়ে অর্ডারের স্ট্যাটাস আপডেট করা
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await axiosSecure.patch(`/orders/${id}`, { status })
      return response.data
    },
    onSuccess: () => {
      // স্ট্যাটাস চেঞ্জ সফল হলে টেবিল রিফ্রেশ করবে
      queryClient.invalidateQueries({ queryKey: ['adminOrders'] })
      setStatusModal({ open: false, orderId: '' })
    },
    onError: (error) => {
      console.error("Failed to update status:", error)
    }
  })

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'shipped': return 'bg-amber-100 text-amber-800'
      case 'pending': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  // ৩. ডাইনামিক ফিল্টারিং এবং সার্চ লজিক
  const filteredOrders = orders.filter((order: any) => {
    // MongoDB র আইডেন্টিফায়ার সাধারণত _id বা id হয়, ব্যাকএন্ড অনুযায়ী চেক করে নিবে
    const orderId = order.id || order._id || ''
    const matchesStatus = selectedStatus === 'all' || order.status?.toLowerCase() === selectedStatus.toLowerCase()
    
    const matchesSearch = 
      orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.phone?.includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  // ৪. স্ট্যাটাস কার্ডের জন্য ডাইনামিক ক্যালকুলেশন
  const totalOrdersCount = orders.length
  const pendingCount = orders.filter((o: any) => o.status?.toLowerCase() === 'pending').length
  const processingCount = orders.filter((o: any) => o.status?.toLowerCase() === 'processing').length
  const totalRevenue = orders.reduce((acc: number, curr: any) => curr.status?.toLowerCase() !== 'cancelled' ? acc + (curr.amount || 0) : acc, 0)

  if (isLoading) return <div className="p-6 text-center text-lg font-semibold">Loading orders from database...</div>
  if (isError) return <div className="p-6 text-center text-red-500 font-semibold">Error loading orders. Please check your token or controller.</div>

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="text-gray-600 mt-1">Manage and track all customer orders</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Total Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{totalOrdersCount}</p>
          <p className="text-green-600 text-xs mt-1">Live from database</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Pending Orders</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{pendingCount}</p>
          <p className="text-amber-600 text-xs mt-1">Need attention</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Processing</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{processingCount}</p>
          <p className="text-blue-600 text-xs mt-1">Being prepared</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">৳{totalRevenue.toLocaleString()}</p>
          <p className="text-green-600 text-xs mt-1">Excluding cancelled</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by order ID, customer name, or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Items</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Payment</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order: any) => {
                const currentId = order.id || order._id
                return (
                  <tr key={currentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{currentId}</td>
                    <td className="px-6 py-4 text-sm">
                      <div>
                        <p className="font-medium text-gray-900">{order.customer}</p>
                        <p className="text-gray-600 text-xs">{order.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      {order.items || order.products?.length || 0} items
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900">৳{order.amount?.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.payment || order.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50 p-2" 
                          title="View Details"
                          onClick={() => setViewModal({ open: true, order })}
                        >
                          <Eye size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-primary hover:bg-primary/10 p-2" 
                          title="Change Status"
                          onClick={() => setStatusModal({ open: true, orderId: currentId })}
                        >
                          <Check size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:bg-green-50 p-2" 
                          title="Call Customer"
                          onClick={() => setCallModal({ open: true, customer: order.customer, phone: order.phone })}
                        >
                          <Phone size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Order Modal */}
      {viewModal.open && viewModal.order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Order Details - {viewModal.order.id || viewModal.order._id}</h2>
              <button onClick={() => setViewModal({ open: false, order: null })} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">Customer Name</p>
                  <p className="text-gray-900 font-semibold text-lg">{viewModal.order.customer}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Phone</p>
                  <p className="text-gray-900 font-semibold text-lg">{viewModal.order.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Email</p>
                  <p className="text-gray-900 font-semibold">{viewModal.order.email}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium">Order Date</p>
                  <p className="text-gray-900 font-semibold">{viewModal.order.date}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">Products Ordered</h3>
                <div className="space-y-2">
                  {viewModal.order.products?.map((product: any, index: number) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-900">{typeof product === 'string' ? product : product.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Amount</p>
                    <p className="text-2xl font-bold text-primary">৳{viewModal.order.amount?.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm">Payment Method</p>
                    <p className="text-gray-900 font-semibold">{viewModal.order.payment || viewModal.order.paymentMethod}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" className="flex-1" onClick={() => setViewModal({ open: false, order: null })}>
                  Close
                </Button>
                <Button className="flex-1 bg-primary hover:bg-primary/90 flex items-center justify-center gap-2" onClick={() => setPrintModal({ open: true, order: viewModal.order })}>
                  <Printer size={18} /> Print Invoice
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Status Modal */}
      {statusModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Change Order Status</h2>
              <button onClick={() => setStatusModal({ open: false, orderId: '' })} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-3">
              {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  disabled={updateStatusMutation.isPending}
                  onClick={() => {
                    updateStatusMutation.mutate({ id: statusModal.orderId, status })
                  }}
                  className="w-full p-3 text-left border border-gray-200 rounded-lg hover:bg-primary/10 hover:border-primary transition flex items-center justify-between group disabled:opacity-50"
                >
                  <span className="font-medium text-gray-900 group-hover:text-primary">
                    {updateStatusMutation.isPending ? 'Updating...' : status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                    {status}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Call Customer Modal */}
      {callModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Call Customer</h2>
              <button onClick={() => setCallModal({ open: false, customer: '', phone: '' })} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-gradient-to-br from-primary/10 to-primary/5 p-6 rounded-lg text-center">
                <p className="text-gray-600 text-sm mb-2">Customer Name</p>
                <p className="text-2xl font-bold text-gray-900 mb-4">{callModal.customer}</p>
                <p className="text-gray-600 text-sm mb-2">Phone Number</p>
                <a href={`tel:${callModal.phone}`} className="text-3xl font-bold text-primary font-mono block hover:underline">{callModal.phone}</a>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setCallModal({ open: false, customer: '', phone: '' })}>
                  Cancel
                </Button>
                <a href={`tel:${callModal.phone}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2 font-semibold rounded-md text-sm">
                  <Phone size={20} /> Call Now
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Invoice Modal */}
      {printModal.open && printModal.order && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8">
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-white rounded-t-xl">
              <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
              <button onClick={() => setPrintModal({ open: false, order: null })} className="p-2 hover:bg-gray-100 rounded-lg transition">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 bg-gray-50 max-h-[70vh] overflow-y-auto">
              <div ref={invoiceRef} className="bg-white rounded-lg overflow-hidden shadow-lg">
                <InvoiceTemplate order={printModal.order} />
              </div>
            </div>

            <div className="sticky bottom-0 flex gap-3 p-6 border-t border-gray-200 bg-white rounded-b-xl">
              <Button variant="outline" className="flex-1" onClick={() => setPrintModal({ open: false, order: null })}>
                Close
              </Button>
              <Button className="flex-1 bg-primary hover:bg-primary/90 text-white flex items-center justify-center gap-2 font-semibold" onClick={() => handlePrintInvoice()}>
                <Printer size={20} /> Print Invoice
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}