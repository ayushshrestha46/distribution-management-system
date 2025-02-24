import React, { useEffect, useState } from 'react';
import { Search, Filter, TruckIcon, WarehouseIcon, BoxIcon, PackageSearch, ShoppingCart, Users, BarChart3, Settings, ChevronDown, Bell, UserCircle } from 'lucide-react';
import { useGetDistributorProfileQuery } from '@/app/slices/supplierApiSlice';

import { ChangePassword } from '../index';
import { ScrollArea } from '../ui/scroll-area';

function Dashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  // const user = useSelector((state) => state.auth.user._id)

  const { data, isLoading } = useGetDistributorProfileQuery();
  const isFirst = data?.distributor.firstlogin;
  console.log(isFirst)
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isFirst === true) {
      setOpen(true);
    }
  }, [isFirst]);

  const dashboardCards = [
    {
      title: 'Total Orders',
      value: '1,284',
      change: '+12.5%',
      trend: 'up',
      icon: ShoppingCart
    },
    {
      title: 'Inventory Value',
      value: '$142,384',
      change: '+8.2%',
      trend: 'up',
      icon: BoxIcon
    },
    {
      title: 'Active Shipments',
      value: '48',
      change: '-3.1%',
      trend: 'down',
      icon: TruckIcon
    },
    {
      title: 'Customers',
      value: '856',
      change: '+5.3%',
      trend: 'up',
      icon: Users
    }
  ];

  const [orders] = useState([
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      customer: 'Tech Solutions Inc.',
      status: 'in-transit',
      destination: 'New York, NY',
      date: '2024-03-15',
      value: '$2,450.00'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      customer: 'Global Retail Co.',
      status: 'pending',
      destination: 'Los Angeles, CA',
      date: '2024-03-14',
      value: '$1,875.00'
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      customer: 'Smart Devices Ltd.',
      status: 'delivered',
      destination: 'Chicago, IL',
      date: '2024-03-13',
      value: '$3,200.00'
    }
  ]);

  const [inventory] = useState([
    {
      id: '1',
      name: 'Premium Laptop',
      sku: 'LAP-PRO-001',
      quantity: 45,
      location: 'Warehouse A',
      status: 'in-stock'
    },
    {
      id: '2',
      name: 'Wireless Headphones',
      sku: 'ACC-HEAD-002',
      quantity: 12,
      location: 'Warehouse B',
      status: 'low-stock'
    },
    {
      id: '3',
      name: 'Smart Watch',
      sku: 'WAT-SMT-003',
      quantity: 0,
      location: 'Warehouse A',
      status: 'out-of-stock'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'in-transit': 'bg-blue-100 text-blue-800',
      'delivered': 'bg-green-100 text-green-800',
      'in-stock': 'bg-green-100 text-green-800',
      'low-stock': 'bg-yellow-100 text-yellow-800',
      'out-of-stock': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ChangePassword open={open} setOpen={setOpen} />
      {/* Top Navigation */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between h-full px-8">
          <div className="text-xl font-semibold text-gray-800">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
              <Bell className="w-5 h-5" />
            </button>
            <div className="h-6 w-px bg-gray-200"></div>
            <button className="flex items-center gap-2 text-gray-700">
              <UserCircle className="w-8 h-8" />
              <span className="font-medium">John Doe</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}

      <ScrollArea className="flex-1 h-[calc(100vh-1px)]  ">
        {/* Main Content */}
        <div className="ml-4 pt-16 p-8">
          {/* Search and Actions */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search orders, inventory, customers..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-5 h-5" />
                <span>Filter</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                <PackageSearch className="w-5 h-5" />
                <span>New Order</span>
              </button>
            </div>
          </div>

          {/* Dashboard View */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-4 gap-6">
                {dashboardCards.map((card) => (
                  <div
                    key={card.title}
                    className="bg-white p-6 rounded-xl border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <card.icon className="w-8 h-8 text-blue-600" />
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                          card.trend === "up"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {card.change}
                      </span>
                    </div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {card.title}
                    </h3>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Recent Orders
                  </h2>
                </div>
                <div className="divide-y divide-gray-200">
                  {orders.slice(0, 5).map((order) => (
                    <div
                      key={order.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.customer}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            order.status
                          )}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <p className="font-medium text-gray-900">
                          {order.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Orders View */}
          {activeTab === "orders" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-2">Order #</div>
                <div className="col-span-3">Customer</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Destination</div>
                <div className="col-span-2">Date</div>
                <div className="col-span-1">Value</div>
              </div>

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="col-span-2 text-blue-600 font-medium">
                    {order.orderNumber}
                  </div>
                  <div className="col-span-3 text-gray-900">
                    {order.customer}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {order.destination}
                  </div>
                  <div className="col-span-2 text-gray-500">{order.date}</div>
                  <div className="col-span-1 text-gray-900 font-medium">
                    {order.value}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Inventory View */}
          {activeTab === "inventory" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-gray-200 bg-gray-50 text-sm font-medium text-gray-500">
                <div className="col-span-4">Product</div>
                <div className="col-span-2">SKU</div>
                <div className="col-span-2">Quantity</div>
                <div className="col-span-2">Location</div>
                <div className="col-span-2">Status</div>
              </div>

              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-gray-100 hover:bg-gray-50"
                >
                  <div className="col-span-4 text-gray-900">{item.name}</div>
                  <div className="col-span-2 text-gray-500">{item.sku}</div>
                  <div className="col-span-2 text-gray-900 font-medium">
                    {item.quantity}
                  </div>
                  <div className="col-span-2 text-gray-500">
                    {item.location}
                  </div>
                  <div className="col-span-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        item.status
                      )}`}
                    >
                      {item.status
                        .split("-")
                        .map(
                          (word) => word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default Dashboard;