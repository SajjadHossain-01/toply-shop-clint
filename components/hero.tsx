'use client'

import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination } from 'swiper/modules'
import Image from 'next/image'

import 'swiper/css'
import 'swiper/css/pagination'

export function Hero() {
  const slides = [
    {
      id: 1,
      imageSrc: '/slide1.png', 
      alt: 'First Slide Banner',
    },
    {
      id: 2,
      imageSrc: '/slide2.png', 
      alt: 'Second Slide Banner',
    },
  ]

  return (
    <section className="relative w-full h-auto bg-white select-none">
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5) !important;
          opacity: 1 !important;
          width: 10px !important;
          height: 10px !important;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff !important;
          width: 35px !important;
          border-radius: 5px !important;
        }
        .swiper-container-horizontal > .swiper-pagination-bullets {
          bottom: 20px !important;
        }
      `}</style>

      <Swiper
        modules={[Autoplay, Pagination]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        className="w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* এখানে aspect ratio এবং fill বাদ দিয়ে w-full এবং h-auto করা হয়েছে */}
            <div className="relative w-full h-auto">
              <Image
                src={slide.imageSrc}
                alt={slide.alt}
                width={1920} // আপনার ইমেজের আসল উইডথ (যেকোনো স্ট্যান্ডার্ড সাইজ)
                height={1080} // আপনার ইমেজের আসল হাইট
                priority={slide.id === 1}
                className="w-full h-auto object-inside" 
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  )
}