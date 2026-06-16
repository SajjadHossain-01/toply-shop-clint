'use client'

import { forwardRef } from 'react'

interface InvoiceTemplateProps {
  order: {
    id: string
    customer: string
    email: string
    phone: string
    amount: number
    items: number
    status: string
    date: string
    payment: string
    products: string[]
  }
}

export const InvoiceTemplate = forwardRef<HTMLDivElement, InvoiceTemplateProps>(
  ({ order }, ref) => {
    const invoiceDate = new Date(order.date)
    const dueDate = new Date(invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000)

    return (
      <div 
        ref={ref} 
        className="w-full bg-white p-8 [print-color-adjust:exact] [-webkit-print-color-adjust:exact]" 
        style={{ maxWidth: '8.5in' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-gray-300">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center font-bold text-white shadow-sm">
                TS
              </div>
              <h1 className="text-3xl font-bold text-gray-900">ToplyShop</h1>
            </div>
            <p className="text-gray-600">Bangladesh's Best Online Toy & Book Store</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Invoice #</p>
            <p className="text-2xl font-bold text-gray-900">{order.id}</p>
            <p className="text-sm text-gray-600 mt-2">Date: {order.date}</p>
          </div>
        </div>

        {/* Company & Customer Info */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          {/* From */}
          <div>
            <p className="text-sm font-bold text-gray-600 mb-2">FROM:</p>
            <div className="text-gray-900">
              <p className="font-semibold">ToplyShop Limited</p>
              <p className="text-sm">Dhaka, Bangladesh</p>
              <p className="text-sm">Phone: +880-1234-567890</p>
              <p className="text-sm">Email: info@toplyshop.com</p>
            </div>
          </div>

          {/* To */}
          <div>
            <p className="text-sm font-bold text-gray-600 mb-2">BILL TO:</p>
            <div className="text-gray-900">
              <p className="font-semibold">{order.customer}</p>
              <p className="text-sm">Email: {order.email}</p>
              <p className="text-sm">Phone: {order.phone}</p>
              <p className="text-sm">Dhaka, Bangladesh</p>
            </div>
          </div>
        </div>

        {/* Invoice Details */}
        <div className="grid grid-cols-4 gap-4 mb-8 bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <p className="text-xs text-gray-600 font-semibold">Invoice Date</p>
            <p className="text-gray-900 font-semibold">{order.date}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Due Date</p>
            <p className="text-gray-900 font-semibold">{dueDate.toISOString().split('T')[0]}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Order Status</p>
            <p className="text-gray-900 font-semibold">{order.status}</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 font-semibold">Payment Method</p>
            <p className="text-gray-900 font-semibold">{order.payment}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 border-b-2 border-gray-300">
              <th className="text-left px-4 py-3 text-gray-900 font-semibold">Item Description</th>
              <th className="text-center px-4 py-3 text-gray-900 font-semibold">Qty</th>
              <th className="text-right px-4 py-3 text-gray-900 font-semibold">Unit Price</th>
              <th className="text-right px-4 py-3 text-gray-900 font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index} className="border-b border-gray-200 hover:bg-gray-50/50">
                <td className="px-4 py-3 text-gray-900">{product}</td>
                <td className="text-center px-4 py-3 text-gray-900">1</td>
                <td className="text-right px-4 py-3 text-gray-900">৳{Math.floor(order.amount / order.items).toLocaleString()}</td>
                <td className="text-right px-4 py-3 text-gray-900">৳{Math.floor(order.amount / order.items).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-300 mb-2">
              <span className="text-gray-700 font-medium">Subtotal:</span>
              <span className="text-gray-900 font-semibold">৳{(order.amount * 0.95).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300 mb-2">
              <span className="text-gray-700 font-medium">Tax (5%):</span>
              <span className="text-gray-900 font-semibold">৳{(order.amount * 0.05).toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
            </div>
            <div className="flex justify-between py-3 bg-gradient-to-r from-pink-100 to-pink-50 px-4 rounded-lg">
              <span className="text-gray-900 font-bold text-lg">Total:</span>
              <span className="text-pink-600 font-bold text-lg">৳{order.amount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-gray-300 text-center text-sm text-gray-600">
          <p className="mb-2">Thank you for your business!</p>
          <p>For any queries, please contact support@toplyshop.com or call +880-1234-567890</p>
          <p className="mt-4 text-xs text-gray-500">© 2026 ToplyShop. All rights reserved.</p>
        </div>
      </div>
    )
  }
)

InvoiceTemplate.displayName = 'InvoiceTemplate'