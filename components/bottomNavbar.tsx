'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Info, Phone, Calendar, ShoppingBag, ShoppingCart, User, LayoutGrid } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import useCart from '@/hooks/useCart'

export function MobileBottomNav() {
  const pathname = usePathname()
  const { isAdmin } = useAuth()
  const [cart] = useCart()

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home,
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: ShoppingBag,
    },
    {
      name: 'Cart',
      href: '/cart',
      icon: ShoppingCart,
    },
    {
      name: `${isAdmin ? 'Dashboard' : 'profile'}`,
      href: `${isAdmin ? "/admin" : "/dashboard"}`,
      icon: isAdmin ? LayoutGrid : User,
    },
    {
      name: 'Call',
      href: 'Tel:+880189467192',
      icon: Phone,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const Icon = item.icon
          const cartIcon = item.name === "Cart"
          const isActive = pathname === item.href || pathname.startsWith(item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 px-4 flex-1 text-center transition-colors ${isActive
                ? 'text-red-700 border-t-2 border-secondary'
                : 'text-gray-600 hover:text-secondary'
                }`}
            >
              <div className="relative">
                <Icon className="w-6 h-6 mb-1" />

                {cartIcon && cart.length > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-600 text-white text-[10px] font-bold min-w-5 h-5 px-1 rounded-full flex items-center justify-center shadow">
                    {cart.length}
                  </span>
                )}
              </div>

              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
