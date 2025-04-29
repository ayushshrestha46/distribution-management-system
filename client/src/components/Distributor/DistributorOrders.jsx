import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Clock,
  Package,
  IndianRupee,
  Calendar,
  ShoppingBag,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useGetOrdersDistributorQuery } from "@/app/slices/orderApiSlice";

import { Skeleton } from "@/components/ui/skeleton";

export default function DistributorOrders() {
  const { data, isLoading } = useGetOrdersDistributorQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const recentOrders = orders.slice(0, 3);

  const getOrderItemSummary = (items) => {
    if (items.length === 0) return "No items";
    if (items.length === 1) return "1 item";
    return `${items.length} items`;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state
  if (recentOrders.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Orders
            </CardTitle>
            <CardDescription className="mt-1">
              Track and manage your recent orders
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingBag className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No orders found</h3>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="w-full shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Recent Orders
            </CardTitle>
            <CardDescription className="mt-1">
              Track and manage your recent orders
            </CardDescription>
          </div>

          <Link
            to="./shipment"
            className="border p-1.5 rounded-sm shadow-sm capitalize"
          >
            view all
          </Link>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          Order Id:{" "}
                          <span className="text-gray-600">#{order._id}</span>
                        </h3>
                      </div>
                      <p className=" border-gray-300 mb-2 text-gray-600 text-base">
                        {" "}
                        Ordered By : {order?.user?.name}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="font-medium flex items-center justify-end text-lg">
                        <IndianRupee className="w-4 h-4" />
                        {order.totalPrice.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Package className="w-4 h-4" />
                        {getOrderItemSummary(order.orderItems)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
