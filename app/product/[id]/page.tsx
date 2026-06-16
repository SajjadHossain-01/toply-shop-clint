'use client'

import { useEffect, useState } from 'react'
import { Star, ShoppingCart, Phone, MessageCircle, PhoneCall, FacebookIcon, YoutubeIcon, InstagramIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RelatedProducts } from '@/components/related-products'
import { useParams, useRouter } from 'next/navigation' // useRouter যুক্ত করা হয়েছে
import useAxiosPublic from '@/hooks/AxiosPublic'
// import useAxiosSecure from '@/hooks/AxiosSecure' // যদি টোকেন ওয়ালা সিকিউর হুক থাকে তবে এটি অন করুন
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query' // Mutation ও QueryClient যুক্ত হয়েছে
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import Swal from 'sweetalert2' // অ্যালার্ট দেখানোর জন্য SweetAlert2 ব্যবহার করা বেস্ট
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useAuth } from '@/context/auth-context'

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure() // সিকিউর হুকের জন্য
  const { user } = useAuth();

  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState('description')
  const [mainImage, setMainImage] = useState('')
  const [zoomStyle, setZoomStyle] = useState({ display: 'none', backgroundPosition: '0% 0%' })

  // ১. রিয়্যাক্ট কুয়েরি হুক (প্রোডাক্ট ডাটা ফেচ)
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', params.id],
    queryFn: async () => {
      const response = await axiosSecure.get(`/products/${params.id}`)
      return response.data
    },
    enabled: !!params.id,
  })

  // ২. প্রোডাক্ট লোড হওয়ার পর প্রথম ইমেজ সেট করা
  useEffect(() => {
    if (product) {
      const defaultImage = product.images && product.images.length > 0 ? product.images[0] : product.image;
      setMainImage(defaultImage || '📦')
    }
  }, [product])



  // ৩. কার্টে যোগ করার মিউটেশন (Add to Cart Mutation)
  const addToCartMutation = useMutation({
    mutationFn: async (cartItem: any) => {
      // এই মিউটেশনটি শুধু লগইন করা ইউজারদের জন্য সার্ভারে রিকোয়েস্ট পাঠাবে
      const response = await axiosSecure.post('/cart', cartItem);
      return response.data;
    },
    onSuccess: () => {
      // কার্টের গ্লোবাল স্টেট বা কাউন্ট রি-ফেচ করার জন্য
      queryClient.invalidateQueries({ queryKey: ['cart', user?.email] });

      Swal.fire({
        title: "সফল হয়েছে!",
        text: "পণ্যটি আপনার কার্টে যোগ করা হয়েছে।",
        icon: "success",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ঠিক আছে"
      });
    },
    onError: (error: any) => {
      Swal.fire({
        title: "দুঃখিত!",
        text: error?.response?.data?.message || "আবার চেষ্টা করুন।",
        icon: "error"
      });
    }
  });

  // কার্ট বাটনে ক্লিকের হ্যান্ডলার
  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      productId: product._id,
      name: product.name,
      price: product.offerPrice || product.price,
      image: mainImage,
      quantity: quantity,
      email: user?.email || null
    };

    if (user && user?.email) {
      addToCartMutation.mutate(cartItem);
    } else {
      try {
        const localCart = localStorage.getItem("guest_cart");
        const cartList = localCart ? JSON.parse(localCart) : [];

        const existingProductIndex = cartList.findIndex(
          (item: any) => item.productId === product._id
        );

        if (existingProductIndex > -1) {
          cartList[existingProductIndex].quantity += quantity;
        } else {
          cartList.push(cartItem);
        }

        localStorage.setItem("guest_cart", JSON.stringify(cartList));

       
        queryClient.invalidateQueries({ queryKey: ['cart'] });

        Swal.fire({
          title: "সফল হয়েছে!",
          text: "পণ্যটি আপনার লোকাল কার্টে যোগ করা হয়েছে।",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ঠিক আছে"
        });
      } catch (error) {
        console.error("Local cart error:", error);
        Swal.fire({
          title: "দুঃখিত!",
          text: "কার্টে যোগ করতে সমস্যা হয়েছে।",
          icon: "error"
        });
      }
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    // কার্ট আইটেমের ডাটা রেডি করা
    const directCheckoutItem = [{
      productId: product._id,
      name: product.name,
      price: product.offerPrice || product.price,
      image: mainImage,
      quantity: quantity
    }];

    // লোকাল স্টোরেজে সাময়িক সেভ করে ইউজারকে সরাসরি চেকআউট বা অর্ডার পেইজে পাঠিয়ে দেওয়া
    localStorage.setItem('direct-checkout', JSON.stringify(directCheckoutItem));

    // আপনার চেকআউট/অর্ডার পেইজের রাউটে পাঠিয়ে দিন
    router.push('/checkout?direct=true');
  };


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
    return <div className="text-center py-20 font-medium text-gray-600">পণ্যের বিবরণ লোড হচ্ছে...</div>
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
  const discount = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0

  const productImages = product?.images && product.images.length > 0
    ? product.images
    : [product?.image].filter(Boolean);

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
            <div className="relative bg-gray-50 rounded-2xl aspect-square flex items-center justify-center mb-4 border border-gray-100 shadow-sm overflow-hidden cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <img
                src={mainImage || 'https://placehold.co/600x600?text=No+Image'}
                alt={product?.name}
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
                विशेष ছাড় वर्तमान मूल্যে পাওয়া যাচ্ছে এই পণ্য
              </p>
            </div>

            <p className="text-gray-700 mb-6 leading-relaxed">
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

            {/* Action Buttons (ফাংশন কল সহ আপডেট করা হয়েছে) */}
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
                  className="w-full bg-[#25d366] hover:bg-[#1ebe57] text-white py-3.5 px-6 rounded-lg text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> হোয়াটসঅ্যাপ
                </a>
                <a
                  href="https://m.me/toplyshop"
                  className="w-full bg-[#0084ff] hover:bg-[#0072dd] text-white py-3.5 px-6 rounded-lg text-base font-bold shadow-sm transition flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} /> ম্যাসেঞ্জার
                </a>
              </div>
            </div>

            {/* Social channels section */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <p className="text-gray-800 font-bold text-sm mb-3 flex items-center justify-center gap-1 bg-gray-50 py-2 rounded-lg border border-gray-200">
                সকল প্রোডাক্টের ভিডিও দেখতে টপলিশপের সোশ্যাল মিডিয়ায় যুক্ত হোন 👇
              </p>
              <div className="flex items-center justify-center gap-3">
                <a href="#" className="w-10 h-10 bg-[#3b5998] text-white rounded-full flex items-center justify-center hover:scale-110 transition"><FacebookIcon size={18} /></a>
                <a href="#" className="w-10 h-10 bg-[#ff0000] text-white rounded-full flex items-center justify-center hover:scale-110 transition"><YoutubeIcon size={18} /></a>
                <a href="#" className="w-10 h-10 bg-[#e1306c] text-white rounded-full flex items-center justify-center hover:scale-110 transition"><InstagramIcon size={18} /></a>
                <a href="#" className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:scale-110 transition"><span className="font-extrabold text-sm">🎵</span></a>
              </div>
            </div>

            {/* Youtube Preview Component */}
            <div className="relative bg-gray-900 rounded-xl overflow-hidden aspect-video shadow-lg group border border-gray-200">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/P2ErRqg2Ea8?rel=0&modestbranding=1&autoplay=0`}
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
              <ul className="space-y-2">
                {product.details?.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>{detail}</span>
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

      <RelatedProducts category={product.category} />
      <Footer />
    </main>
  )
}