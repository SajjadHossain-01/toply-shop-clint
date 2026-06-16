'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutGrid, Package, ShoppingCart, Users, Settings, HelpCircle } from 'lucide-react'

const menuItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutGrid },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo Section */}
      <div className="p-4 md:p-6 border-b border-gray-200">
        <Link href="/admin" className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center font-bold text-white text-lg flex-shrink-0">
            TS
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-bold text-gray-900">ToplyShop</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 md:px-4 py-4 md:py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg transition-all duration-200 justify-center md:justify-start ${
                isActive
                  ? 'bg-primary text-white shadow-md'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              <span className="hidden md:inline font-medium">{item.label}</span>
              {isActive && <div className="hidden md:block ml-auto w-2 h-2 bg-white rounded-full"></div>}
            </Link>
          )
        })}
      </nav>

      {/* Help Section */}
      <div className="p-3 md:p-4 border-t border-gray-200">
        <button 
          title="Help & Support"
          className="w-full flex items-center gap-3 px-3 md:px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors justify-center md:justify-start"
        >
          <HelpCircle size={20} className="flex-shrink-0" />
          <span className="hidden md:inline font-medium">Help & Support</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 md:p-4 border-t border-gray-200 bg-white">
        <p className="text-xs text-gray-500 text-center hidden md:block">© 2026 ToplyShop</p>
      </div>
    </aside>
  )
}
