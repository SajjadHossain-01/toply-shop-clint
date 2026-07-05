'use client'

import Link from 'next/link'
import { Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import Swal from 'sweetalert2'

interface Product {
  _id: string
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
  const axiosSecure = useAxiosSecure()

 // ==========================================
  // ১. REACT QUERY দিয়ে DATA FETCHING (GET)
  // ==========================================
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const timestamp = new Date().getTime();
      const response = await axiosSecure.get(`/products?t=${timestamp}`)
      return response.data 
    },
  })
  // ==========================================
  // ২. REACT QUERY দিয়ে DATA DELETING (DELETE)
  // ==========================================
  const deleteMutation = useMutation({
    mutationFn: async (productId: string) => {
      const response = await axiosSecure.delete(`/products/${productId}`)
      return response.data
    },
    onSuccess: (data) => {

      if (data?.deletedCount > 0 || data?.success) {
        Swal.fire({
          title: "Deleted!",
          text: "Your product has been deleted.",
          icon: "success",
        });
      }
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (err: any) => {
      console.error(err)
      Swal.fire({
        title: "Error!",
        text: err.response?.data?.message || 'Failed to delete product',
        icon: "error",
      });
    }
  })

  // ডিলিট হ্যান্ডলার
  const handleDelete = (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(productId)
        
      }
    });
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

  const products: Product[] = data?.products || []

  return (
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${product.stock > 20 ? 'bg-green-100 text-green-800' :
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
                      onClick={() => handleDelete(product._id)}
                      title="Delete"
                      disabled={deleteMutation.isPending}
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
  )
}