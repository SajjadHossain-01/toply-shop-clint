'use client'

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Filter } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import useAxiosPublic from '@/hooks/AxiosPublic'
import { ProductCard, Product } from '@/components/ProductCard' // পাথটি আপনার প্রোজেক্ট অনুযায়ী চেক করুন

export default function ShopPage() {
  const axiosPublic = useAxiosPublic()
  
  // Filter & Pagination States
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [sortBy, setSortBy] = useState('new')
  const [showFilters, setShowFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 9 

  // সার্চ ডিবউন্স হ্যান্ডলার
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // ১. ডাইনামিক ক্যাটাগরি ফেচ করা
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axiosPublic.get('/categories')
      return response.data 
    }
  })

  const categories = categoriesData ? ['all', ...categoriesData] : ['all']

  // ২. প্রোডাক্ট ডেটা ফেচ করা
  const { data, isLoading } = useQuery({
    queryKey: ['products', debouncedSearch, selectedCategory, priceRange[1], sortBy, currentPage],
    queryFn: async () => {
      const response = await axiosPublic.get('/products', {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: debouncedSearch,
          category: selectedCategory === 'all' ? '' : selectedCategory,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          sort: sortBy
        }
      })
      return response.data
    },
    placeholderData: (previousData) => previousData
  })

  const products: Product[] = data?.products || []
  const totalPages = data?.totalPages || 1

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-gray-600 hover:text-primary">হোম</Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">দোকান</span>
          </div>
        </div>
      </div>

      {/* Shop Header */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">আমাদের দোকান</h1>
          <p className="text-gray-600">সমস্ত পণ্য একটি স্থানে - আপনার পছন্দের জিনিস খুঁজে পান</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Filters */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-20">
              <div className="flex items-center justify-between mb-6 lg:hidden">
                <h2 className="text-lg font-bold text-gray-900">ফিল্টার</h2>
                <button onClick={() => setShowFilters(false)} className="text-gray-500 hover:text-gray-800">✕</button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-900 mb-2">খোঁজ করুন</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="পণ্য খুঁজুন..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">ক্যাটাগরি</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={cat}
                        checked={selectedCategory === cat}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setCurrentPage(1)
                        }}
                        className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-primary transition capitalize">
                        {cat === 'all' ? 'সব' : cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">সর্বোচ্চ মূল্য: ৳{priceRange[1].toLocaleString()}</h3>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => {
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                      setCurrentPage(1)
                    }}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>৳{priceRange[0]}</span>
                    <span>৳10,000</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <Filter size={20} />
                </button>
                <span className="text-gray-600 text-sm font-medium">
                  {data?.totalProducts || 0} টি পণ্য পাওয়া গেছে
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm bg-white"
                >
                  <option value="new">সর্বশেষ</option>
                  <option value="price-asc">মূল্য: কম থেকে বেশি</option>
                  <option value="price-desc">মূল্য: বেশি থেকে কম</option>
                  <option value="rating">সর্বোচ্চ রেটিং</option>
                </select>
              </div>
            </div>

            {/* Products Grid Area */}
            {isLoading ? (
              <div className="text-center py-20 font-medium text-muted-foreground animate-pulse">
                পণ্য লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map(product => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
                    >
                      পূর্ববর্তী
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-3.5 py-2 text-sm rounded-lg transition font-semibold ${
                          currentPage === i + 1
                            ? 'bg-primary text-white'
                            : 'border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium"
                    >
                      পরবর্তী
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20 border border-dashed rounded-xl bg-muted/20">
                <p className="text-muted-foreground text-lg font-medium">কোনো পণ্য পাওয়া যায়নি!</p>
              </div>
            )}
          </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}