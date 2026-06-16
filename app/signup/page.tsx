"use client"
import Swal from 'sweetalert2'
import { useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, UserPlus, Check } from "lucide-react"
import useAxiosPublic from '@/hooks/AxiosPublic'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/auth-context'

type FormValues = {
  name: string
  phone: string
  email: string
  password: string
  confirmPassword: string
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const axiosPublic = useAxiosPublic()
  const { login } = useAuth()
  const router = useRouter()
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors }
  } = useForm<FormValues>()

  const password = watch("password")
  const confirmPassword = watch("confirmPassword")

  const passwordChecks = [
    { label: "কমপক্ষে ৮ অক্ষর", valid: password?.length >= 8 },
    { label: "একটি বড় হাতের অক্ষর", valid: /[A-Z]/.test(password || "") },
    { label: "একটি সংখ্যা", valid: /[0-9]/.test(password || "") },
  ]

  const passwordsMatch = password === confirmPassword && confirmPassword

  const onSubmit = async (data: FormValues) => {
    if (data.password !== data.confirmPassword) {
      Swal.fire({
        title: "ভুল হয়েছে!",
        text: "পাসওয়ার্ড মিলছে না!",
        icon: "error"
      })
      return
    }

    const formData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      password: data.password
    }

    setIsLoading(true)

    try {
      await axiosPublic.post("/users", formData)

      // signup এর পর auto login
      const user = await login(data.email, data.password)

      await Swal.fire({
        title: "Signup successful",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      })

      if (user?.role === "admin") {
        router.push("/admin")
      } else {
        router.push("/")
      }
      reset()

    } catch (err: any) {
      const message = err?.response?.data?.message || "Something went wrong!";
      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto border-border/50 shadow-lg">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">নিবন্ধন করুন</CardTitle>
        <CardDescription>
          নতুন অ্যাকাউন্ট তৈরি করতে তথ্য দিন
        </CardDescription>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">

          {/* Name */}
          <div className="space-y-2">
            <Label>পূর্ণ নাম</Label>
            <Input
              placeholder="আপনার পূর্ণ নাম লিখুন"
              {...register("name", { required: "নাম দিতে হবে" })}
            />
            {errors.name && (
              <p className="text-xs text-red-500">{errors.name.message}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label>মোবাইল নম্বর</Label>
            <Input
              placeholder="০১XXXXXXXXX"
              {...register("phone", { required: "ফোন নম্বর দিন" })}
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>ইমেইল</Label>
            <Input
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              {...register("email", { required: "ইমেইল দিতে হবে" })}
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>পাসওয়ার্ড</Label>

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="পাসওয়ার্ড তৈরি করুন"
                {...register("password", {
                  required: "পাসওয়ার্ড দিতে হবে",
                  minLength: 8
                })}
                className="pr-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {password && (
              <div className="space-y-1 mt-2">
                {passwordChecks.map((check, index) => (
                  <div key={index} className="flex items-center gap-2 text-xs">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${check.valid
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {check.valid && <Check className="w-3 h-3" />}
                    </div>
                    <span>{check.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label>পাসওয়ার্ড নিশ্চিত করুন</Label>

            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="পুনরায় পাসওয়ার্ড লিখুন"
                {...register("confirmPassword", {
                  required: "পাসওয়ার্ড নিশ্চিত করুন"
                })}
                className={`pr-10 ${confirmPassword &&
                  (passwordsMatch ? "border-green-500" : "border-red-500")
                  }`}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-500">পাসওয়ার্ড মিলছে না</p>
            )}
          </div>
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              required
              className="mt-1 rounded border-border text-primary focus:ring-primary"
            />
            <span className="text-sm text-muted-foreground">
              আমি <button type="button" className="text-primary hover:underline">শর্তাবলী</button> এবং{" "}
              <button type="button" className="text-primary hover:underline">গোপনীয়তা নীতি</button> পড়েছি এবং সম্মতি দিচ্ছি
            </span>
          </label>
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "অপেক্ষা করুন..." : "নিবন্ধন করুন"}
          </Button>

          <p className="text-sm text-center">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link href={"/login"}>
              <button type="button" className="text-primary hover:underline">
                লগইন করুন
              </button>
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}