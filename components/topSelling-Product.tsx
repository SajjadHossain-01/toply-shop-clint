'use client'

import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '@/hooks/AxiosPublic'
import { ProductCard, Product } from './ProductCard'

interface ProductSectionProps {
  title: string
  subtitle: string
}

export function TopSellingProduct({
  title,
  subtitle,
}: ProductSectionProps) {
  const axiosPublic = useAxiosPublic()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['top-selling-products'],
    queryFn: async () => {
      const res = await axiosPublic.get('/products/top-selling?limit=8')
      return res.data.products
    },
  })

  if (isLoading) {
    return (
      <div className="py-20 text-center animate-pulse text-muted-foreground">
        Top Selling Product লোড হচ্ছে...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-red-500">
        Top Selling Product লোড করতে সমস্যা হয়েছে।
      </div>
    )
  }

  const products: Product[] = data || []

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {title}
          </h2>

          <p className="text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {products.length === 0 ? (
            <div className="col-span-full text-center py-12 border rounded-xl">
              কোনো Top Selling Product পাওয়া যায়নি।
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