'use client'

import useCart from '@/hooks/useCart'
import { Search, ShoppingCart, Heart, User, Menu, X, LogOut, LayoutDashboard, Facebook, Youtube, Instagram } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import useAxiosPublic from '@/hooks/AxiosPublic'


// Custom X (Twitter) Icon Component (যেহেতু lucide-react এ সরাসরি নতুন X আইকন অনেক সময় থাকে না)
function XIcon({ className, size = 16 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// shadcn/ui Dropdown Components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/context/auth-context'

interface ProductSuggestion {
  _id: string
  name: string
  price: number
  images: string[]
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cart] = useCart()
  const router = useRouter()
  const axiosPublic = useAxiosPublic()
  const { user, logout } = useAuth()
  
// স্ক্রোল ইভেন্ট লিসেনার (স্ক্রোল করলে নিচের বার হাইড করার জন্য)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // সার্চ এবং ডিবউন্স স্টেট
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  
  const wishlistCount = 2

  // ডিবউন্স ইফেক্ট
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim())
    }, 500)

    return () => clearTimeout(handler)
  }, [searchQuery])

  // React Query দিয়ে সাজেশনের জন্য ডেটা ফেচ করা
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['searchSuggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return null
      const response = await axiosPublic.get('/products', {
        params: {
          search: debouncedSearch,
          limit: 6
        }
      })
      return response.data
    },
    enabled: debouncedSearch.length >= 2, 
  })

  const suggestions: ProductSuggestion[] = data?.products || []

  // মেইন সার্চ সাবমিট
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
    }
  }

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-border shadow-sm">
      {/* Top Navigation Bar */}
      <div className="bg-primary text-primary-foreground py-3 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className=" hidden lg:flex gap-6">
            <a href="tel:+8801" className="hover:text-secondary transition-colors">
              Call: +880-1970467192
            </a>
            <a href="mailto:support@bazaarhub.com" className="hover:text-secondary transition-colors">
              Email: info@toplyshop.com
            </a>
          </div>
          
          {/* Top Bar Right: কন্ডিশনাল সোশ্যাল আইকন অথবা সাইন-ইন লিঙ্ক */}
          <div className="flex gap-4 items-center">
             
              <div className=" flex  items-center gap-2 text-primary-foreground/90">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">
                  <Facebook size={16} fill="currentColor" stroke="none" />
                </a>
                <span className="text-primary-foreground/40 text-xs">|</span>
                
                <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">
                  <Youtube size={18} className="stroke-[2]" />
                </a>
                <span className="text-primary-foreground/40 text-xs">|</span>
                
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">
                  <XIcon size={14} />
                </a>
                <span className="text-primary-foreground/40 text-xs">|</span>
                
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-secondary transition-colors">
                  <Instagram size={16} />
                </a>
              </div>
            
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition">
            <div className="w-51 h-16.75">
              <Image src="/logo.png" alt="main logo" width={800} height={400} priority className="object-contain" />
            </div>
          </Link>

         {/* Search Bar & Suggestions - Desktop (মোটা বা লার্জ সাইজ করা হয়েছে) */}
          <div className="hidden md:block relative flex-1 max-w-6/12 mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-12 py-2.5 text-base border-2 border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-gray-700 placeholder-gray-400 "
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors p-1"
              >
                <Search className="w-6 h-6 stroke-[2.5]" />
              </button>
            </form>

            {/* Desktop Live Suggestions Dropdown */}
            {searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                {isLoading || isFetching ? (
                  <div className="p-4 text-sm text-muted-foreground animate-pulse">খোঁজা হচ্ছে...</div>
                ) : suggestions.length > 0 ? (
                  <div className="py-2">
                    {suggestions.map((product) => (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        onClick={() => setSearchQuery('')}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/50 transition border-b border-border last:border-none"
                      >
                        <img 
                          src={product.images?.[0]} 
                          alt={product.name} 
                          className="w-10 h-10 object-cover rounded bg-muted" 
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                          <p className="text-xs font-bold text-primary">৳{product.price?.toLocaleString()}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-sm text-muted-foreground">কোনো পণ্য পাওয়া যায়নি।</div>
                )}
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Wishlist Icon */}
            <Link href="/wishlist" className="relative group hidden sm:flex">
              <Heart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link href="/cart" className="relative group">
              <ShoppingCart className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
              {cart?.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>

            {/* User Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <div className="p-1 rounded-full hover:bg-muted transition-colors cursor-pointer">
                  <User className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white z-50 border border-border shadow-md rounded-lg p-1">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal px-2 py-1.5">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email || 'user@example.com'}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-border h-px" />
                    <DropdownMenuItem asChild className="focus:bg-muted rounded-md cursor-pointer">
                      <Link href="/profile" className="flex w-full items-center gap-2 px-2 py-2 text-sm">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-muted rounded-md cursor-pointer">
                      <Link href="/dashboard" className="flex w-full items-center gap-2 px-2 py-2 text-sm">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1 bg-border h-px" />
                    <DropdownMenuItem 
                      onClick={logout} 
                      className="focus:bg-destructive/10 text-destructive focus:text-destructive rounded-md cursor-pointer flex items-center gap-2 px-2 py-2 text-sm"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-semibold">Welcome</DropdownMenuLabel>
                    <DropdownMenuSeparator className="my-1 bg-border h-px" />
                    <DropdownMenuItem asChild className="focus:bg-muted rounded-md cursor-pointer">
                      <Link href="/login" className="flex w-full items-center gap-2 px-2 py-2 text-sm">
                        Sign In
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-muted rounded-md cursor-pointer">
                      <Link href="/signup" className="flex w-full items-center gap-2 px-2 py-2 text-sm">
                        Sign Up
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-foreground focus:outline-none"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar & Suggestions */}
        <div className="md:hidden mt-3 relative">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-700"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>

          {/* Mobile Live Suggestions Dropdown */}
          {searchQuery.trim().length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
              {isLoading || isFetching ? (
                <div className="p-3 text-xs text-muted-foreground">খোঁজা হচ্ছে...</div>
              ) : suggestions.length > 0 ? (
                <div className="py-1">
                  {suggestions.map((product) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      onClick={() => setSearchQuery('')}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-muted/50 border-b border-border last:border-none"
                    >
                      <img src={product.images?.[0]} alt={product.name} className="w-8 h-8 object-cover rounded bg-muted" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{product.name}</p>
                        <p className="text-xs font-bold text-primary">৳{product.price}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-xs text-muted-foreground">কোনো পণ্য পাওয়া যায়নি।</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Category/Main Navigation */}
      <nav className={`bg-primary/5 hidden lg:block border-t border-border transition-all duration-300 origin-top overflow-hidden ${
          isScrolled ? 'max-h-0 opacity-0 pointer-events-none' : 'max-h-16 opacity-100'
        }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6  overflow-x-auto scrollbar-none">
            <Link href="/" className="text-primary font-medium py-2 hover:text-secondary transition-colors flex-shrink-0">Home</Link>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Combo Offer</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Gyanbox</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Intelligence Book</a>
            <Link href="/shop" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Shop</Link>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">About Us</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Contact Us</a>
            <a href="#" className="text-foreground hover:text-primary py-2 transition-colors flex-shrink-0">Blog</a>
          </div>
        </div>
      </nav>

      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-border p-4">
          <div className="flex flex-col gap-3">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Home</Link>
            <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Shop</Link>
            <Link href="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Wishlist ({wishlistCount})</Link>
            <Link href="/cart" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Cart ({cart?.length || 0})</Link>
            
            {/* Mobile View Conditional Links */}
            {user ? (
              <>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">My Profile</Link>
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Dashboard</Link>
                <button 
                  onClick={() => { logout(); setIsMenuOpen(false); }} 
                  className="text-destructive text-left py-2 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Sign In</Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)} className="text-foreground hover:text-primary py-2">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}