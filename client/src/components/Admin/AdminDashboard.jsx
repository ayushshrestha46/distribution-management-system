import { Package, Truck, ChevronRight, Store, Building2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { useNavigate } from "react-router-dom";
import {
  useGetAllOrdersAdminQuery,
  useAllCustomersQuery,
  useGetAllPaymentQuery,
} from "@/app/slices/adminApiSlice";
import { Badge } from "../ui/badge";
import { useGetAllSupplierQuery } from "@/app/slices/supplierApiSlice";

export default function AdminDashboard() {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      processing: { color: "bg-blue-100 text-blue-800", label: "Processing" },
      shipped: { color: "bg-purple-100 text-purple-800", label: "Shipped" },
      delivered: { color: "bg-green-100 text-green-800", label: "Delivered" },
      rejected: { color: "bg-red-100 text-red-800", label: "Rejected" },
    };

    const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

    return (
      <Badge className={`${config.color} hover:${config.color}`}>
        {config.label}
      </Badge>
    );
  };

  const { data } = useGetAllOrdersAdminQuery();
  const orders = data?.orders || [];
  const { data: distributorData } = useGetAllSupplierQuery();
  const distributors = distributorData?.distributors || [];
  const { data: customersData } = useAllCustomersQuery();
  const totalRetailers = customersData?.users?.length;
  const { data: paymentsData } = useGetAllPaymentQuery();
  const payments = paymentsData?.payments || [];
  const navigator = useNavigate();

  const totalTurnOver = orders.reduce(
    (total, order) => total + order.totalPrice,
    0
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `Rs. ${amount.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <ScrollArea className="flex-1 h-[calc(100vh-1px)]">
      <div className="pt-16 m-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">
              Dashboard Overview
            </h2>
            <p className="text-gray-600">
              Welcome back, Admin! Here's what's happening today.
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            {
              title: "Total Turnover",
              value: `Rs.${totalTurnOver.toLocaleString("en-IN")}`,
              icon: Package,
              color: "blue",
            },
            {
              title: "Total Orders",
              value: orders?.length,
              icon: Truck,
              color: "green",
            },
            {
              title: "Total Suppliers",
              value: distributors?.length,
              icon: Building2,
              color: "yellow",
            },
            {
              title: "Total Retailers",
              value: totalRetailers,
              icon: Store,
              color: "red",
            },
          ].map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="flex justify-between items-start mb-4">
                <stat.icon className={`h-6 w-6 text-${stat.color}-500`} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                {stat.title}
              </h3>
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders and Payments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
              <button
                className="text-blue-600 text-sm hover:text-blue-700 font-medium flex items-center gap-1"
                onClick={() => navigator("./shipments")}
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-4">
              {orders.slice(0, 4).map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium text-gray-900">
                        #{order._id.slice(-5).toUpperCase()}
                      </h4>
                      <span className="text-sm text-gray-500">
                        {order.user.name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""} •
                      <span className="font-medium">
                        {" "}
                        {formatCurrency(order.totalPrice)}
                      </span>
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Payments */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">
                Recent Payments
              </h3>
              <button
                className="text-blue-600 text-sm hover:text-blue-700 font-medium flex items-center gap-1"
                onClick={() => navigator("/admin/all-payments")}
              >
                View All
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3">
              {payments.slice(0, 4).map((payment) => (
                <div
                  key={payment._id}
                  className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 p-3"
                >
                  {/* Header with ID and Payment Method */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold text-gray-900 text-md">
                        #{payment._id.slice(-5).toUpperCase()}
                      </h4>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {payment.paymentMethod}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-900">
                        {formatCurrency(payment.amount)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatDate(payment.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div>
                        <span className="text-sm text-gray-600">Retailer</span>
                        <div className="font-medium text-gray-900">
                          {payment.user.name}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      <div>
                        <span className="text-sm text-gray-600">
                          Distributor
                        </span>
                        <div className="font-medium text-gray-900">
                          {payment.distributor.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
