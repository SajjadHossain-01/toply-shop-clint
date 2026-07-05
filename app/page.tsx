'use client'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { InfoCards } from '@/components/info-cards'
import { ProductSection } from '@/components/product-section'
import { Footer } from '@/components/footer'
import WhatsAppChat from '@/components/whatsapp'
import { FeaturesProduct } from '@/components/feature-product'
import { IntelligenceBook } from '@/components/IntelligenceBook'
import AdModal from '@/components/addModal'
import { NewArrivalProduct } from '@/components/newProduct'
import { TopSellingProduct } from '@/components/topSelling-Product'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <InfoCards />

      <TopSellingProduct
        title="Top Selling Products"
        subtitle="আমাদের সবচেয়ে বেশি বিক্রিত পণ্যসমূহ"
      />
      <NewArrivalProduct
        title="নতুন পণ্য"
        subtitle="আমাদের সর্বশেষ সংযুক্ত পণ্যসমূহ"
      />
      <FeaturesProduct
        title="Feature Product"
        subtitle="Our Feature Product"
      />
      <IntelligenceBook
        title="Intelligence Book"
        subtitle="গল্প এবং শেখার জন্য সেরা বই"
      />
      <ProductSection
        title="শিক্ষামূলক খেলনা"
        subtitle="মজা করার সাথে শিখুন"
      />
      <WhatsAppChat />
      <AdModal />
      <Footer />
    </div>
  )
}
