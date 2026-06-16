'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ShoppingCart, CheckCircle, ArrowRight, Home } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Swal from 'sweetalert2'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useAuth } from '@/context/auth-context'
import useAxiosPublic from '@/hooks/AxiosPublic'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()
  const axiosSecure = useAxiosSecure() // রিকোয়েস্ট সিকিউর রাখার জন্য axiosSecure ব্যবহার করা ভালো
  const { user, isLoading } = useAuth() 
  const isDirect = searchParams.get('direct') === 'true'

  // ফর্ম স্টেটসমূহ
  const [customerName, setCustomerName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [shippingAddress, setShippingAddress] = useState('')
  const [cartItems, setCartItems] = useState<any[]>([])

  // ১. ডাটা লোড করা (কার্ট অথবা ডিরেক্ট বাই)
  useEffect(() => {
    if (isLoading) return; // Auth লোড হওয়া পর্যন্ত অপেক্ষা করবে

    if (isDirect) {
      const directData = localStorage.getItem('direct-checkout')
      if (directData) {
        setCartItems(JSON.parse(directData))
      }
    } else {
      // যদি ইউজার লগইন থাকে, ডাটাবেজ থেকে কার্ট আনবে
      if (user && user?.email) {
        const fetchCart = async () => {
          try {
            const res = await axiosSecure.get('/cart')
            const mappedItems = res.data.map((item: any) => ({
              productId: item.productId || item._id, // আইডি সেফটি চেক
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity
            }))
            setCartItems(mappedItems)
          } catch (err) {
            console.error("Cart fetch failed", err)
          }
        }
        fetchCart()
      } else {
        // গেস্ট ইউজারের জন্য LocalStorage থেকে কার্ট লোড করা
        const localCart = localStorage.getItem('guest_cart')
        if (localCart) {
          setCartItems(JSON.parse(localCart))
        }
      }
    }
  }, [isDirect, user, isLoading, axiosSecure])

  const subtotal = cartItems.reduce((total, item) => total + (Number(item.price) * Number(item.quantity)), 0)
  const shippingCost = 0 
  const totalAmount = subtotal + shippingCost

  // ২. অর্ডার সাবমিট মিউটেশন
  const placeOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await axiosSecure.post('/orders', orderData)
      return response.data
    },
    onSuccess: (data) => {
      // ৪. অর্ডার সফল হলে কার্ট বা ডিরেক্ট ডাটা মুছে ফেলা
      if (isDirect) {
        localStorage.removeItem('direct-checkout')
      } else {
        if (user && user?.email) {
          queryClient.invalidateQueries({ queryKey: ['cart', user?.email] })
        } else {
          localStorage.removeItem('guest_cart') // গেস্ট কার্ট ক্লিয়ার
          queryClient.invalidateQueries({ queryKey: ['cart'] })
        }
      }

      Swal.fire({
        title: "অর্ডার সফল হয়েছে!",
        text: "আপনার অর্ডারটি আমরা গ্রহণ করেছি।",
        icon: "success",
        confirmButtonColor: "#2e7d32"
      }).then(() => {
        const targetId = data.result?.orderId || data.result?.insertedId || 'success';
        router.push(`/checkout/finish?orderId=${encodeURIComponent(targetId)}`)
      })
    },
    onError: (error: any) => {
      Swal.fire({
        title: "দুঃখিত!",
        text: error?.response?.data?.message || "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।",
        icon: "error"
      })
    }
  })

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault()

    if (!customerName || !phoneNumber || !shippingAddress) {
      Swal.fire("সতর্কতা", "দয়া করে সবকটি প্রয়োজনীয় তথ্য পূরণ করুন।", "warning")
      return
    }

    if (cartItems.length === 0) {
      Swal.fire("কার্ট খালি", "কোনো পণ্য ছাড়া অর্ডার করা সম্ভব নয়।", "error")
      return
    }

    const orderData = {
      customerName,
      shippingAddress,
      phoneNumber,
      cartItems,
      totalAmount,
      buyerEmail: user?.email || "guest",
      paymentMethod: "COD",
      paymentStatus: "Pending"
    }

    placeOrderMutation.mutate(orderData)
  }

  return (
    <div className="min-h-screen bg-[#f4f6f8] pb-12 font-sans">
      {/* Top Logo & Banner */}
      <div className="bg-white py-6 text-center shadow-sm">
        <div className="flex justify-center items-center mb-2">
          <span className="text-2xl font-black text-purple-700 flex items-center gap-1">
            🛍️ ToplyShop
          </span>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-[#00a651]">
          অর্ডার করতে সঠিক তথ্য দিয়ে নিচের ফর্মটি পূরণ করুন
        </h1>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm flex items-center justify-center gap-8 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">১</span>
            <span>Cart</span>
          </div>
          <div className="w-12 h-[1px] bg-gray-200"></div>
          <div className="flex items-center gap-2 text-purple-600 font-bold">
            <span className="w-5 h-5 rounded-full bg-purple-100 border border-purple-600 flex items-center justify-center text-xs">২</span>
            <span>Information</span>
          </div>
          <div className="w-12 h-[1px] bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center text-xs">৩</span>
            <span>Finish</span>
          </div>
        </div>

        {/* Dynamic Alert Banner */}
        {cartItems.length > 0 && (
          <div className="bg-white border-l-4 border-emerald-500 rounded-r-xl p-4 mb-6 shadow-sm flex justify-between items-center text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <span>“{cartItems[0]?.name}” has been added to your cart.</span>
            </div>
            <button type="button" onClick={() => router.push('/cart')} className="text-purple-600 font-semibold hover:underline">View cart</button>
          </div>
        )}

        {/* Main Grid Content */}
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Column: Billing Details */}
          <div className="md:col-span-7 bg-white rounded-xl p-6 shadow-sm space-y-6">
            <div>
              <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">Billing details</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="আপনার নাম লিখুন *"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500"
                  required
                />
                <input
                  type="tel"
                  placeholder="আপনার ফোন নম্বর দিন *"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500"
                  required
                />
                <textarea
                  placeholder="আপনার ঠিকানা লিখুন, থানা, জেলা, বাড়ির নাম *"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-purple-500"
                  required
                ></textarea>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-3">Shipping</h2>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 text-sm text-gray-700 flex justify-between items-center">
                <span>ডেলিভারি চার্জ</span>
                <span className="font-bold text-emerald-600">ফ্রি</span>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-3">Payment</h2>
              <div className="border border-purple-200 bg-purple-50/50 rounded-lg overflow-hidden text-sm">
                <div className="p-3 border-b border-purple-100 font-bold text-gray-800 flex items-center gap-2">
                  <input type="radio" checked readOnly className="accent-purple-600" />
                  সম্পূর্ণ ক্যাশ অন ডেলিভারি
                </div>
                <div className="p-3 text-gray-600 text-xs bg-white">
                  প্রোডাক্ট হাতে পেয়ে মূল্য পরিশোধ করুন
                </div>
              </div>
            </div>

            {/* Confirm Submit Button */}
            <button
              type="submit"
              disabled={placeOrderMutation.isPending}
              className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white py-4 rounded-lg font-bold transition flex items-center justify-center gap-2 text-base shadow-md disabled:bg-gray-400"
            >
              👈 {placeOrderMutation.isPending ? "অর্ডার প্রসেস হচ্ছে..." : `অর্ডার কনফার্ম করুন  ${totalAmount} টাকা `}
            </button>
          </div>

          {/* Right Column: Your Order Overview */}
          <div className="md:col-span-5 bg-white rounded-xl p-6 shadow-sm h-fit">
            <h2 className="text-base font-bold text-gray-800 border-b pb-2 mb-4">Your order</h2>

            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="border-b text-gray-500 font-normal">
                  <th className="pb-2 font-normal">Product</th>
                  <th className="pb-2 text-right font-normal">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b text-gray-700">
                    <td className="py-4 flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded border" />
                      <span className="text-xs line-clamp-2 leading-tight">
                        {item.name} <span className="font-bold text-gray-400 ml-1">× {item.quantity}</span>
                      </span>
                    </td>
                    <td className="py-4 text-right font-semibold text-gray-900">
                      {(item.price * item.quantity).toFixed(2)}৳
                    </td>
                  </tr>
                ))}

                <tr className="border-b text-gray-600">
                  <td className="py-3">Subtotal</td>
                  <td className="py-3 text-right font-semibold">{subtotal.toFixed(2)}৳</td>
                </tr>
                <tr className="border-b text-gray-600">
                  <td className="py-3">Shipping</td>
                  <td className="py-3 text-right text-emerald-600 font-medium">ডেলিভারি চার্জ ফ্রি</td>
                </tr>
                <tr className="text-gray-900 font-bold text-base">
                  <td className="pt-4">Total</td>
                  <td className="pt-4 text-right text-purple-700">{totalAmount.toFixed(2)}৳</td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>

        {/* Back To Home Footer Button */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 transition shadow-sm"
          >
            Back To Home <Home size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-500">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}