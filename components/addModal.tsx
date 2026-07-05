'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function AdModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // sessionStorage ব্যবহার করা হয়েছে, যা ব্রাউজার/ট্যাব ক্লোজ করলে ডিলিট হয়ে যায়
    const isAdShown = sessionStorage.getItem('ad_shown_session');
    
    if (!isAdShown) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem('ad_shown_session', 'true');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#00000033] backdrop-blur-sm p-4">
      <div className="relative max-w-2xl w-full bg-white rounded-lg overflow-hidden shadow-2xl animate-fade-in">
        
        {/* ক্লোজ বাটন */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-10 bg-[#00000033] hover:bg-[#000000B3] text-white rounded-full p-2 w-9 h-9 flex items-center justify-center transition-all"
          aria-label="Close Ad"
        >
          ✕
        </button>

        {/* অ্যাড পিকচার */}
        <div className="relative w-full h-125 md:h-162.5">
          <Image
            src="/slide1.png" // আপনার অ্যাড ইমেজের পাথ এখানে দিন
            alt="Advertisement"
            fill
            className="object-cover"
            priority // ফার্স্ট লোডিংয়ে ইমেজের পারফরম্যান্স বুস্ট করার জন্য
          />
        </div>

      </div>
    </div>
  );
}