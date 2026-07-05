import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { IntelligenceBook } from '@/components/IntelligenceBook'
import { Metadata } from 'next'


// এখানে মেটাডেটা ডিফাইন করুন (সার্ভার সাইড থেকে খুব সুন্দরভাবে হ্যান্ডেল হবে)
export const metadata: Metadata = {
  title: 'Intelligence Book - Find Your Smart Reads',
  description: 'Explore our exclusive collection of Intelligence Books. Order online today for quick delivery.',
}

export default function Page() {
  const title = "Intelligence Book"
  const subtitle = "আপনার পছন্দের ইন্টেলিজেন্স বইগুলো খুঁজুন এখানে"

  return (
    <>
    <Header/>
    <IntelligenceBook title={title} subtitle={subtitle} />
    <Footer/>
    </>
  )
}