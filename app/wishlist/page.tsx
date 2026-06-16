'use client'

import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import Link from 'next/link'
import { Star, ShoppingCart, Heart, ChevronRight, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { ProductCard } from '@/components/ProductCard'

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState(
        mockWishlist.user1.map((item:any) => ({
            ...item,
            product: getProductById(item.productId),
        }))
    )

    const removeFromWishlist = (productId: string) => {
        setWishlistItems(wishlistItems.filter((item:any) => item.productId !== productId))
    }

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1">
                    <div className="max-w-7xl mx-auto px-4 py-16">
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-foreground mb-4">Your Wishlist is Empty</h1>
                            <p className="text-muted-foreground mb-8">
                                Add products to your wishlist to save them for later
                            </p>
                            <Link
                                href="/products"
                                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90"
                            >
                                Explore Products
                            </Link>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link href="/" className="hover:text-primary">
                            Home
                        </Link>
                        <ChevronRight className="w-4 h-4" />
                        <span className="text-foreground">Wishlist</span>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-foreground mb-8">My Wishlist</h1>
                    <p className="text-muted-foreground mb-6">{wishlistItems.length} items in your wishlist</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {wishlistItems.map((item :any) => {
                            const product = item.product
                            if (!product) return null

                            return (< ProductCard product={product} />)

                        })}
                    </div>

                    {/* Continue Shopping */}
                    <div className="mt-8 text-center">
                        <Link
                            href="/products"
                            className="text-primary hover:text-primary/80 font-semibold"
                        >
                            ← Continue Shopping
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}
