import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Total Products',
      value: '128',
      change: '+12%',
      icon: Package,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Orders',
      value: '3,542',
      change: '+23%',
      icon: ShoppingCart,
      color: 'from-primary to-primary/80',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Total Customers',
      value: '2,104',
      change: '+8%',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Revenue',
      value: '৳5,24,000',
      change: '+34%',
      icon: TrendingUp,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
    },
  ]

  const recentProducts = [
    { id: 1, name: 'Magic Writing Book', price: '৳990', stock: 25, status: 'In Stock' },
    { id: 2, name: 'Intelligence Book Set', price: '৳1,500', stock: 12, status: 'Low Stock' },
    { id: 3, name: 'Drawing Book', price: '৳450', stock: 0, status: 'Out of Stock' },
    { id: 4, name: 'Alphabet Learning Kit', price: '৳750', stock: 45, status: 'In Stock' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div 
              key={stat.label} 
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg text-white`}>
                  <Icon size={24} />
                </div>
              </div>
              <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                <ArrowUpRight size={16} />
                <span>{stat.change} from last month</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link 
                href="/admin/products/add"
                className="p-4 bg-gradient-to-br from-primary to-primary/80 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center gap-2"
              >
                <Package size={20} />
                Add New Product
              </Link>
              <button className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center gap-2">
                <ShoppingCart size={20} />
                View Orders
              </button>
              <button className="p-4 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center gap-2">
                <Users size={20} />
                View Customers
              </button>
              <button className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-105 font-semibold flex items-center gap-2">
                <TrendingUp size={20} />
                View Reports
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Avg Order Value</span>
              <span className="text-gray-900 font-bold">৳3,250</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Total Sales Today</span>
              <span className="text-gray-900 font-bold">৳45,000</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">Pending Orders</span>
              <span className="text-gray-900 font-bold">12</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-gray-700 font-medium">New Customers</span>
              <span className="text-gray-900 font-bold">8</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Recent Products</h2>
          <Link href="/admin/products" className="text-primary hover:text-primary/80 font-semibold text-sm">
            View All →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Product Name</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Price</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Stock</th>
                <th className="text-left py-3 px-4 text-gray-600 font-semibold text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="py-3 px-4 text-gray-900 font-medium">{product.name}</td>
                  <td className="py-3 px-4 text-gray-900">{product.price}</td>
                  <td className="py-3 px-4 text-gray-900">{product.stock}</td>
                  <td className="py-3 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      product.status === 'In Stock' ? 'bg-green-100 text-green-700' :
                      product.status === 'Low Stock' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
