"use client"
import Swal from 'sweetalert2'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from '@/context/auth-context'

type FormValues = {
    email: string
    password: string
}

export default function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const { login } = useAuth()
    const router = useRouter()

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        const { email, password } = data;
        setIsLoading(true);
        setError("");

        try {
            const user = await login(email, password);

            await Swal.fire({
                title: "Login Successful",
                icon: "success",
                timer: 1500,
                showConfirmButton: false
            });

            if (user?.role === "admin") {
                router.push("/admin");
            } else {
                router.push("/");
            }
            reset();

        } catch (err: any) {
            const message = err?.response?.data?.message || "Login failed";
            setError(message);

            Swal.fire({
                title: "Error!",
                text: message,
                icon: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg">
                <CardHeader className="text-center space-y-2">
                    <CardTitle className="text-2xl font-bold">লগইন করুন</CardTitle>
                    <CardDescription>
                        আপনার অ্যাকাউন্টে প্রবেশ করতে তথ্য দিন
                    </CardDescription>
                </CardHeader>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label>ইমেইল</Label>
                            <Input
                                type="email"
                                placeholder="আপনার ইমেইল লিখুন"
                                {...register("email", {
                                    required: "ইমেইল দিতে হবে"
                                })}
                                className="h-11"
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">
                                    {errors.email.message}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <Label>পাসওয়ার্ড</Label>
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="আপনার পাসওয়ার্ড লিখুন"
                                    {...register("password", {
                                        required: "পাসওয়ার্ড দিতে হবে"
                                    })}
                                    className="h-11 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-sm text-red-500 text-center">
                                {error}
                            </p>
                        )}

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-border text-primary focus:ring-primary"
                                />
                                <span className="text-muted-foreground">
                                    আমাকে মনে রাখুন
                                </span>
                            </label>
                            <button
                                type="button"
                                className="text-primary hover:underline font-medium"
                            >
                                পাসওয়ার্ড ভুলে গেছেন?
                            </button>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4">
                        <Button
                            type="submit"
                            className="w-full h-11 text-base font-medium"
                            disabled={isLoading}
                        >
                            {isLoading ? "অপেক্ষা করুন..." : "লগইন করুন"}
                        </Button>

                        <p className="text-sm text-muted-foreground text-center">
                            অকাউন্ট নেই?{" "}
                            <Link href="/signup" className="text-primary hover:underline font-medium">
                                নিবন্ধন করুন
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}