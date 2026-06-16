'use client'

import Image from 'next/image'

export function Footer() {
  return (
    <footer className="bg-[#e3f9ff] text-black py-12 select-none border-t border-cyan-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start">
          
          {/* Column 1 - Registered & Follow Us */}
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-xl font-bold mb-4 tracking-wide text-gray-900">Registered by:</h4>
              <div className="relative w-24 h-24">
                <Image
                  src="/barishal-city-logo.png" // বরিশাল সিটি কর্পোরেশনের লোগো পাথ এখানে দিন
                  alt="Barishal City Corporation"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            
            <div>
              <h4 className="text-2xl font-bold mb-4 tracking-wide text-gray-900">Follow Us</h4>
              {/* ছবির মতো কাস্টম ব্র্যান্ড কালারের সোশ্যাল আইকন সেট */}
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 bg-[#1877f2] text-white rounded-full flex items-center justify-center hover:opacity-90 transition shadow-xs text-xl font-bold">
                  f
                </a>
                <a href="#" className="w-10 h-10 bg-[#e1306c] text-white rounded-full flex items-center justify-center hover:opacity-90 transition shadow-xs text-lg font-bold">
                  📸
                </a>
                <a href="#" className="w-10 h-10 bg-[#bd081c] text-white rounded-full flex items-center justify-center hover:opacity-90 transition shadow-xs text-lg font-bold">
                  📌
                </a>
                <a href="#" className="w-10 h-10 bg-[#cd201f] text-white rounded-full flex items-center justify-center hover:opacity-90 transition shadow-xs text-lg font-bold">
                  ▶
                </a>
                <a href="#" className="w-10 h-10 bg-[#121212] text-white rounded-full flex items-center justify-center hover:opacity-90 transition shadow-xs text-sm font-bold">
                  d
                </a>
              </div>
            </div>
          </div>

          {/* Column 2 - Popular Links */}
          <div>
            <h4 className="text-2xl font-bold mb-5 tracking-wide text-gray-900">Popular Link</h4>
            <ul className="space-y-3 text-[17px] font-medium text-gray-800">
              <li><a href="#" className="hover:text-[#9c27b0] transition">Baby Books</a></li>
              <li><a href="#" className="hover:text-[#9c27b0] transition">Shop Now</a></li>
              <li><a href="#" className="hover:text-[#9c27b0] transition">My Account</a></li>
              <li><a href="#" className="hover:text-[#9c27b0] transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-[#9c27b0] transition">Terms & Condition</a></li>
              <li><a href="#" className="hover:text-[#9c27b0] transition">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 3 - Contact Info */}
          <div>
            <h4 className="text-2xl font-bold mb-5 tracking-wide text-gray-900">Conntact Info</h4>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#9c27b0] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-lg">
                  📍
                </div>
                <div>
                  <h5 className="font-bold text-lg text-gray-900 leading-none mb-1">Location</h5>
                  <p className="text-gray-700 text-sm font-medium">Dhaka, Bangladesh</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#9c27b0] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-lg">
                  📞
                </div>
                <div>
                  <h5 className="font-bold text-lg text-gray-900 leading-none mb-1">Phone</h5>
                  <p className="text-gray-700 text-sm font-medium tracking-wide">01970467192</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#9c27b0] text-white rounded-full flex items-center justify-center shrink-0 shadow-sm text-base">
                  ✉
                </div>
                <div>
                  <h5 className="font-bold text-lg text-gray-900 leading-none mb-1">Email</h5>
                  <p className="text-gray-700 text-sm font-medium">info@toplyshop.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4 - Payment Methods */}
          <div>
            <h4 className="text-2xl font-bold mb-5 tracking-wide text-gray-900">Payment Methods</h4>
            {/* ছবির ২-লাইন গ্রিড লেআউট অনুযায়ী পেমেন্ট ইমেজগুলো সাজানো হয়েছে */}
            <div className="grid grid-cols-3 gap-3 items-center max-w-[280px]">
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-xs font-bold text-blue-800">VISA</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-xs font-bold text-pink-600">বিকাশ</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-xs font-bold text-orange-500">নগদ</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-[10px] font-bold text-purple-700">রকেট</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-[9px] font-bold text-green-700 text-center leading-tight">EBL</span>
              </div>
              <div className="bg-white p-2 rounded-md shadow-xs flex items-center justify-center h-12 border border-gray-100">
                <span className="text-[9px] font-bold text-gray-600 text-center leading-tight">Cash on</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  )
}