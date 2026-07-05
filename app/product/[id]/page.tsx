'use client'

import { useEffect, useState } from 'react'
import { Star, ShoppingCart, Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RelatedProducts } from '@/components/related-products'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import Swal from 'sweetalert2'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useAuth } from '@/context/auth-context'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure()
  const { user } = useAuth()

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [mainImage, setMainImage] = useState('')
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' })

  // ১. রিয়্যাক্ট কুয়েরি হুক
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${params.id}`)
      return response.data?.data || response.data 
    },
    enabled: !!params.id,
  })

  // ২. প্রোডাক্ট ডাটা লোড বা পরিবর্তন হওয়ার সাথে সাথে মেইন ইমেজ সেট করা
  useEffect(() => {
    if (product) {
      const defaultImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
      setMainImage(defaultImage || 'https://placehold.co/600x600?text=No+Image')
    }
  }, [product])

  // 💡 সমাধান: ইনফিনিট লুপ এড়াতে স্টেট ছাড়া সরাসরি বডিতে ভেরিয়েবল ডিক্লেয়ার করা হলো
  // প্রোডাক্টের কোড না থাকলে ডিফল্ট হিসেবে "Umm2uqK6Mbs" কোডটি বসবে
  const youtubeVideoCode = product?.youtubeCode && product.youtubeCode.trim() !== "" 
    ? product.youtubeCode 
    : "Umm2uqK6Mbs";

  // ৩. কার্টে যোগ করার মিউটেশন
  const addToCartMutation = useMutation({
    mutationFn: async (cartItem: any) => {
      const response = await axiosSecure.post('/cart', cartItem)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user?.email] })
      Swal.fire({
        title: "সফল হয়েছে!",
        text: "পণ্যটি আপনার কার্টে যোগ করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ঠিক আছে"
      })
    },
    onError: (error: any) => {
      Swal.fire({
        title: "দুঃখিত!",
        text: error?.response?.data?.message || "আবার চেষ্টা করুন।",
        icon: "error"
      })
    }
  })

  const handleAddToCart = () => {
    if (!product) return

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.offerPrice || product.price,
      image: mainImage,
      quantity: quantity,
      email: user?.email || null
    }

    if (user?.email) {
      addToCartMutation.mutate(cartItem)
    } else {
      try {
        const localCart = localStorage.getItem("guest_cart")
        const cartList = localCart ? JSON.parse(localCart) : []

        const existingProductIndex = cartList.findIndex((item: any) => item.productId === product._id)

        if (existingProductIndex > -1) {
          cartList[existingProductIndex].quantity += quantity
        } else {
          cartList.push(cartItem)
        }

        localStorage.setItem("guest_cart", JSON.stringify(cartList))
        queryClient.invalidateQueries({ queryKey: ['cart'] })

        Swal.fire({
          title: "সফল হয়েছে!",
          text: "পণ্যটি আপনার লোকাল কার্টে যোগ করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ঠিক আছে"
        })
      } catch (error) {
        console.error("Local cart error:", error)
        Swal.fire({
          title: "দুঃখিত!",
          text: "কার্টে যোগ করতে সমস্যা হয়েছে।",
          icon: "error"
        })
      }
    }
  }

  const handleBuyNow = () => {
    if (!product) return

    const directCheckoutItem = [{
      productId: product._id,
      name: product.name,
      price: product.offerPrice || product.price,
      image: mainImage,
      quantity: quantity
    }]

    localStorage.setItem('direct-checkout', JSON.stringify(directCheckoutItem))
    router.push('/checkout?direct=true')
  }

  // মাউস জুম ফাংশনসমূহ
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - left) / width) * 100
    const y = ((e.clientY - top) / height) * 100
    setZoomStyle({ display: 'block', backgroundPosition: `${x}% ${y}%` })
  }

  const handleMouseLeave = () => {
    setZoomStyle({ display: 'none', backgroundPosition: '0% 0%' })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <p className="text-gray-500 font-medium">পণ্যের বিবরণ লোড হচ্ছে...</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="text-center py-20 text-red-600 font-medium">
        দুঃখিত! পণ্যটির বিবরণ খুঁজে পাওয়া যায়নি।
      </div>
    )
  }

  const originalPrice = product.price || 0
  const currentPrice = product.offerPrice || product.price || 0
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0

  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image || product.images].filter(Boolean)

  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-sm text-gray-600">
            <a href="/" className="hover:text-primary">হোম</a> /
            <a href="#" className="hover:text-primary ml-2">বই</a> /
            <span className="ml-2 text-gray-900">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div 
              className="relative bg-gray-50 rounded-2xl aspect-square flex items-center justify-center mb-4 border border-gray-100 shadow-sm overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage || 'https://placehold.co/600x600?text=No+Image'}
                alt={product.name}
                className="w-full h-full object-contain"
              />
              <div
                className="absolute inset-0 pointer-events-none transition-shadow duration-200"
                style={{
                  ...zoomStyle,
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: '220%',
                  backgroundRepeat: 'no-repeat',
                }}
              />
            </div>

            {/* থাম্বনেইল ইমেজ লুপ */}
            <div className="grid grid-cols-5 gap-2">
              {productImages.map((imgUrl: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setMainImage(imgUrl)}
                  className={`bg-gray-50 rounded-xl aspect-square flex items-center justify-center cursor-pointer transition border-2 overflow-hidden p-1 ${mainImage === imgUrl ? 'border-amber-500 scale-95' : 'border-transparent hover:border-gray-300'}`}
                >
                  <img
                    src={imgUrl}
                    alt={`thumbnail-${index}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={i < Math.floor(product.ratings?.average || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  />
                ))}
              </div>
              <span className="text-gray-600">({product.ratings?.count || 128} reviews)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-3xl font-bold text-primary">৳{currentPrice}</span>
                {discount > 0 && (
                  <>
                    <span className="text-lg text-gray-500 line-through">৳{originalPrice}</span>
                    <span className="bg-primary text-white px-3 py-1 rounded text-sm font-bold">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm">
                विशेष ছাড় वर्तमान মূল্যে পাওয়া যাচ্ছে এই পণ্য
              </p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-gray-700 font-semibold">পরিমাণ:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="px-4 py-2 border-l border-r border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={addToCartMutation.isPending}
                  className="bg-primary hover:bg-primary/90 text-white py-6 text-base font-semibold"
                >
                  <ShoppingCart className="mr-2" size={20} />
                  {addToCartMutation.isPending ? "যোগ হচ্ছে..." : "কার্টে যোগ করুন"}
                </Button>

                <Button
                  onClick={handleBuyNow}
                  className="bg-amber-600 hover:bg-amber-700 text-white py-6 text-base font-semibold"
                >
                  দ্রুত কিনুন
                </Button>
              </div>

              {/* Support Call action items */}
              <div className="space-y-2.5">
                <a
                  href="tel:01970467192"
                  className="w-full bg-[#007a33] hover:bg-[#006328] text-white py-3.5 px-6 rounded-lg text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <Phone size={18} /> Call Now
                </a>
                <a
                  href="https://wa.me/8801970467192"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[#25d366] hover:bg-[#1ebe57] text-white py-3.5 px-6 rounded-lg text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> হোয়াটসঅ্যাপ
                </a>
              </div>
            </div>

            {/* Youtube Video Section */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-lg group border border-gray-200 mt-6">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${youtubeVideoCode}?rel=0&modestbranding=1&autoplay=0`}
                title="Main Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mb-12 border-t border-gray-200 pt-8">
          <div className="flex gap-8 border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 font-semibold transition ${activeTab === 'description' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              বিবরণ
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-semibold transition ${activeTab === 'reviews' ? 'text-primary border-b-2 border-primary' : 'text-gray-600 hover:text-gray-900'}`}
            >
              পর্যালোচনা ({product.ratings?.count || 0})
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <h3 className="font-semibold text-gray-900 mb-3">পণ্য বিবরণ:</h3>
              <ul className="list-disc pl-5 space-y-2">
                {Array.isArray(product.details) && product.details.map((detail: string, index: number) => (
                  <li key={index} className="text-gray-700">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reviews tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-4 text-gray-700">
              <p className="text-lg font-semibold mb-4">গ্রাহক পর্যালোচনা</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="font-semibold">চমৎকার পণ্য!</span>
                </div>
                <p className="text-sm text-gray-600">এটি আমার প্রত্যাশা ছাড়িয়ে গেছে। পণ্যের গুণমান অসাধারণ এবং ডেলিভারি খুবই দ্রুত ছিল।</p>
                <p className="text-xs text-gray-500 mt-2">- রহিম আহমেদ</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <RelatedProducts productId={product._id} />
      <Footer />
    </main>
  )
}