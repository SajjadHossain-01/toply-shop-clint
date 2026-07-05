'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import Swal from 'sweetalert2'



export default function AddProductPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const axiosSecure = useAxiosSecure()

  // useMutation দিয়ে ডাটা পোস্ট বা আপডেট হ্যান্ডেল করা হয়
  const { mutate, isPending } = useMutation({
    mutationFn: async (newProductData: any) => {
      const response = await axiosSecure.post('/products', newProductData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Product added successfully!",
          showConfirmButton: false,
          timer: 1500
        });
        queryClient.invalidateQueries({ queryKey: ['products'] })
        router.push('/admin/products')
      } else {
        alert(data.message || 'Something went wrong')
      }
    },
    onError: (error: any) => {
      console.error('Error adding product:', error)
      alert(error.response?.data?.message || 'Failed to connect to server')
    },
  })

  const handleProductSubmit = (data: any) => {
    mutate(data)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <ProductForm onSubmit={handleProductSubmit} isLoading={isPending} />
    </div>
  )
}