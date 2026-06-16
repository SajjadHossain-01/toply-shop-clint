'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { CartItems } from '@/components/cart-items'
import { CartSummary } from '@/components/cart-summary'
import useCart from '@/hooks/useCart'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import Swal from 'sweetalert2'
import { useAuth } from '@/context/auth-context'
import { useQueryClient } from '@tanstack/react-query'

export interface CartItem {
  id: string | number
  title: string
  price: number
  originalPrice?: number 
  quantity: number
  image: string
  rating?: number        
}

export default function CartPage() {
  const [cart, refetch] = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const axiosSecure = useAxiosSecure()

  // ১. ডাটা লোড করা (ডাটাবেজ অথবা লোকাল স্টোরেজ)
  useEffect(() => {
    if (authLoading) return; // অথেনটিকেশন লোড হওয়া পর্যন্ত ওয়েট করবে

    if (user && user?.email) {
      // লগইন করা ইউজার হলে কুয়েরি ডাটা ফরম্যাট করবে
      if (cart && Array.isArray(cart)) {
        const formattedCart = cart.map((item: any) => ({
          id: item._id || item.productId || item.id,
          title: item.name || item.title,
          price: Number(item.price),
          originalPrice: Number(item.originalPrice || item.price),
          quantity: Number(item.quantity || 1),
          image: item.image,
          rating: item.rating || 0,
        }))
        setCartItems(formattedCart)
      }
    } else {
      // গেস্ট ইউজার হলে লোকাল স্টোরেজ থেকে আনবে
      const localCart = localStorage.getItem('guest_cart')
      if (localCart) {
        const parsedCart = JSON.parse(localCart).map((item: any) => ({
          id: item.productId || item.id || item._id,
          title: item.name || item.title,
          price: Number(item.price),
          originalPrice: Number(item.originalPrice || item.price),
          quantity: Number(item.quantity || 1),
          image: item.image,
          rating: item.rating || 0,
        }))
        setCartItems(parsedCart)
      } else {
        setCartItems([])
      }
    }
  }, [cart, user, authLoading])

  // ২. কোয়ান্টিটি আপডেট হ্যান্ডলার
  const updateQuantity = async (id: string | number, quantity: number) => {
    if (quantity === 0) {
      removeItem(id)
      return
    }

    if (user && user?.email) {
      // লগইন ইউজারের জন্য ব্যাকএন্ডে আপডেট (যদি আপনার পুট/প্যাচ রুট থাকে)
      try {
        // এখানে আপনার ব্যাকএন্ডের এপিআই স্ট্রাকচার অনুযায়ী ইউআরএল চুজ করবেন
        // আপাতত লোকাল স্টেট আপডেট করে দিচ্ছি, রিফ্রেশে ডাটাবেজ ধরে রাখতে চাইলে ব্যাকএন্ডে পুশ করতে পারেন
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
        
        // ব্যাকএন্ড আপডেট এক্সাম্পল (ঐচ্ছিক):
        // await axiosSecure.patch(`/cart/${id}`, { quantity })
        // refetch()
      } catch (err) {
        console.error("Failed to update quantity on backend", err)
      }
    } else {
      // গেস্ট ইউজারের জন্য লোকাল স্টোরেজ আপডেট
      const localCart = localStorage.getItem('guest_cart')
      if (localCart) {
        const parsedCart = JSON.parse(localCart)
        const updatedCart = parsedCart.map((item: any) => {
          const itemId = item.productId || item.id || item._id
          if (itemId === id) {
            return { ...item, quantity }
          }
          return item
        })
        localStorage.setItem('guest_cart', JSON.stringify(updatedCart))
        // লোকাল স্টেট ও গ্লোবাল কুয়েরি কি আপডেট করা যেন নেভবার কাউন্ট চেঞ্জ হয়
        setCartItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item))
        queryClient.invalidateQueries({ queryKey: ['cart'] })
      }
    }
  }

  // ৩. আইটেম রিমুভ হ্যান্ডলার
  const removeItem = (id: string | number) => {
    Swal.fire({
      title: "আপনি কি নিশ্চিত?",
      text: "এটি কার্ট থেকে সম্পূর্ণ মুছে যাবে!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "হ্যাঁ, ডিলিট করুন!",
      cancelButtonText: "বাতিল"
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (user && user?.email) {
          // ডাটাবেজ থেকে রিমুভ
          try {
            await axiosSecure.delete(`/cart/${id}`)
            refetch()
            Swal.fire("ডিলিট হয়েছে!", "পণ্যটি কার্ট থেকে সরানো হয়েছে।", "success")
          } catch (err) {
            Swal.fire("দুঃখিত!", "ডিলিট করা যায়নি।", "error")
          }
        } else {
          // লোকাল স্টোরেজ থেকে রিমুভ
          const localCart = localStorage.getItem('guest_cart')
          if (localCart) {
            const parsedCart = JSON.parse(localCart)
            const filteredCart = parsedCart.filter((item: any) => {
              const itemId = item.productId || item.id || item._id
              return itemId !== id
            })
            localStorage.setItem('guest_cart', JSON.stringify(filteredCart))
            setCartItems(filteredCart)
            queryClient.invalidateQueries({ queryKey: ['cart'] })
            Swal.fire("ডিলিট হয়েছে!", "পণ্যটি লোকাল কার্ট থেকে সরানো হয়েছে।", "success")
          }
        }
      }
    })
  }

  // ৪. হিসাব-নিকাশ
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price * item.quantity),
    0
  )
  const shipping = cartItems.length > 0 ? (subtotal > 1000 ? 0 : 60) : 0 // আপনার লজিক অনুযায়ী (ফ্রি ডেলিভারি থাকলে ০ করে দিতে পারেন)
  const tax = 0 // ট্যাক্স না থাকলে ০ রাখুন বা প্রয়োজনীয় হিসাব দিন
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            আপনার কার্ট
          </h1>

          {cartItems.length === 0 ? (
            <div className="bg-white rounded-lg p-12 text-center shadow-sm">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                আপনার কার্ট খালি
              </h2>
              <p className="text-gray-600 mb-6">
                কেনাকাটা শুরু করতে নীচের বোতামে ক্লিক করুন
              </p>
              <a
                href="/shop"
                className="inline-block bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition"
              >
                কেনাকাটা চালিয়ে যান
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items List */}
              <div className="lg:col-span-2">
                <CartItems
                  items={cartItems}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary
                  subtotal={subtotal}
                  shipping={shipping}
                  tax={tax}
                  total={total}
                  itemCount={cartItems.length}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}