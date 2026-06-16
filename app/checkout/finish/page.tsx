'use client'

import { useRef, useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Printer, ShoppingBag, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { InvoiceTemplate } from '@/components/admin/invoice-template'
import { useReactToPrint } from 'react-to-print'
import useAxiosPublic from '@/hooks/AxiosPublic'

function OrderSuccessContent() {
  const invoiceRef = useRef<HTMLDivElement>(null)
  const searchParams = useSearchParams()
  const axiosPublic = useAxiosPublic()

  // ইউআরএল থেকে orderId রিড করা হচ্ছে
  const orderId = searchParams.get('orderId')

  const [orderData, setOrderData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    // যদি ইউআরএল-এ orderId না থাকে অথবা ডিফল্ট 'success' টেক্সট চলে আসে
    if (!orderId || orderId === 'success') {
      setError('অর্ডার আইডি পাওয়া যায়নি অথবা অবৈধ ট্র্যাকিং আইডি।')
      setLoading(false)
      return
    }

    const fetchRealOrderData = async () => {
      try {
        setLoading(true)
        // ডাটাবেজ থেকে আসল অর্ডারের ডাটা আনা হচ্ছে
        const response = await axiosPublic.get(`/orders/${orderId}`)

        if (response.data?.success) {
          setOrderData(response.data.order)
        } else {
          setError('অর্ডারের ডাটাবেজ রেকর্ড খুঁজে পাওয়া যায়নি।')
        }
      } catch (err: any) {
        setError(err?.response?.data?.message || 'ইনভয়েস লোড করতে সমস্যা হয়েছে।')
      } finally {
        setLoading(false)
      }
    }

    fetchRealOrderData()
  }, [orderId, axiosPublic])

  // react-to-print কনফিগারেশন
  const handlePrint = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: `Invoice_${orderData?.id || orderId}`,
  })

  // ১. লোডিং স্টেট
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-2" />
        <p className="text-gray-600 font-medium">আসল ইনভয়েস তৈরি হচ্ছে, দয়া করে অপেক্ষা করুন...</p>
      </div>
    )
  }

  // ২. এরর স্টেট
  if (error || !orderData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-6 rounded-xl shadow-md border border-red-100 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-xl font-bold text-gray-900 mb-1">ইনভয়েস লোড করা যায়নি</h2>
          <p className="text-gray-600 text-sm mb-4">{error || 'Something went wrong'}</p>
          <Link href="/">
            <Button size="sm" className="bg-primary hover:bg-primary/90">হোমপেজে ফিরে যান</Button>
          </Link>
        </div>
      </div>
    )
  }

  // ৩. সাকসেস স্টেট (মূল UI - Syntax Error ফিক্সড)
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Success Header Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500 animate-bounce" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            আপনার অর্ডারটি সফল হয়েছে!
          </h1>
          <p className="text-gray-600 mt-3 text-lg max-w-md mx-auto">
            অর্ডার আইডি: <span className="font-bold text-gray-900">
              {orderData.id?.startsWith('ORD-') ? `#${orderData.id}` : (orderData.id || orderId)}
            </span>
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button
              onClick={() => handlePrint()}
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-6 py-5 rounded-xl font-semibold shadow-md transition-all"
            >
              <Printer size={20} />
              প্রিন্ট / ডাউনলোড ইনভয়েস
            </Button>

            <Link href="/" passHref>
              <Button
                variant="outline"
                className="flex items-center gap-2 px-6 py-5 rounded-xl font-medium border-gray-300 hover:bg-gray-50 transition-all"
              >
                <ShoppingBag size={20} />
                আরও শপিং করুন
              </Button>
            </Link>
          </div>
        </div>

        {/* Invoice Preview Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-bold text-gray-800">Invoice Preview</h2>
            <p className="text-sm text-muted-foreground font-medium">তারিখ: {orderData.date}</p>
          </div>

          <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 p-2 sm:p-6">
            <div ref={invoiceRef} className="bg-white p-4">
              {/* ডাটাবেজের লাইভ ডাটা ইনভয়েস টেমপ্লেটে পাস করা হচ্ছে */}
              <InvoiceTemplate order={orderData} />
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline group">
            <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
            ড্যাশবোর্ডে যান
          </Link>
        </div>

      </div>
    </div>
  )
}

// Next.js-এর নিয়ম অনুযায়ী useSearchParams ব্যবহারের জন্য Suspense র‍্যাপার
export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  )
}