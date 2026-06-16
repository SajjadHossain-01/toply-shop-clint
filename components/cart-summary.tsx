'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface CartSummaryProps {
  subtotal: number
  shipping: number
  tax: number
  total: number
  itemCount: number
}

export function CartSummary({
  subtotal = 0,
  shipping = 0,
  tax = 0,
  total = 0,
  itemCount = 0,
}: CartSummaryProps) {
  
  // কার্ট খালি থাকলে বাটন ডিজেবল করার জন্য কন্ডিশন
  const isCartEmpty = itemCount === 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-6">অর্ডার সারাংশ</h2>

      {/* Summary Details */}
      <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
        {/* Items Count */}
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600">{itemCount} পণ্য</span>
          <span className="font-semibold text-gray-900">
            ৳{(subtotal || 0).toLocaleString('bn-BD')}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm md:text-base">
          <div className="text-gray-600">
            ডেলিভারি চার্জ
            {shipping === 0 && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                বিনামূল্যে
              </span>
            )}
          </div>
          <span className="font-semibold text-gray-900">
            {shipping === 0 ? 'বিনামূল্যে' : `৳${(shipping || 0).toLocaleString('bn-BD')}`}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between text-sm md:text-base">
          <span className="text-gray-600">ট্যাক্স (৫%)</span>
          <span className="font-semibold text-gray-900">
            ৳{(tax || 0).toLocaleString('bn-BD')}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="flex justify-between mb-6">
        <span className="text-lg md:text-xl font-bold text-gray-900">মোট</span>
        <span className="text-2xl md:text-3xl font-bold text-purple-700">
          ৳{(total || 0).toLocaleString('bn-BD')}
        </span>
      </div>

      {/* Checkout Button */}
      {isCartEmpty ? (
        <button 
          disabled
          className="w-full bg-gray-300 text-gray-500 py-3 rounded-lg font-semibold cursor-not-allowed flex items-center justify-center gap-2 mb-4"
        >
          চেকআউট করুন
          <ArrowRight size={20} />
        </button>
      ) : (
        <Link href="/checkout">
          <button className="w-full bg-[#388e3c] hover:bg-[#2e7d32] text-white py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 mb-4 shadow-sm">
            চেকআউট করুন
            <ArrowRight size={20} />
          </button>
        </Link>
      )}

      {/* Continue Shopping */}
      <Link href="/">
        <button className="w-full bg-white border-2 border-purple-700 text-purple-700 py-3 rounded-lg font-semibold hover:bg-purple-50 transition flex items-center justify-center gap-2">
          <ArrowLeft size={20} />
          কেনাকাটা চালিয়ে যান
        </button>
      </Link>

      {/* Offers Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4">विशेष অফার</h3>
        
        <div className="space-y-3">
          <div className="bg-green-50 border border-green-200 rounded p-3">
            <p className="text-sm text-green-700">
              ✓ ১০০০ টাকার বেশি কিনুন এবং বিনামূল্যে ডেলিভারি পান
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-700">
              ✓ ক্যাশ অন ডেলিভারি সুবিধা উপলব্ধ
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded p-3">
            <p className="text-sm text-purple-700">
              ✓ ৭ দিনের মানি-ব্যাক গ্যারান্টি
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}