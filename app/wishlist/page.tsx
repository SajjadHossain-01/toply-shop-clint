'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import Swal from 'sweetalert2'
import { useAuth } from '@/context/auth-context'
import { useQueryClient } from '@tanstack/react-query'

// ProductCard এর শুধু টাইপটি সরাসরি ইম্পোর্ট করছি
import { type Product } from '@/components/ProductCard'

// ১. এখানে next/dynamic ব্যবহার করে ProductCard ইম্পোর্ট করা হলো।
// এর ফলে CSS ফাইলটি সময়ের আগে লোড হয়ে ব্রাউজারে ওয়ার্নিং দেবে না।
import dynamic from 'next/dynamic'
import usewishlist from '@/hooks/useWishlish'
const ProductCard = dynamic(
  () => import('@/components/ProductCard').then((mod) => mod.ProductCard),
  { ssr: false }
)

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [wishlistItems, setWishlistItems] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const axiosSecure = useAxiosSecure()
  const [wishlist, refetch] = usewishlist()

  // ডাটা লোড করা (ডাটাবেজ অথবা লোকাল স্টোরেজ)
  useEffect(() => {
    if (authLoading) return

    async function fetchWishlist() {
      try {
        if (user && user?.email) {

          setWishlistItems(wishlist)

        } else {
          // গেস্ট ইউজার হলে লোকাল স্টোরেজ থেকে আনবে
          const localWishlist = localStorage.getItem('guest_wishlist')
          if (localWishlist) {
            setWishlistItems(JSON.parse(localWishlist))
          } else {
            setWishlistItems([])
          }
        }
      } catch (err) {
        console.error("Failed to load wishlist items", err)
      } finally {
        setLoading(false)
      }
    }

    fetchWishlist()
  }, [user, authLoading, axiosSecure,wishlist.length])

  // উইশলিস্ট থেকে আইটেম রিমুভ হ্যান্ডলার
  const removeFromWishlist = (id: string) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি আপনার উইশলিস্ট থেকে মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, সরিয়ে ফেলুন!",
      cancelButtonText: "বাতিল"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user && user?.email) {
          try {
            await axiosSecure.delete(`/wishlist/${id}`)
              .then((res) => {
                if (res.data.deletedCount > 0) {
                  refetch();
                  Swal.fire({
                    title: "Deleted!",
                    text: "উইশলিস্ট থেকে ডিলিট করা হয়েছে",
                    icon: "success",
                  });
                }
              });

          } catch (err) {
            Swal.fire("দুঃখিত!", "উইশলিস্ট থেকে ডিলিট করা যায়নি।", "error")
          }
        } else {
          // লোকাল স্টোরেজ থেকে রিমুভ
          const localWishlist = localStorage.getItem('guest_wishlist')
          if (localWishlist) {
            const parsedWishlist = JSON.parse(localWishlist)
            const filteredWishlist = parsedWishlist.filter((item: Product) => item._id !== id)

            localStorage.setItem('guest_wishlist', JSON.stringify(filteredWishlist))
            setWishlistItems(filteredWishlist)

            // গ্লোবাল কুয়েরি কি ইনভ্যালিডেট করা
            queryClient.invalidateQueries({ queryKey: ['wishlist'] })
            Swal.fire("সরানো হয়েছে!", "পণ্যটি লোকাল উইশলিস্ট থেকে সরানো হয়েছে。", "success")
          }
        }
      }
    })
  }



  // লোডিং অবস্থা হ্যান্ডেল করা
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex justify-center items-center">
          <p className="text-lg font-medium text-muted-foreground animate-pulse">লোড হচ্ছে...</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">Wishlist</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Wishlist</h1>
          <p className="text-muted-foreground mb-8">{wishlistItems.length} items in your wishlist</p>

          {/* উইশলিস্ট খালি থাকলে */}
          {wishlistItems.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-gray-100 shadow-sm max-w-xl mx-auto mt-8">
              <div className="text-6xl mb-4">❤️</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                আপনার উইশলিস্ট খালি
              </h2>
              <p className="text-gray-600 mb-6">
                পন্দের পণ্যগুলো পরবর্তীতে সহজে খুঁজে পেতে উইশলিস্টে যুক্ত করুন
              </p>
              <Link
                href="/shop"
                className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg font-bold hover:bg-purple-800 transition"
              >
                পণ্যগুলো এক্সপ্লোর করুন
              </Link>
            </div>
          ) : (
            /* উইশলিস্টে পণ্য থাকলে গ্রিড ভিউ */
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistItems.map((product: Product) => {
                  if (!product) return null

                  return (
                    <div key={product._id} className="relative group">
                      {/* Product Card রেন্ডার করা */}
                      <ProductCard product={product} />

                      {/* উইশলিস্ট থেকে ডিলিট করার বাটন */}
                      <button
                        onClick={() => removeFromWishlist(product._id)}
                        className="absolute top-3 right-3 h-9 w-9 bg-red-50 text-red-600 pb-.5 text-xl font-extrabold rounded-full border border-red-200 shadow-md hover:bg-red-100 transition z-10"
                        title="উইশলিস্ট থেকে মুছুন"
                      >
                        ✕
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Continue Shopping */}
              <div className="mt-12 text-center">
                <Link
                  href="/shop"
                  className="text-purple-700 hover:text-purple-900 font-semibold transition"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}