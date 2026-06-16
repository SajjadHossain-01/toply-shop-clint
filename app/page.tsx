'use client'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { InfoCards } from '@/components/info-cards'
import { ProductSection } from '@/components/product-section'
import { Footer } from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <InfoCards />
      <ProductSection 
        title="নতুনদের জন্য খেলনা"
        subtitle="শিশুদের বিকাশের জন্য সেরা পছন্দ"
      />
      <ProductSection 
        title="বিশেষ অফার"
        subtitle="সীমিত সময়ের জন্য বিশেষ ছাড়"
      />
      <ProductSection 
        title="শিশুর জন্য পড়ার বই"
        subtitle="গল্প এবং শেখার জন্য সেরা বই"
      />
      <ProductSection 
        title="শিক্ষামূলক খেলনা"
        subtitle="মজা করার সাথে শিখুন"
      />
      <Footer />
    </div>
  )
}
