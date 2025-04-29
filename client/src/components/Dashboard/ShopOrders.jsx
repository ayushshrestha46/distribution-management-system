import { useCallback, useEffect, useState } from "react";
import {
  useCompletePaymentMutation,
  useGetOrdersShopQuery,
  useInitiatePaymentMutation,
} from "@/app/slices/orderApiSlice";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { ScrollArea } from "../ui/scroll-area";
import { BillGenerated } from "./BillGenerated";
import { toast } from "react-toastify";
import { Badge } from "../ui/badge";
import { CheckCircle2 } from "lucide-react";
const ShopOrders = () => {
  const { data, refetch } = useGetOrdersShopQuery();
  const orders = Array.isArray(data?.orders) ? [...data.orders].reverse() : [];

  const [activeTab, setActiveTab] = useState("all");
  const [selectedFilter, setSelectedFilter] = useState("All Orders");

  const nav = useNavigate();
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const [completePayment, { isLoading }] = useCompletePaymentMutation();

  const completePaymentHandler = async (pidx, orderId) => {
    try {
      const paymentData = await completePayment({ pidx, orderId }).unwrap();
      if (paymentData.success) {
        setPaymentResult(paymentData);
        setShowSuccessPopup(true);
      }
      return;
    } catch (error) {
      toast.error(error?.data?.message || "Payment verification failed");
    }
  };

  useEffect(() => {
    refetch();
    const urlParams = new URLSearchParams(window.location.search);
    const pidxFromUrl = urlParams.get("pidx");
    if (pidxFromUrl) {
      // await completePayment()
      const orderId = localStorage.getItem("orderId");
      completePaymentHandler(pidxFromUrl, orderId);
    }
    // completePaymentHandler('pidx','orderId')
  }, []);
  const [payment, { isLoading: paymentLoading }] = useInitiatePaymentMutation();
  const initiatePayment = async (data) => {
    try {
      localStorage.setItem("orderId", data.purchaseOrderId);
      const res = await payment(data).unwrap();
      if (res.success) {
        window.location.href = res?.payment_url;
      }
    } catch (error) {
      toast.error(error?.data?.message || "Payment Initiation Failed");
    }
  };

  const resetForm = useCallback(() => {
    setShowSuccessPopup(false);

    window.history.pushState({}, document.title, `/dashboard/orders`);
    localStorage.removeItem("orderId");
    window.location.reload();
  }, [showSuccessPopup]);

  const tabs = [
    { id: "all", label: "All", count: orders.length },
    {
      id: "pending",
      label: "Pending",
      count: orders.filter((o) => o.status === "pending").length,
    },
    {
      id: "to-receive",
      label: "To Receive",
      count: orders.filter((o) => o.status === "process").length,
    },
    {
      id: "rejected",
      label: "Rejected",
      count: orders.filter((o) => o.status === "rejected").length,
    },
    {
      id: "delivered",
      label: "Delivered",
      count: orders.filter((o) => o.isDelivered).length,
    },
  ];

  const filters = ["All Orders", "Last 30 Days", "Last 6 Months", "Last Year"];

  const filteredOrders = orders.filter((order) => {
    switch (activeTab) {
      case "pending":
        return order.status === "pending";
      case "rejected":
        return order.status === "rejected" && !order.isDelivered;
      case "to-receive":
        return order.status === "process" && !order.isDelivered;
      case "delivered":
        return order.isDelivered;
      default:
        return true;
    }
  });

  const getFilteredByTime = (orderList) => {
    const now = new Date();
    return orderList.filter((order) => {
      const orderDate = new Date(order.createdAt);
      switch (selectedFilter) {
        case "Last 30 Days":
          return now - orderDate <= 30 * 24 * 60 * 60 * 1000;
        case "Last 6 Months":
          return now - orderDate <= 6 * 30 * 24 * 60 * 60 * 1000;
        case "Last Year":
          return now - orderDate <= 365 * 24 * 60 * 60 * 1000;
        default:
          return true;
      }
    });
  };

  const displayOrders = getFilteredByTime(filteredOrders);

  return (
    <div className="bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">My Orders</h1>

        {/* Tabs */}
        <div className="flex border-b mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-6 py-3 relative focus:outline-none ${
                activeTab === tab.id
                  ? "text-blue-600 border-b-2 border-blue-600 font-semibold"
                  : "text-gray-600 hover:text-gray-800"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="ml-2 text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="mb-8 flex items-center">
          <span className="mr-3 text-gray-600">Show:</span>
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="border rounded-md px-4 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {filters.map((filter) => (
              <option key={filter} value={filter}>
                {filter}
              </option>
            ))}
          </select>
        </div>

        <ScrollArea className="h-[calc(100vh-360px)]">
          {displayOrders.length > 0 ? (
            displayOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-md border p-6 mb-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center">
                    <span className="font-semibold text-gray-800">
                      Order #{order._id.slice(-6)}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      order.status === "pending"
                        ? "text-yellow-700 bg-yellow-100"
                        : order.isDelivered
                        ? "text-green-700 bg-green-100"
                        : order.status === "rejected"
                        ? "text-red-700 bg-red-100"
                        : "text-blue-700 bg-blue-100"
                    }`}
                  >
                    {order.isDelivered ? "Delivered" : order.status}
                  </span>
                </div>

                <div className="space-y-6">
                  {order.orderItems?.map((item) => (
                    <div key={item?._id} className="flex gap-6">
                      <img
                        src={item?.image}
                        alt={item?.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {item?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            Quantity: {item?.qty}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500">Price</p>
                          <p className="text-gray-900 font-medium">
                            ₹{item?.price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                      <p className="text-sm text-gray-500">Tax</p>
                      <p className="text-gray-900">
                        ₹{order.taxPrice.toFixed(2)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Shipping</p>
                      <p className="text-gray-900">
                        ₹{order.shippingPrice.toFixed(2)}
                      </p>
                    </div>

                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Total</p>
                      <p className="text-gray-900 font-semibold">
                        ₹{order.totalPrice.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Shipping Address:</p>
                    <p className="text-gray-900">
                      {order.shippingAddress.address},{" "}
                      {order.shippingAddress.city},{" "}
                      {order.shippingAddress.postalCode},{" "}
                      {order.shippingAddress.country}
                    </p>
                  </div>

                  <div className="flex justify-between items-center">
                    <BillGenerated id={order._id} />
                    {["process", "delivered"].includes(order.status) &&
                      !order.isPaid && (
                        <Button
                          onClick={() => initiatePayment({purchaseOrderId:order._id,amount:order.totalPrice, purchasOrderName:order.distributor.user.name })}
                          disabled={paymentLoading}
                        >
                          {paymentLoading
                            ? "Redirecting..."
                            : "Pay with Khalti"}
                        </Button>
                      )}
                    {order.isPaid && order.status !== 'rejected' && (
                      <span className="bg-green-200 text-green-700 rounded-md px-4 py-1  ">
                        Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-md border p-8 text-center flex flex-col text-gray-500 gap-3">
              <p>There are no orders placed yet.</p>
              <p>
                <Button onClick={() => nav("/dashboard")}>
                  CONTINUE SHOPPING
                </Button>
              </p>
            </div>
          )}

          {showSuccessPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-fade-in">
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckCircle2 className="h-6 w-6 text-indigo-800" />
                  </div>
                  <h3 className="mt-3 text-lg font-medium text-gray-900">
                    Payment Successful!
                  </h3>
                  <div className="mt-2 text-sm text-gray-500">
                    <p>Your payment has been processed successfully.</p>

                    {paymentResult?.paymentInfo && (
                      <div className="mt-4 bg-gray-50 p-3 rounded-lg text-left">
                        <h4 className="font-medium text-gray-700 mb-2">
                          Transaction Details:
                        </h4>
                        <div className="space-y-1">
                          <p className="flex justify-between">
                            <span className="font-medium">Amount:</span>
                            <span>
                              NPR {paymentResult.paymentInfo.total_amount}
                            </span>
                          </p>
                          <p className="flex justify-between">
                            <span className="font-medium">Transaction ID:</span>
                            <span className="font-mono">
                              {paymentResult.paymentInfo.transaction_id}
                            </span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-5">
                  <button
                    onClick={resetForm}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-900 hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
};

export default ShopOrders;
