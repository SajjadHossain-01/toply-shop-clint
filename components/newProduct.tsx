'use client'

import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '@/hooks/AxiosPublic'
import { ProductCard, Product } from './ProductCard'

interface ProductSectionProps {
  title: string
  subtitle: string
}

export function NewArrivalProduct({
  title,
  subtitle,
}: ProductSectionProps) {
  const axiosPublic = useAxiosPublic()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['new-arrival-products'],
    queryFn: async () => {
      const res = await axiosPublic.get('/products/new-arrivals?limit=8')
      return res.data.products
    },
  })

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse">
        নতুন পণ্য লোড হচ্ছে...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        নতুন পণ্য লোড করতে সমস্যা হয়েছে।
      </div>
    )
  }

  const products: Product[] = data || []

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">

        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {title}
          </h2>

          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.length === 0 ? (
            <div className="col-span-full text-center py-10">
              কোনো নতুন পণ্য পাওয়া যায়নি।
            </div>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))
          )}

        </div>

      </div>
    </section>
  )
}