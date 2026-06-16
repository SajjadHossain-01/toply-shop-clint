'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2, Eye, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'


interface Product {
  _id: string // MongoDB id
  name: string
  category: string
  price: number
  offerPrice: number
  stock: number
  ratings: {
    average: number
    count: number
  }
}

export function ProductsTable() {
  const queryClient = useQueryClient()
  const axiosSecure =useAxiosSecure()
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; id: string | null; name: string }>({
    open: false,
    id: null,
    name: '',
  })

  // ==========================================
  // ১. REACT QUERY দিয়ে DATA FETCHING (GET)
  // ==========================================
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      // আপনার API এন্ডপয়েন্ট অনুযায়ী ইউআরএল সেট করুন (বেস ইউআরএলUtils এ থাকলে শুধু '/api/products')
      const response = await axiosSecure.get('/products')
      return response.data // এটি ব্যাকএন্ডের { products, totalProducts, ... } অবজেক্ট রিটার্ন করবে
    },
  })

  // ==========================================
  // ২. REACT QUERY দিয়ে DATA DELETING (DELETE)
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosSecure.delete(`/products/${productId}`)
      return response.data
    },
    onSuccess: () => {
      alert('Product deleted successfully!')
      // টেবিল ডাটা রিফ্রেশ করার জন্য ক্যাশ ইনভ্যালিডেট করা
      queryClient.invalidateQueries({ queryKey: ['products'] })
      closeDeleteModal()
    },
    onError: (err: any) => {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to delete product')
    }
  })

  const openDeleteModal = (id: string, name: string) => {
    setDeleteModal({ open: true, id, name })
  }

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, id: null, name: '' })
  }

  const confirmDelete = () => {
    if (deleteModal.id) {
      deleteMutation.mutate(deleteModal.id)
    }
  }

  // লোডিং এবং এরর স্টেট হ্যান্ডেলিং
  if (isLoading) {
    return <div className="text-center py-10 font-medium text-gray-600">Loading products from server...</div>
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Error: {(error as any)?.message || 'Failed to load products'}
      </div>
    )
  }

  // ব্যাকএন্ডে রেসপন্স { products: [...] } আকারে আসলে সেটা রিসিভ করা
  const products: Product[] = data?.products || []

  return (
    <>
      <div className="overflow-x-auto bg-white rounded-xl border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-500">No products found.</td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-semibold">
                    ৳{product.offerPrice?.toLocaleString() || product.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.stock > 20 ? 'bg-green-100 text-green-800' : 
                      product.stock > 0 ? 'bg-amber-100 text-amber-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center gap-1">
                      <span className="text-amber-400">★</span>
                      <span className="text-gray-900 font-semibold">{product.ratings?.average || 0}</span>
                      <span className="text-gray-500 text-xs">({product.ratings?.count || 0})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/product/${product._id}`} title="View">
                        <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 hover:text-blue-700 p-2">
                          <Eye size={18} />
                        </Button>
                      </Link>
                      <Link href={`/admin/products/${product._id}/edit`} title="Edit">
                        <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10 hover:text-primary/80 p-2">
                          <Edit size={18} />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 hover:text-red-700 p-2"
                        disabled={deleteMutation.isPending}
                        onClick={() => openDeleteModal(product._id, product.name)}
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="text-red-600" size={24} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Delete Product?</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteModal.name}</span>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeDeleteModal}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}