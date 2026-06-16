'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation' // useRouter ইম্পোর্ট করা হয়েছে
import { Star, ShoppingCart, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import Swal from 'sweetalert2'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useAxiosSecure from '@/hooks/useAxiosSecure'
import { useAuth } from '@/context/auth-context'
import { useState } from 'react'

// আপনার নতুন ডাটা স্ট্রাকচার অনুযায়ী টাইপ ডেফিনিশন
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
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
     const [isFavorite, setIsFavorite] = useState(false)
    const router = useRouter() 
    const queryClient = useQueryClient()
    const axiosSecure = useAxiosSecure()
    const { user } = useAuth()

    // ১. প্রথম ছবি নেওয়া, না থাকলে প্লেসহোল্ডার
    const displayImage = product.images && product.images.length > 0
        ? product.images[0]
        : '/placeholder.jpg'

    // ২. ডাইনামিক রেটিং রাউন্ড করা
    const roundedRating = Math.round(product.ratings?.average || 5)

    // ৩. অফার প্রাইস অনুযায়ী ডিসকাউন্ট পার্সেন্টেজ ক্যালকুলেশন
    const discount = product.price && product.offerPrice
        ? Math.round(((product.price - product.offerPrice) / product.price) * 100)
        : 0
    // ৩. কার্টে যোগ করার মিউটেশন (Add to Cart Mutation)
    const addToCartMutation = useMutation({
        mutationFn: async (cartItem: any) => {
            // এই মিউটেশনটি শুধু লগইন করা ইউজারদের জন্য সার্ভারে রিকোয়েস্ট পাঠাবে
            const response = await axiosSecure.post('/cart', cartItem);
            return response.data;
        },
        onSuccess: () => {
            // কার্টের গ্লোবাল স্টেট বা কাউন্ট রি-ফেচ করার জন্য
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

    // কার্ট বাটনে ক্লিকের হ্যান্ডলার
    const handleAddToCart = () => {
        if (!product) return;

        const cartItem = {
            productId: product._id,
            name: product.name,
            price: product.offerPrice || product.price,
            image: displayImage,
            quantity: product.price,
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
                    cartList[existingProductIndex].quantity += product.price;
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
                Swal.fire({
                    title: "দুঃখিত!",
                    text: "কার্টে যোগ করতে সমস্যা হয়েছে।",
                    icon: "error"
                });
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

                        {/* Badges (ডিসকাউন্ট ও অফার ট্যাগ) */}
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
                            className="absolute top-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                setIsFavorite(!isFavorite)
                                toast.success('উইশলিস্টে যোগ করা হয়েছে')
                            }}
                        >
                            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current text-accent' : ''}`} />
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
                                        ? 'fill-chart-4 text-chart-4' // থিম ভিত্তিক গোল্ডেন কালার
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

                    {/* প্রধান অ্যাকশন বাটন (অর্ডার করুন) */}
                    <Button
                        onClick={handleDirectCheckout}
                        className="w-full bg-[#e91e63] hover:bg-[#d81b60] text-white font-bold h-11 rounded-xl text-md transition-all"
                    >
                        অর্ডার করুন
                    </Button>
                </div>

            </div>
        </div>
    )
}