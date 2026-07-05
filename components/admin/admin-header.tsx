'use client'

import { LogOut, Search, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

interface AdminHeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export function AdminHeader({ sidebarOpen, setSidebarOpen }: AdminHeaderProps) {
const {logout}= useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-3 md:py-4 flex items-center justify-between sticky top-0 z-40">
      {/* Left - Mobile Menu & Search */}
      <div className="flex items-center gap-3 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <Menu size={24} />
        </button>

        {/* Search - Hide on mobile, show on md and up */}
        <div className="hidden md:block flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products, orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* Right - Notifications & Profile */}
      <div className="flex items-center gap-3 md:gap-6">
        {/* Mobile Search Icon */}
        <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Search size={20} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Divider - Hide on mobile */}
        <div className="hidden md:block w-px h-6 bg-gray-200"></div>

        {/* User Profile - Hide text on mobile */}
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer hover:bg-gray-50 px-2 md:px-3 py-2 rounded-lg transition">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            A
          </div>
          <div className="hidden md:block text-right">
            <p className="font-semibold text-gray-900 text-sm">Admin</p>
            <p className="text-gray-600 text-xs">Administrator</p>
          </div>
        </div>

        {/* Logout Button - Icon only on mobile */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-2"
        >
          <LogOut size={18} />
          <span className="hidden md:inline">Logout</span>
        </Button>
      </div>
    </header>
  )
}
