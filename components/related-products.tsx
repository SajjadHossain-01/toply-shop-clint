'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { Star } from 'lucide-react'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { ProductCard } from './ProductCard'

interface Props {
  productId: string
}

export function RelatedProducts({ productId }: Props) {
  const axiosSecure = useAxiosSecure()

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['related-products', productId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/related/${productId}`)
      return res.data.products
    },
    enabled: !!productId,
  })

  if (isLoading) {
    return (
      <section className="py-12">
        <div className="text-center">Loading...</div>
      </section>
    )
  }

  if (!products.length) return null

  return (
    <section className="py-12 md:py-16 bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4">

        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Related Product
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((product: any) => {
            const currentPrice = product.offerPrice || product.price
            const discount =
              product.offerPrice && product.offerPrice < product.price
                ? Math.round(
                    ((product.price - product.offerPrice) / product.price) * 100
                  )
                : 0

            return (
             <ProductCard key={product._id} product={product} />
            )
          })}
        </div>
      </div>
    </section>
  )
}