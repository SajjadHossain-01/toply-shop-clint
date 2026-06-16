'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

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
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    offerPrice: initialData?.offerPrice || '',
    description: initialData?.description || '',
    stock: initialData?.stock || '',
    images: initialData?.images || [] as string[],
    details: initialData?.details?.join('\n') || '', // নিউলাইন দিয়ে আলাদা করার জন্য
    features: initialData?.features?.join('\n') || '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) newErrors.name = 'Product name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || parseFloat(formData.price as string) <= 0) newErrors.price = 'Valid original price is required'
    if (!formData.offerPrice || parseFloat(formData.offerPrice as string) <= 0) newErrors.offerPrice = 'Valid selling price is required'
    if (!formData.description?.trim()) newErrors.description = 'Description is required'
    if (!formData.stock || parseInt(formData.stock as string) < 0) newErrors.stock = 'Valid stock quantity is required'
    if (formData.images.length === 0) newErrors.images = 'At least one image is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  // ইমেজ ফাইলকে Base64 এ কনভার্ট করার ফাংশন
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      
      filesArray.forEach(file => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            setFormData(prev => ({
              ...prev,
              images: [...prev.images, reader.result as string]
            }))
            setErrors(prev => ({ ...prev, images: '' }))
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (indexToRemove: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove)
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      // details এবং features কে টেক্সটএরিয়া থেকে অ্যারেতে রূপান্তর
      const finalData = {
        ...formData,
        price: parseFloat(formData.price as string),
        offerPrice: parseFloat(formData.offerPrice as string),
        stock: parseInt(formData.stock as string),
        details: formData.details.split('\n').filter(line => line.trim() !== ''),
        features: formData.features.split('\n').filter(line => line.trim() !== ''),
      }
      onSubmit(finalData)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., জায়ান ইন্টেলিজেন্স বই"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
              </div>
            </div>
          </Card>

          {/* Pricing & Stock */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pricing & Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Original Price (৳) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="1550"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Offer/Selling Price (৳) *</label>
                <input
                  type="number"
                  name="offerPrice"
                  value={formData.offerPrice}
                  onChange={handleChange}
                  placeholder="990"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.offerPrice && <p className="text-red-600 text-xs mt-1">{errors.offerPrice}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Stock Quantity *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  placeholder="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {errors.stock && <p className="text-red-600 text-xs mt-1">{errors.stock}</p>}
              </div>
            </div>
          </Card>

          {/* Extras (Details & Features) */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Extra Information (One item per line)</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Details</label>
                <textarea
                  name="details"
                  value={formData.details}
                  onChange={handleChange}
                  placeholder="১০টি বিল্টিনিং বুক&#10;১০টি লেখার প্যাড"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Product Features</label>
                <textarea
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder="মস্তিষ্ক বিকাশে সহায়ক&#10;কার্যকারিতা প্রমাণিত"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Image Upload */}
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Product Images *</h2>
            <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition cursor-pointer block">
              <div className="text-4xl mb-2">📸</div>
              <p className="text-gray-600 text-sm">Click to select multiple images</p>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {errors.images && <p className="text-red-600 text-xs mt-2">{errors.images}</p>}

            {/* Image Previews */}
            <div className="grid grid-cols-3 gap-2 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group border rounded-lg overflow-hidden h-20">
                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-xs font-bold"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Form Actions */}
          <Card className="p-6">
            <div className="space-y-3">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-2"
              >
                {isLoading ? 'Saving...' : (initialData?._id ? 'Update Product' : 'Add Product')}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => window.history.back()}
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </form>
  )
}