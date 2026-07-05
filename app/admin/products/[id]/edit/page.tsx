'use client'

import { useParams, useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'

export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()

  // ১. প্রোডাক্টের আগের ডাটা ফেচ করা
  const { data: product, isLoading: isFetchLoading, isError } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${params.id}`)
      // আপনার ব্যাকএন্ড রেসপন্স যদি { success: true, data: {...} } এমন হয়, তাহলে response.data.data দিন
      return response.data?.data || response.data 
    },
    enabled: !!params.id,
  })

  // ২. useMutation দিয়ে ডাটা আপডেট (PATCH) হ্যান্ডেল করা
  const { mutate, isPending: isUpdateLoading } = useMutation({
    mutationFn: async (updatedProductData: any) => {
      const response = await axiosSecure.patch(`/products/${params.id}`, updatedProductData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
          Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Product updated successfully!",
                  showConfirmButton: false,
                  timer: 1500
                });
        
        // লিস্ট এবং স্পেসিফিক প্রোডাক্ট উভয়ের ক্যাশ ইনভ্যালিডেট করা
        queryClient.invalidateQueries({ queryKey: ['products'] })
        queryClient.invalidateQueries({ queryKey: ['product', params.id] })
        
        router.push('/admin/products') 
      } else {
        alert(data.message || 'Something went wrong')
      }
    },
    onError: (error: any) => {
      console.error('Error updating product:', error)
      alert(error.response?.data?.message || 'Failed to connect to server')
    },
  })

  const handleSubmit = (data: any) => {
    mutate(data) 
  }

  // ডাটা লোড হওয়ার সময় একটি সিম্পল লোডার দেখানো ভালো
  if (isFetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 font-medium">Loading product data...</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="p-6 text-center text-red-600 font-medium">
        Error loading product or product not found!
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information and pricing</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isUpdateLoading} // রিয়্যাক্ট কোয়েরির 'isPending' পাস করা হয়েছে
      />
    </div>
  )
}