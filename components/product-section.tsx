'use client'

import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '@/hooks/AxiosPublic'
import { ProductCard, Product } from './ProductCard' // পাথ ঠিক করে নেবেন

interface ProductSectionProps {
  title: string
  subtitle: string
}

export function ProductSection({ title, subtitle }: ProductSectionProps) {
  const axiosPublic = useAxiosPublic()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await axiosPublic.get('/products')
      return response.data
    },
  })

  if (isLoading) {
    return (
      <div className="py-20 text-center text-muted-foreground font-semibold animate-pulse">
        প্রোডাক্ট লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="py-20 text-center text-destructive font-semibold">
        দুঃখিত! প্রোডাক্ট ডাটা লোড করতে সমস্যা হয়েছে।
      </div>
    )
  }

  const products: Product[] = data?.products || []

  return (
    <section className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {subtitle}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground border border-dashed rounded-xl">
              কোনো প্রোডাক্ট পাওয়া যায়নি।
            </div>
          ) : (
            products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          )}
        </div>

      </div>
    </section>
  )
}