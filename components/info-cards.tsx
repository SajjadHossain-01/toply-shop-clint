'use client'

import { Truck, Star } from 'lucide-react'

// কাস্টম ব্যাংক নোট বা ক্যাশ আইকন lucide-react এ ছবির মতো না থাকায় এটি CSS দিয়ে তৈরি করা হয়েছে
function BanknoteIcon({ className }: { className?: string }) {
  return (
    <div className={`relative w-14 h-8 border-[3px] border-current rounded flex items-center justify-center font-bold text-sm ${className}`}>
      <div className="absolute left-1 top-1 w-1.5 h-1.5 border-b border-r border-current rounded-br-sm"></div>
      <div className="absolute right-1 top-1 w-1.5 h-1.5 border-b border-l border-current rounded-bl-sm"></div>
      <div className="absolute left-1 bottom-1 w-1.5 h-1.5 border-t border-r border-current rounded-tr-sm"></div>
      <div className="absolute right-1 bottom-1 w-1.5 h-1.5 border-t border-l border-current rounded-tl-sm"></div>
      <div className="w-4 h-4 border-2 border-current rounded-full flex items-center justify-center text-[10px]">
        1
      </div>
    </div>
  )
}

// ৪র্থ কার্ডের স্কুটার আইকনটি ছবিতে একটি কাস্টম ইলাস্ট্রেশন, তাই সেটির স্ট্রাকচার এখানে দেওয়া হলো
function DeliveryScooterIcon() {
  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      {/* স্কুটারের ব্যাকগ্রাউন্ড ও ক্যারেক্টার ইলাস্ট্রেশন এর জন্য একটি সুন্দর প্লেসহোল্ডার */}
      <span className="text-6xl select-none">🛵</span>
      <div className="absolute -top-1 -right-1 bg-[#ffb300] text-[9px] text-white font-bold px-1.5 py-0.5 rounded shadow-sm border border-white">
        SHOP
      </div>
    </div>
  )
}

export function InfoCards() {
  return (
    <section className="py-6 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 - Fast Delivery */}
          <div className="border-[2px] border-[#9c27b0] rounded-xl p-5 bg-white flex items-center h-[130px]">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 text-[#e91e63]">
                {/* ছবির মতো ট্রাকের পেছনে স্পিড লাইন যুক্ত করা হয়েছে */}
                <div className="relative flex items-center">
                  <div className="flex flex-col gap-1 mr-1">
                    <div className="w-4 h-1 bg-current rounded-full"></div>
                    <div className="w-5 h-1 bg-current rounded-full"></div>
                    <div className="w-3 h-1 bg-current rounded-full"></div>
                  </div>
                  <Truck className="w-12 h-12" strokeWidth={2.5} />
                </div>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[#e91e63] text-lg leading-tight">Fast Delivery</h3>
                <p className="text-[#008db9] text-[13px] font-medium mt-1 leading-snug">
                  আমরা সারা বাংলাদেশে পণ্য ডেলিভারি করে থাকি
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 - Cash On Delivery */}
          <div className="border-[2px] border-[#9c27b0] rounded-xl p-5 bg-white flex items-center h-[130px]">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 text-[#e91e63]">
                <BanknoteIcon />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[#e91e63] text-lg leading-tight">Cash On Delivery</h3>
                <p className="text-[#008db9] text-[13px] font-medium mt-1 leading-snug">
                  পণ্য হাতে পাওয়ার পরে পেমেন্ট
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 - Customer Reviews */}
          <div className="border-[2px] border-[#9c27b0] rounded-xl p-5 bg-white flex items-center h-[130px]">
            <div className="flex items-center gap-4 w-full">
              <div className="flex-shrink-0 text-[#e91e63]">
                <Star className="w-12 h-12 fill-current" stroke="none" />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-[#008db9] text-lg leading-tight">Customer Reviews</h3>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[#e91e63] text-[13px] font-bold mr-1">Click Here</span>
                  <div className="flex text-[#fbc02d]">
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                    <Star size={14} className="fill-current" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4 - Delivery Boy Illustration */}
          <div className="border-[2px] border-[#9c27b0] rounded-xl p-5 bg-white flex items-center justify-center h-[130px]">
            <DeliveryScooterIcon />
          </div>

        </div>
      </div>
    </section>
  )
}