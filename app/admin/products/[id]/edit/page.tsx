'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ProductForm } from '@/components/admin/product-form'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import {  useMutation, useQuery, useQueryClient } from '@tanstack/react-query'




export default function EditProductPage() {
  const router = useRouter()
  const params = useParams()
  const queryClient = useQueryClient()
  const [isLoading, setIsLoading] = useState(false)
  const axiosSecure = useAxiosSecure()
  const { data: product, isError } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${params.id}`)
      return response.data
    },
    enabled: !!params.id,
  })
  // useMutation দিয়ে ডাটা পোস্ট বা আপডেট হ্যান্ডেল করা হয়
  const { mutate, isPending } = useMutation({
    mutationFn: async (newProductData: any) => {
      const response = await axiosSecure.patch(`/products/${params.id}`, newProductData)
      return response.data
    },
    onSuccess: (data) => {
      if (data.success) {
        alert('Product added successfully!')
        // প্রোডাক্ট লিস্টের ক্যাশ ডাটা ইনভ্যালিডেট করে রিফ্রেশ করবে
        queryClient.invalidateQueries({ queryKey: ['products'] })
        router.push('/admin/products') // প্রোডাক্ট লিস্ট পেজে নিয়ে যাবে
      } else {
        alert(data.message || 'Something went wrong')
      }
    },
    onError: (error: any) => {
      console.error('Error adding product:', error)
      alert(error.response?.data?.message || 'Failed to connect to server')
    },
  })

  const handleSubmit = (data: any) => {
    mutate(data) // এখানে mutate ফাংশনটি কল করলেই React Query কাজ শুরু করবে
  }
  // const handleSubmit = async (formData: any) => {
  //   setIsLoading(true)

  //   try {
  //     // Simulate API call
  //     const res = await axiosSecure.patch(`/products/${params.id}`)

  //     if (res) {
  //       alert('পণ্য সফলভাবে আপডেট করা হয়েছে!')

  //       // Redirect to products page
  //       router.push('/admin/products')
  //     }
  //   } catch (error) {
  //     console.error('Error updating product:', error)
  //     alert('পণ্য আপডেট করতে ত্রুটি হয়েছে')
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-2">Update product information and pricing</p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}
