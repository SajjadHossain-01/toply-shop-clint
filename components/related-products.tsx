'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star } from 'lucide-react'
import Link from 'next/link'

const allProducts = [
  {
    id: 1,
    name: 'জায়ান ইন্টেলিজেন্স বুক (খণ্ড ১)',
    image: '📚',
    price: 990,
    originalPrice: 1550,
    rating: 4.5,
    reviews: 128,
    category: 'Intelligence Book',
  },
  {
    id: 2,
    name: 'শিক্ষামূলক খেলনা সেট',
    image: '🧩',
    price: 2500,
    originalPrice: 3500,
    rating: 4.8,
    reviews: 256,
    category: 'Toys',
  },
  {
    id: 3,
    name: 'বেবি বই কালেকশন',
    image: '📕',
    price: 1800,
    originalPrice: 2500,
    rating: 4.6,
    reviews: 342,
    category: 'Books',
  },
  {
    id: 4,
    name: 'ইন্টেলিজেন্স বই (খণ্ড ২)',
    image: '📖',
    price: 1200,
    originalPrice: 1800,
    rating: 4.7,
    reviews: 198,
    category: 'Intelligence Book',
  },
]

export function RelatedProducts({ category }: { category: string }) {
  const relatedProducts = allProducts.filter(p => p.category === category && p.id !== 1).slice(0, 4)

  return (
    <section className="py-12 md:py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          সম্পর্কিত পণ্য
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {relatedProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                {/* Image */}
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 aspect-square flex items-center justify-center text-5xl hover:opacity-90 transition">
                  {product.image}
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm md:text-base">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-primary text-lg">৳{product.price}</span>
                      <span className="text-xs text-gray-500 line-through">৳{product.originalPrice}</span>
                    </div>
                  </div>

                  {/* Button */}
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm">
                    বিস্তারিত দেখুন
                  </Button>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
