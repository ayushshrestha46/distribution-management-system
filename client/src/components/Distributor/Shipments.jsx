import {
  useAcceptOrderMutation,
  useDeliverOrderMutation,
  useGetOrdersDistributorQuery,
  useRejectOrderMutation,
  useCashPaymentMutation,
} from "@/app/slices/orderApiSlice";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Package,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  TruckIcon,
  User,
  MapPin,
  Package2,
  Calendar,
  BookMarked,
  BookMarkedIcon,
  BookmarkCheckIcon,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

export default function Shipments() {
  const { data, isLoading, refetch } = useGetOrdersDistributorQuery();
  const orders = Array.isArray(data?.orders) ? data.orders : [];
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const orderRefs = useRef({});
  const [Accept, { isLoading: acceptLoading }] = useAcceptOrderMutation();
  const [Delivered, { isLoading: deliveredLoading }] =
    useDeliverOrderMutation();
  const [Reject, { isLoading: rejectLoading }] = useRejectOrderMutation();
  const [cashPayment, { isLoading: cashLoading }] = useCashPaymentMutation();

  // Status counts for the dashboard
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  const filteredOrders = orders
    .filter((order) => {
      if (filter === "all") return true;
      return order.status === filter;
    })
    .filter((order) => {
      if (!searchTerm) return true;
      const searchLower = searchTerm.toLowerCase();
      return (
        order._id.toLowerCase().includes(searchLower) ||
        order.shippingAddress.address.toLowerCase().includes(searchLower) ||
        order.shippingAddress.city.toLowerCase().includes(searchLower) ||
        order.orderItems.some((item) =>
          item.name.toLowerCase().includes(searchLower)
        )
      );
    });

  const handleAccept = async (orderId) => {
    try {
      const success = await Accept(orderId); // Assume onAccept is defined elsewhere
      if (success) {
        toast.success("Order Accepted..");
        refetch();
      }
    } catch (error) {
      console.error("Failed to accept order:", error);
    }
  };

  const handleCancel = async (orderId) => {
    try {
      const success = await Reject(orderId); // Assume onCancel is defined elsewhere
      if (success) {
        toast.info("Order Rejected");
        refetch();
      }
    } catch (error) {
      console.error("Failed to cancel order:", error);
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const success = await Delivered(orderId); // Assume onMarkDelivered is defined elsewhere
      if (success) {
        toast.success("Order delivered");
        refetch();
      }
    } catch (error) {
      console.error("Failed to mark order as delivered:", error);
    }
  };

  const handleOrderPaid = async (orderId) => {
    try {
      const response = await cashPayment(orderId);
      if (response.data.success) {
        toast.success("Order marked as Paid");
        refetch();
      }
    } catch (error) {
      toast.error(error.data.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "delivered":
        return <TruckIcon className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6">
      <ScrollArea className="h-[calc(100vh-120px)] ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Dashboard Summary Cards */}
          <div className="md:col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-4">
                  <Package className="h-6 w-6 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Orders</p>
                  <h3 className="font-bold text-xl">{orders.length}</h3>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-yellow-100 p-2 rounded-full mr-4">
                  <Clock className="h-6 w-6 text-yellow-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <h3 className="font-bold text-xl">
                    {statusCounts.pending || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <CheckCircle className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <h3 className="font-bold text-xl">
                    {statusCounts.approved || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardContent className="p-4 flex items-center">
                <div className="bg-green-100 p-2 rounded-full mr-4">
                  <TruckIcon className="h-6 w-6 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                  <h3 className="font-bold text-xl">
                    {statusCounts.delivered || 0}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Orders Lists Section */}
          <div className="md:col-span-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <CardTitle className="text-2xl font-bold flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Orders Management
                  </CardTitle>
                </div>
              </CardHeader>

              <div className="px-6 pb-2">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by ID, address, or product..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-muted-foreground" />
                    <Select value={filter} onValueChange={setFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter orders" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator className="mt-2" />

              <CardContent className="p-0">
                <Tabs defaultValue="list" className="w-full">
                  <div className="px-6 pt-4">
                    <TabsList className="grid w-full max-w-md grid-cols-2">
                      <TabsTrigger value="list">List View</TabsTrigger>
                      <TabsTrigger value="detailed">Detailed View</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="list" className="m-0">
                    <div className="px-6 py-4">
                      {isLoading ? (
                        <div className="flex justify-center py-8">
                          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                        </div>
                      ) : filteredOrders.length > 0 ? (
                        <div className="space-y-3">
                          {filteredOrders.map((order) => (
                            <motion.div
                              key={order._id}
                              ref={(el) => (orderRefs.current[order._id] = el)}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={cn(
                                "border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer",
                                selectedOrder?._id === order._id &&
                                  "bg-accent border-gray-300 shadow-md"
                              )}
                              onClick={() => setSelectedOrder(order)}
                            >
                              <div className="flex flex-col sm:flex-row justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-semibold">
                                      Order #{order._id.slice(-6)}
                                    </h3>
                                    <Badge
                                      className={cn(
                                        "px-2 py-1 text-xs font-medium flex items-center gap-1",
                                        getStatusColor(order.status)
                                      )}
                                      variant="outline"
                                    >
                                      {getStatusIcon(order.status)}
                                      {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1)}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center text-sm text-muted-foreground gap-4">
                                    <div className="flex items-center gap-1">
                                      <Calendar className="w-3 h-3" />
                                      {formatDate(order.createdAt)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {order.shippingAddress.city}
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Package2 className="w-3 h-3" />
                                      {order.orderItems.length} items
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <p className="font-medium text-lg">
                                    Rs.{order.totalPrice.toFixed(2)}
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {order.status === "pending" && (
                                      <>
                                        <Button
                                          variant="default"
                                          size="sm"
                                          className="flex items-center gap-1"
                                          disabled={acceptLoading}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleAccept(order._id);
                                          }}
                                        >
                                          <CheckCircle className="w-3 h-3" />
                                          {acceptLoading
                                            ? "Accepting..."
                                            : "Accept"}
                                        </Button>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1 text-red-500 hover:text-red-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancel(order._id);
                                          }}
                                          disabled={rejectLoading}
                                        >
                                          <XCircle className="w-3 h-3" />
                                          {rejectLoading
                                            ? "Cancelling..."
                                            : "Cancel"}
                                        </Button>
                                      </>
                                    )}
                                    {order.status === "process" &&
                                      !order.isDelivered && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="flex items-center gap-1 bg-slate-200"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleMarkDelivered(order._id);
                                          }}
                                        >
                                          <TruckIcon className="w-3 h-3" />
                                          Mark Delivered
                                        </Button>
                                      )}
                                    {order.status !== "rejected" && order.status !== 'pending' &&
                                      !order.isPaid && (
                                        <Button
                                          className="bg-green-500 hover:bg-green-700"
                                          size="sm"
                                          onClick={(e) =>
                                            handleOrderPaid(order._id)
                                          }
                                          disabled={cashLoading}
                                        >
                                          <BookmarkCheckIcon />
                                          {cashLoading
                                            ? "Marking..."
                                            : "Mark as paid"}
                                        </Button>
                                      )}
                                    {order.status !== "rejected" &&
                                      order.isPaid && (
                                        <span className="bg-green-100 text-green-700 px-[12.5px] rounded-lg ">
                                          Paid
                                        </span>
                                      )}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <Package className="h-12 w-12 mx-auto mb-3 opacity-20" />
                          <p>No orders found matching your criteria</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="detailed" className="m-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 h-[60vh]">
                      {/* Orders list in detailed view */}
                      <div className="col-span-1 border-r">
                        <ScrollArea className="h-[60vh]">
                          <div className="px-4 py-2 space-y-1">
                            {isLoading ? (
                              <div className="flex justify-center py-8">
                                <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                              </div>
                            ) : filteredOrders.length > 0 ? (
                              filteredOrders.map((order) => (
                                <div
                                  key={order._id}
                                  ref={(el) =>
                                    (orderRefs.current[order._id] = el)
                                  }
                                  className={cn(
                                    "p-3 rounded-md flex items-center justify-between cursor-pointer hover:bg-accent/50 transition-colors",
                                    selectedOrder?._id === order._id &&
                                      "bg-accent border-l-4 border-primary"
                                  )}
                                  onClick={() => setSelectedOrder(order)}
                                >
                                  <div className="flex items-center gap-3">
                                    <div
                                      className={cn(
                                        "w-2 h-2 rounded-full",
                                        order.status === "pending" &&
                                          "bg-yellow-500",
                                        order.status === "approved" &&
                                          "bg-blue-500",
                                        order.status === "delivered" &&
                                          "bg-green-500",
                                        order.status === "rejected" &&
                                          "bg-red-500"
                                      )}
                                    />
                                    <div>
                                      <p className="font-medium">
                                        #{order._id.slice(-6)}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {formatDate(order.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                  <span className="font-medium">
                                    Rs.{order.totalPrice.toFixed(2)}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-8 text-muted-foreground">
                                <p>No orders found</p>
                              </div>
                            )}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Order details */}
                      <div className="col-span-2">
                        {selectedOrder ? (
                          <ScrollArea className="h-[60vh]">
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold">
                                  Order #{selectedOrder._id.slice(-6)}
                                </h3>
                                <Badge
                                  className={cn(
                                    "px-2 py-1 text-xs font-medium flex items-center gap-1",
                                    getStatusColor(selectedOrder.status)
                                  )}
                                  variant="outline"
                                >
                                  {getStatusIcon(selectedOrder.status)}
                                  {selectedOrder.status
                                    .charAt(0)
                                    .toUpperCase() +
                                    selectedOrder.status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="shadow-sm">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <User className="w-4 h-4" />
                                      Customer Information
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <p className="text-sm font-medium">
                                      Shop Name:{" "}
                                      <span className="text-gray-600 font-normal">
                                        {selectedOrder.user.name}
                                      </span>
                                    </p>
                                    <p className="text-sm font-medium mt-2">
                                      Shipping Address:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedOrder.shippingAddress.address}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedOrder.shippingAddress.city},{" "}
                                      {selectedOrder.shippingAddress.postalCode}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedOrder.shippingAddress.country}
                                    </p>
                                  </CardContent>
                                </Card>

                                <Card className="shadow-sm">
                                  <CardHeader className="pb-2">
                                    <CardTitle className="text-sm flex items-center gap-2">
                                      <Package2 className="w-4 h-4" />
                                      Order Summary
                                    </CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-sm">
                                        Order Date:
                                      </span>
                                      <span className="text-sm">
                                        {formatDate(selectedOrder.createdAt)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-sm">Items:</span>
                                      <span className="text-sm">
                                        {selectedOrder.orderItems.length}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-bold">
                                      <span>Total:</span>
                                      <span>
                                        Rs.{selectedOrder.totalPrice.toFixed(2)}
                                      </span>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>

                              <Card className="mt-6 shadow-sm">
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-sm flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Order Items
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="space-y-3">
                                    {selectedOrder.orderItems.map(
                                      (item, index) => (
                                        <div
                                          key={index}
                                          className="flex justify-between items-center py-2 border-b last:border-0"
                                        >
                                          <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent rounded flex items-center justify-center">
                                              <Package2 className="w-5 h-5 text-muted-foreground" />
                                              <img
                                                src={item.image}
                                                className="rounded-lg"
                                                srcset=""
                                              />
                                            </div>
                                            <div>
                                              <p className="font-medium">
                                                {item.name}
                                              </p>
                                              <p className="text-xs text-muted-foreground">
                                                Qty: {item.qty} × Rs.{" "}
                                                {(item.price || 0).toFixed(2)}
                                              </p>
                                            </div>
                                          </div>
                                          <p className="font-medium">
                                            Rs.{" "}
                                            {(
                                              (item.price || 0) * item.qty
                                            ).toFixed(2)}
                                          </p>
                                        </div>
                                      )
                                    )}
                                  </div>
                                </CardContent>
                              </Card>

                              <div className="mt-6 flex justify-end gap-2">
                                {selectedOrder.status === "pending" && (
                                  <>
                                    <Button
                                      variant="default"
                                      className="flex items-center gap-2"
                                      disabled={acceptLoading}
                                      onClick={() =>
                                        handleAccept(selectedOrder._id)
                                      }
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      {acceptLoading
                                        ? "Accepting.."
                                        : "Accept Order"}
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex items-center gap-2 text-red-500 hover:text-red-700"
                                      disabled={rejectLoading}
                                      onClick={() =>
                                        handleCancel(selectedOrder._id)
                                      }
                                    >
                                      <XCircle className="w-4 h-4" />
                                      {rejectLoading
                                        ? "Cancelling.."
                                        : "Cancel Order"}
                                    </Button>
                                  </>
                                )}
                                {selectedOrder.status === "process" &&
                                  !selectedOrder.isDelivered && (
                                    <Button
                                      variant="default"
                                      className="flex items-center gap-2"
                                      onClick={(e) =>
                                        handleMarkDelivered(selectedOrder._id)
                                      }
                                      disabled={deliveredLoading}
                                    >
                                      <TruckIcon className="w-4 h-4" />
                                      Mark as Delivered
                                    </Button>
                                  )}
                                {selectedOrder.status !== "rejected" && selectedOrder.status !== 'pending' &&
                                  !selectedOrder.isPaid && (
                                    <Button
                                      className="bg-green-500 hover:bg-green-700"
                                      size="sm"
                                      onClick={(e) =>
                                        handleOrderPaid(selectedOrder._id)
                                      }
                                      disabled={cashLoading}
                                    >
                                      <BookmarkCheckIcon />
                                      {cashLoading
                                        ? "Marking..."
                                        : "Mark as paid"}
                                    </Button>
                                  )}
                                {selectedOrder.status !== "rejected" &&
                                  selectedOrder.isPaid && (
                                    <span className="bg-green-100 text-green-700 px-[12.5px] rounded-lg ">
                                      Paid
                                    </span>
                                  )}
                              </div>
                            </div>
                          </ScrollArea>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-6">
                            <Package className="h-16 w-16 mb-4 opacity-20" />
                            <h3 className="text-lg font-medium mb-2">
                              No Order Selected
                            </h3>
                            <p>Select an order from the list to view details</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
