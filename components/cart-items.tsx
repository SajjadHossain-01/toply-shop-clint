'use client'

import { Trash2, Plus, Minus } from 'lucide-react'
import type { CartItem } from '@/app/cart/page'
import Image from 'next/image'

interface CartItemsProps {
  items: CartItem[]
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemoveItem: (id: number) => void
}

export function CartItems({
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartItemsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-white rounded-lg p-4 md:p-6 flex gap-4 md:gap-6 shadow-sm hover:shadow-md transition border border-gray-200"
        >
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-20 overflow-hidden md:w-24 md:h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center text-4xl md:text-5xl">
              <Image
              src={item.image}
              width={350}
              height={350}
              alt={item.title}
              
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-1 line-clamp-2">
              {item.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-3">
              <div className="text-yellow-400 text-sm">
                {'★'.repeat(Math.floor(item?.rating))}
                {'☆'.repeat(5 - Math.floor(item?.rating))}
              </div>
              <span className="text-gray-600 text-xs md:text-sm">
                ({item.rating})
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg md:text-xl font-bold text-primary">
                ৳{item.price}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ৳{item.originalPrice}
              </span>
              <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                -{Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)}%
              </span>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="p-1 hover:bg-gray-100 rounded transition"
                aria-label="কমান"
              >
                <Minus size={18} className="text-gray-600" />
              </button>
              <input
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) =>
                  onUpdateQuantity(item.id, parseInt(e.target.value) || 0)
                }
                className="w-12 text-center border border-gray-300 rounded px-2 py-1 text-sm"
              />
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="p-1 hover:bg-gray-100 rounded transition"
                aria-label="বাড়ান"
              >
                <Plus size={18} className="text-gray-600" />
              </button>
              <span className="text-sm text-gray-600 ml-auto">
                সাব: ৳{(item.price * item.quantity).toLocaleString('bn-BD')}
              </span>
            </div>
          </div>

          {/* Remove Button */}
          <div className="flex-shrink-0 flex items-start pt-1">
            <button
              onClick={() => onRemoveItem(item.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded transition"
              aria-label="মুছুন"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
