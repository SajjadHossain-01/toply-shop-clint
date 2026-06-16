'use client'

import { useState } from 'react'
import { Search, Edit, Trash2, Mail, Phone, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'


export default function CustomersPage() {
  const queryClient = useQueryClient()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All Status')
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string; name: string }>({
    open: false,
    id: '',
    name: '',
  })
  const axiosSecure= useAxiosSecure()

  // ১. React Query দিয়ে ডেটাবেজ থেকে কাস্টমার (Users) লিস্ট নিয়ে আসা
  const { data: customers = [], isLoading, isError } = useQuery({
    queryKey: ['adminCustomers'],
    queryFn: async () => {
      // আপনার ব্যাকএন্ড কন্ট্রোলারের getAllUsers কে কল করবে
      const response = await axiosSecure.get('/users') 
      return response.data
    }
  })

  // ২. React Query Mutation দিয়ে কাস্টমার ডিলিট করা
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: string) => {
      // আপনার ব্যাকএন্ড কন্ট্রোলারের deleteUser কে কল করবে
      const response = await axiosSecure.delete(`/users/${id}`)
      return response.data
    },
    onSuccess: () => {
      // ডিলিট সফল হলে টেবিল রিফ্রেশ বা ক্যাশ ইনভ্যালিডেট করবে
      queryClient.invalidateQueries({ queryKey: ['adminCustomers'] })
      setDeleteModal({ open: false, id: '', name: '' })
    },
    onError: (error) => {
      console.error("Error deleting customer:", error)
    }
  })

  // ৩. ক্লায়েন্ট সাইড সার্চ ও ফিল্টারিং লজিক
  const filteredCustomers = customers.filter((customer: any) => {
    const matchesStatus = 
      selectedStatus === 'All Status' || 
      customer.status?.toLowerCase() === selectedStatus.toLowerCase()

    const matchesSearch =
      customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.includes(searchTerm)

    return matchesStatus && matchesSearch
  })

  // ৪. ডাইনামিক স্ট্যাটাস কার্ড ক্যালকুলেশন
  const totalCustomers = customers.length
  const activeCustomers = customers.filter((c: any) => c.status?.toLowerCase() === 'active').length
  const newThisMonth = customers.filter((c: any) => {
    if (!c.createdAt) return false
    const createdDate = new Date(c.createdAt)
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
  }).length

  if (isLoading) return <div className="p-6 text-center text-lg font-semibold">Loading customers from database...</div>
  if (isError) return <div className="p-6 text-center text-red-500 font-semibold">Error loading customers. Please verify Admin JWT Token.</div>

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">Manage and view all customer information</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm font-medium">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{totalCustomers}</p>
            <p className="text-green-600 text-xs mt-1">Live from db</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm font-medium">Active Customers</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{activeCustomers}</p>
            <p className="text-green-600 text-xs mt-1">
              {totalCustomers > 0 ? ((activeCustomers / totalCustomers) * 100).toFixed(1) : 0}% active
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">৳3,250</p>
            <p className="text-blue-600 text-xs mt-1">Per customer</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-gray-600 text-sm font-medium">New This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{newThisMonth}</p>
            <p className="text-green-600 text-xs mt-1">Joined in current month</p>
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
                placeholder="Search by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="All Status">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Phone</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Orders</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total Spent</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer: any) => {
                  const customerId = customer._id || customer.id
                  return (
                    <tr key={customerId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm">
                        <p className="font-semibold text-gray-900">{customer.name}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <a href={`mailto:${customer.email}`} className="text-primary hover:underline flex items-center gap-2">
                          <Mail size={16} />
                          {customer.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {customer.phone ? (
                          <a href={`tel:${customer.phone}`} className="text-gray-600 hover:text-gray-900 flex items-center gap-2">
                            <Phone size={16} />
                            {customer.phone}
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{customer.orders || 0}</td>
                      <td className="px-6 py-4 text-sm font-bold text-gray-900">৳{(customer.totalSpent || 0).toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          customer.status?.toLowerCase() === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 p-2" title="Edit">
                            <Edit size={18} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-red-600 hover:bg-red-50 p-2"
                            onClick={() => setDeleteModal({ open: true, id: customerId, name: customer.name })}
                            title="Delete"
                          >
                            <Trash2 size={18} />
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
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Customer?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteModal.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                disabled={deleteCustomerMutation.isPending}
                onClick={() => setDeleteModal({ open: false, id: '', name: '' })}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                disabled={deleteCustomerMutation.isPending}
                onClick={() => deleteCustomerMutation.mutate(deleteModal.id)}
              >
                {deleteCustomerMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}