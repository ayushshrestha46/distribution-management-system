import { useState } from "react";
import { useGetAllOrdersAdminQuery } from "@/app/slices/adminApiSlice";
import { formatDate } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarDays,
  Search,
  Package,
  User,
  MapPin,
  RefreshCw,
  Clock,
  IndianRupeeIcon,
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

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

const AdminShipments = () => {
  const { data, isLoading, refetch } = useGetAllOrdersAdminQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const orders = data?.orders || [];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.city
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : order.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="w-full mt-16">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Order</CardTitle>
            <CardDescription>Track all customer orders</CardDescription>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[calc(100vh-190px)]">
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by customer, email, city or order ID..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Clock className="mr-2 h-6 w-6 animate-spin" />
            <p>Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="mx-auto h-12 w-12 mb-4" />
            <h3 className="text-lg font-medium">No orders found</h3>
            <p>
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Shipping</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarDays className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <User className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{order.user.name}</span>
                        </div>
                        <span className="text-gray-500 text-sm">
                          {order.user.email}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                        <div className="flex flex-col">
                          <span>{order.shippingAddress.city}</span>
                          <span className="text-gray-500 text-sm truncate max-w-48">
                            {order.shippingAddress.address}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Package className="mr-2 h-4 w-4 text-gray-500" />
                        <span>{order.orderItems.length} items</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center font-medium">
                        <IndianRupeeIcon className="mr-1 h-4 w-4 text-gray-500" />
                        <span>{order.totalPrice.toFixed(2)}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminShipments;
