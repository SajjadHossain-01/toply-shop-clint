'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ProductFormInput {
  name: string
  category: string
  price: number | string
  offerPrice: number | string
  description: string
  stock: number | string
  images: string[]
  details: string
  features: string
  isFeatured: boolean
  youtubeCode: string
  isStockOut: boolean
}

interface ProductFormProps {
  initialData?: {
    _id?: string
    name: string
    category: string
    price: number | string
    offerPrice: number | string
    description: string
    stock: number | string
    images: string[]
    details?: string[]
    features?: string[]
    isFeatured?: boolean
    youtubeCode?: string
    isStockOut?: boolean
  }
  onSubmit: (data: any) => void
  isLoading?: boolean
}

const categories = [
  'Intelligence Book',
  'Writing Book',
  'Math Book',
  'English Book',
  'Toy',
  'Educational Game',
  'Other',
]

export function ProductForm({ initialData, onSubmit, isLoading = false }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormInput>({
    defaultValues: {
      name: '',
      category: '',
      price: '',
      offerPrice: '',
      description: '',
      stock: '',
      images: [],
      details: '',
      features: '',
      isFeatured: false,
      youtubeCode: '',
      isStockOut: false,
    },
  })

  const watchedImages = watch('images') || []

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        category: initialData.category || '',
        price: initialData.price ?? '',
        offerPrice: initialData.offerPrice ?? '',
        description: initialData.description || '',
        stock: initialData.stock ?? '',
        images: initialData.images || [],
        details: initialData.details?.join('\n') || '',
        features: initialData.features?.join('\n') || '',
        isFeatured: initialData.isFeatured || false,
        youtubeCode: initialData.youtubeCode || '',
        isStockOut: initialData.isStockOut || false,
      })
    }
  }, [initialData, reset])

const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files) {
    const filesArray = Array.from(e.target.files)
    
    const base64Promises = filesArray.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) resolve(reader.result as string)
        };
        reader.onerror = reject
        reader.readAsDataURL(file)
      })
    })

    try {
      
      const newBase64Images = await Promise.all(base64Promises)
      
      
      const updatedImages = [...watchedImages, ...newBase64Images]
      
     
      setValue('images', updatedImages, { shouldValidate: true })
    } catch (error) {
      console.error("Image processing failed:", error)
    }
  }
}
  const removeImage = (indexToRemove: number) => {
    setValue('images', watchedImages.filter((_, index) => index !== indexToRemove), { shouldValidate: true })
  }

  const onFormSubmit = (data: ProductFormInput) => {
    const finalData = {
      ...data,
      price: parseFloat(data.price as string),
      offerPrice: parseFloat(data.offerPrice as string),
      stock: parseInt(data.stock as string),
      details: data.details.split('\n').filter(line => line.trim() !== ''),
      features: data.features.split('\n').filter(line => line.trim() !== ''),
    }
    onSubmit(finalData)
  }

  // রিউজেবল ইনপুট স্টাইল ক্লাস
  const inputStyle = "w-full mt-1.5 px-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 shadow-sm"

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8 max-w-7xl mx-auto pb-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* বাম পাশের মেইন ফর্ম এলাকা */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* বেসিক ইনফরমেশন কার্ড */}
          <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Basic Information</h2>
              <p className="text-sm text-gray-500">Fill out the primary details of your product</p>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Product Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  placeholder="e.g., জায়ান ইন্টেলিজেন্স বই"
                  className={inputStyle}
                  {...register('name', { required: 'Product name is required' })}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.name.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Category <span className="text-red-500">*</span></label>
                <select
                  className={`${inputStyle} appearance-none bg-no-repeat bg-[right_1rem_center] bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%236B7280%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:0.75rem_auto]`}
                  {...register('category', { required: 'Category is required' })}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.category.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Description <span className="text-red-500">*</span></label>
                <textarea
                  placeholder="Write a compelling product description..."
                  rows={4}
                  className={`${inputStyle} resize-none`}
                  {...register('description', { required: 'Description is required' })}
                />
                {errors.description && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.description.message}</p>}
              </div>
            </div>
          </Card>

          {/* প্রাইজ এবং ইনভেন্টরি কার্ড */}
          <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Pricing & Inventory</h2>
              <p className="text-sm text-gray-500">Manage your price points and stock counts</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700">Original Price</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-semibold text-sm">৳</span>
                  <input
                    type="number"
                    placeholder="1550"
                    className={`${inputStyle} mt-0 pl-8`}
                    {...register('price', { 
                      required: 'Original price is required',
                      validate: v => parseFloat(v as string) > 0 || 'Must be greater than 0'
                    })}
                  />
                </div>
                {errors.price && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.price.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Offer/Selling Price</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 font-semibold text-sm">৳</span>
                  <input
                    type="number"
                    placeholder="990"
                    className={`${inputStyle} mt-0 pl-8`}
                    {...register('offerPrice', 
                    //   { 
                    //   validate: v => parseFloat(v as string) > 0 || 'Must be greater than 0'
                    // }
                  )}
                  />
                </div>
                {errors.offerPrice && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.offerPrice.message}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Stock Quantity</label>
                <input
                  type="number"
                  placeholder="100"
                  className={inputStyle}
                  {...register('stock', { 
                    required: 'Stock quantity is required',
                    validate: v => parseInt(v as string) >= 0 || 'Cannot be negative'
                  })}
                />
                {errors.stock && <p className="text-red-500 text-xs mt-1.5 font-medium">⚠️ {errors.stock.message}</p>}
              </div>
            </div>
          </Card>

          {/* এক্সট্রা ও মিডিয়া ইনফো কার্ড */}
          <Card className="p-6 md:p-8 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h2 className="text-xl font-bold text-gray-800">Media & Extra Information</h2>
              <p className="text-sm text-gray-500">Add YouTube review embed and specifications</p>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">YouTube Video Code</label>
                <div className="relative mt-1.5">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-400 text-xs font-medium">youtube.com/watch?v=</span>
                  <input
                    type="text"
                    placeholder="dQw4w9WgXcQ"
                    className={`${inputStyle} mt-0 pl-36 font-mono text-sm`}
                    {...register('youtubeCode')}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Details <span className="text-xs text-gray-400">(One item per line)</span></label>
                  <textarea
                    placeholder="১০টি বিল্টইন বুক&#10;১০টি লেখার প্যাড"
                    rows={4}
                    className={`${inputStyle} text-sm font-sans leading-relaxed`}
                    {...register('details')}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Product Features <span className="text-xs text-gray-400">(One item per line)</span></label>
                  <textarea
                    placeholder="Waterproof Fabric&#10;Eco-friendly material"
                    rows={4}
                    className={`${inputStyle} text-sm font-sans leading-relaxed`}
                    {...register('features')}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* ডান পাশের সাইডবার এলাকা */}
        <div className="lg:col-span-1 space-y-8">
          
          {/* প্রোডাক্ট সেটিংস / টগলস */}
          <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Product Visibility</h2>
            
            <div className="space-y-4">
              {/* মডার্ন টগল সুইচ ১ - Featured */}
              <label className="flex items-center justify-between cursor-pointer group p-2 rounded-xl hover:bg-gray-50 transition">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-800">Featured Product</span>
                  <span className="text-xs text-gray-400">Display on home page banner</span>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" {...register('isFeatured')} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
              </label>

              {/* মডার্ন টগল সুইচ ২ - Out of Stock */}
              <label className="flex items-center justify-between cursor-pointer group p-2 rounded-xl hover:bg-gray-50 transition">
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-red-600">Out of Stock</span>
                  <span className="text-xs text-gray-400">Disable purchase badge</span>
                </div>
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" {...register('isStockOut')} />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-red-500/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </div>
              </label>
            </div>
          </Card>

          {/* ড্রপজোন ইমেজ আপলোডার */}
          <Card className="p-6 bg-white border border-gray-100 shadow-sm rounded-2xl">
            <h2 className="text-lg font-bold text-gray-800 border-b border-gray-100 pb-3 mb-4">Product Images</h2>
            
            <label className="group border-2 border-dashed border-gray-200 hover:border-primary/50 hover:bg-primary/5 rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer block relative">
              <div className="text-3xl mb-2 transition-transform duration-200 group-hover:-translate-y-1">📸</div>
              <p className="text-gray-700 font-semibold text-sm">Upload Product Photos</p>
              <p className="text-gray-400 text-xs mt-1">Supports PNG, JPG (Max. 3টি রিকমেন্ডেড)</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <input type="hidden" {...register('images', { 
                validate: v => v && v.length > 0 || 'At least one image is required' 
              })} />
            </label>
            {errors.images && <p className="text-red-500 text-xs mt-2 font-medium">⚠️ {errors.images.message}</p>}

            {/* ইমেজ প্রিভিউ গ্রিড */}
            {watchedImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2.5 mt-4 border-t border-gray-50 pt-4">
                {watchedImages.map((img, idx) => (
                  <div key={idx} className="relative group border border-gray-100 rounded-xl overflow-hidden h-20 bg-gray-50 shadow-inner">
                    <img src={img} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all duration-150 flex items-center justify-center text-xs font-bold backdrop-blur-[1px]"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* অ্যাকশন বাটন কার্ড */}
          <Card className="p-4 bg-gray-50/50 border border-gray-100 rounded-2xl space-y-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/95 text-white font-semibold py-3 rounded-xl transition shadow-md shadow-primary/10 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </div>
              ) : (
                initialData?._id ? 'Update Product' : 'Publish Product'
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl border-gray-200 transition"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </Card>
        </div>

      </div>
    </form>
  )
}