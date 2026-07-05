'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useAuth } from '@/context/auth-context'
import { useEffect, useState } from 'react'

export interface Product {
    _id: string
    name: string
    category: string
    price: number
    offerPrice: number
    images: string[]
    ratings: {
        average: number
        count: number
    }
    isFeatured:boolean
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    const router = useRouter() 
    const queryClient = useQueryClient()
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth() // আপনার auth context-এ loading থাকলে সেটিও নিয়ে আসতে পারেন (e.g., { user, loading })

    const displayImage = product.images && product.images.length > 0
        ? product.images[0]
        : '/placeholder.jpg'

    const roundedRating = Math.round(product.ratings?.average || 5)

    const discount = product.price && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0

    // ================= WISHLIST LOGIC (FIXED & OPTIMIZED) =================
    
    // ১. React Query দিয়ে ডাটাবেজ থেকে উইশলিস্টের ডাটা ফেচ করা
    const { data: dbWishlist = [] } = useQuery({
        queryKey: ['wishlist', user?.email],
        queryFn: async () => {
            if (!user?.email) return [];
            const res = await axiosSecure.get(`/wishlist?email=${user.email}`);
            return Array.isArray(res.data) ? res.data : [];
        },
        enabled: !!user?.email, // শুধুমাত্র ইউজার লগইন থাকলেই এপিআই কল হবে
    })

    // ২. গেস্ট ইউজারের জন্য লোকাল উইশলিস্ট রিঅ্যাক্টিভ করা
    const { data: localWishlist = [] } = useQuery({
        queryKey: ['wishlist', 'guest'],
        queryFn: () => {
            if (typeof window === 'undefined') return [];
            const localData = localStorage.getItem("guest_wishlist");
            return localData ? JSON.parse(localData) : [];
        },
        enabled: !user?.email, // ইউজার লগইন না থাকলে লোকাল স্টোরেজ ট্র্যাক করবে
    })

    // ৩. প্রোডাক্টটি উইশলিস্টে আছে কিনা তা ডাইনামিকালি চেক করা (কোনো আলাদা state বা useEffect লাগবে না)
    const isFavorite = user?.email
        ? dbWishlist.some((item: any) => (item._id === product._id || item.productId === product._id))
        : localWishlist.some((item: any) => item._id === product._id);


    // উইশলিস্টে যোগ/বিয়োগ করার হ্যান্ডলার
    const handleWishlistToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (user && user?.email) {
            try {
                if (isFavorite) {
                    // অলরেডি ফেভারিট থাকলে ডাটাবেজ থেকে রিমুভ হবে
                    await axiosSecure.delete(`/wishlist/${product._id}`)
                    toast.error('উইশলিস্ট থেকে সরানো হয়েছে')
                } else {
                    // না থাকলে অ্যাড হবে
                    await axiosSecure.post('/wishlist', { productId: product._id, email: user.email, product })
                    toast.success('উইশলিস্টে যোগ করা হয়েছে')
                }
                // সফল হওয়ার পর ক্যাশ ইনভ্যালিডেট করা, যাতে সাথে সাথে লাভ আইকন আপডেট হয়
                queryClient.invalidateQueries({ queryKey: ['wishlist', user?.email] })
            } catch (error) {
                toast.error('উইশলিস্ট আপডেট করতে সমস্যা হয়েছে')
            }
        } else {
            // গেস্ট ইউজারের লোকাল স্টোরেজ হ্যান্ডলিং
            try {
                const localData = localStorage.getItem("guest_wishlist")
                let wishlistList = localData ? JSON.parse(localData) : []

                if (isFavorite) {
                    wishlistList = wishlistList.filter((item: any) => item._id !== product._id)
                    toast.error('উইশলিস্ট থেকে সরানো হয়েছে')
                } else {
                    wishlistList.push(product)
                    toast.success('উইশলিস্টে যোগ করা হয়েছে')
                }

                localStorage.setItem("guest_wishlist", JSON.stringify(wishlistList))
                queryClient.invalidateQueries({ queryKey: ['wishlist', 'guest'] })
            } catch (error) {
                console.error("Local wishlist error:", error)
            }
        }
    }

    // ================= CART LOGIC =================
    const addToCartMutation = useMutation({
        mutationFn: async (cartItem: any) => {
            const response = await axiosSecure.post('/cart', cartItem);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cart', user?.email] });
            Swal.fire({
                title: "সফল হয়েছে!",
                text: "পণ্যটি আপনার কার্টে যোগ করা হয়েছে।",
                icon: "success",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ঠিক আছে"
            });
        },
        onError: (error: any) => {
            Swal.fire({
                title: "দুঃখিত!",
                text: error?.response?.data?.message || "আবার চেষ্টা করুন।",
                icon: "error"
            });
        }
    });

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (!product) return;

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.offerPrice || product.price,
            image: displayImage,
            quantity: 1, 
            email: user?.email || null
        };

        if (user && user?.email) {
            addToCartMutation.mutate(cartItem);
        } else {
            try {
                const localCart = localStorage.getItem("guest_cart");
                const cartList = localCart ? JSON.parse(localCart) : [];

                const existingProductIndex = cartList.findIndex(
                    (item: any) => item.productId === product._id
                );

                if (existingProductIndex > -1) {
                    cartList[existingProductIndex].quantity += 1;
                } else {
                    cartList.push(cartItem);
                }

                localStorage.setItem("guest_cart", JSON.stringify(cartList));
                queryClient.invalidateQueries({ queryKey: ['cart'] });

                Swal.fire({
                    title: "সফল হয়েছে!",
                    text: "পণ্যটি আপনার লোকাল কার্টে যোগ করা হয়েছে।",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ঠিক আছে"
                });
            } catch (error) {
                console.error("Local cart error:", error);
            }
        }
    };

    const handleDirectCheckout = (e: React.MouseEvent) => {
        e.preventDefault() 
        e.stopPropagation() 
        const finalPrice = product.offerPrice > 0 ? product.offerPrice : product.price

        const directOrderData = [
            {
                productId: product._id,
                name: product.name,
                price: finalPrice,
                image: displayImage,
                quantity: 1 
            }
        ]

        localStorage.setItem('direct-checkout', JSON.stringify(directOrderData))
        router.push('/checkout?direct=true')
    }

    return (
        <div className="group block h-full">
            <div className="bg-card h-full flex flex-col justify-between rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-300">

                <div>
                    {/* Image Container */}
                    <div className="relative aspect-square bg-secondary overflow-hidden">
                        <Link href={`/product/${product._id}`}>
                            <Image
                                src={displayImage}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                unoptimized
                            />
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-2">
                            {discount > 0 && (
                                <Badge className="bg-primary text-primary-foreground font-semibold">
                                    {discount}% ছাড়
                                </Badge>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                            variant="secondary"
                            size="icon"
                            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                            onClick={handleWishlistToggle}
                        >
                            <Heart className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                        </Button>

                        {/* Quick Add To Cart Button */}
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-foreground/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <Button
                                className="w-full gap-2 font-semibold"
                                size="sm"
                                onClick={handleAddToCart}
                            >
                                <ShoppingCart className="h-4 w-4" />
                                কার্টে যোগ করুন
                            </Button>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4 pb-2">
                        {/* Category */}
                        <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                {product.category}
                            </span>
                        </div>

                        {/* Product Name */}
                        <Link href={`/product/${product._id}`}>
                            <h3 className="font-semibold text-foreground text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
                                {product.name}
                            </h3>
                        </Link>

                        {/* Dynamic Star Rating */}
                        <div className="flex items-center gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    size={16}
                                    className={`${i < roundedRating
                                        ? 'fill-chart-4 text-chart-4' 
                                        : 'fill-muted text-muted'
                                        }`}
                                />
                            ))}
                            <span className="text-xs text-muted-foreground ml-1">
                                ({product.ratings?.count || 0})
                            </span>
                        </div>
                    </div>
                </div>

                {/* Price & Primary Action (Footer) */}
                <div className="p-4 pt-0">
                    <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-xl font-bold text-primary">
                            ৳{product.offerPrice?.toLocaleString()}
                        </span>
                        {discount > 0 && (
                            <span className="text-sm text-muted-foreground line-through">
                                ৳{product.price?.toLocaleString()}
                            </span>
                        )}
                    </div>

                    <Button
                        onClick={handleDirectCheckout}
                        className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold h-11 rounded-xl text-md transition-all"
                    >
                        Order Now
                    </Button>
                </div>

            </div>
        </div>
    )
}