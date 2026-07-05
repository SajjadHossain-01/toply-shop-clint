import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductsTable } from '@/components/admin/products-table'
import { Plus, Search } from 'lucide-react'

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-1">Manage and view all your products</p>
        </div>
        <Link href="/admin/products/add">
          <Button className="bg-linear-to-r from-primary to-primary/80 hover:shadow-lg text-white flex items-center gap-2 font-semibold">
            <Plus size={20} />
            Add New Product
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products by name or category..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option>All Categories</option>
          <option>Intelligence Book</option>
          <option>Writing Book</option>
          <option>Math Book</option>
          <option>English Book</option>
          <option>Toy</option>
        </select>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option>All Status</option>
          <option>In Stock</option>
          <option>Low Stock</option>
          <option>Out of Stock</option>
        </select>
      </div>

      {/* Products Table */}
      <ProductsTable />
    </div>
  )
}
