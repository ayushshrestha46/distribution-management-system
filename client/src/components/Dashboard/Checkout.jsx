import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { clearCart } from "@/app/slices/cartSlice";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useGetUserProfileQuery } from "@/app/slices/userApiSlice";
import { useCreateOrderMutation } from "@/app/slices/orderApiSlice";
import { toast } from "react-toastify";

const Checkout = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const { data: userData } = useGetUserProfileQuery();
  const user = userData?.user;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [createOrder] = useCreateOrderMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      shopName: "",
      email: "",
      phoneNumber: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  // Update form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        shopName: user.name || "",
        email: user.email || "",
        phoneNumber: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        state: user.state || "",
        zipCode: user.zipCode || "",
      });
    }
  }, [user, reset]);

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.discountedPrice * item.quantity,
    0
  );
  const tax = totalPrice * 0.13;
  const orderTotal = totalPrice + tax;

  const onSubmit = async (formData) => {
    try {
      setIsSubmitting(true);

      // Transform cart items to match the complete order model structure
      const orderItems = cartItems.map((item) => ({
        name: item.name,
        qty: item.quantity,
        image: item.images[0]?.url || "",
        price: item.price,
        discountedPrice: item.discountedPrice,
        product: item._id, // This should be the MongoDB ObjectId of the product
      }));

      const orderData = {
        orderItems,
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          postalCode: formData.zipCode,
          country: "Nepal", // Assuming the country is Nepal since using Khalti
          phoneNumber: formData.phoneNumber,
        },
        paymentMethod: "Khalti",
        paymentResult: {
          id: "", // Will be populated after Khalti payment
          status: "pending",
          update_time: new Date().toISOString(),
          email_address: formData.email,
        },
        taxPrice: tax,

        totalPrice: orderTotal,
        status: "pending",
        isPaid: false,
        isDelivered: false,
        distributor: cartItems[0]?.distributor, // Assuming all items are from same distributor
      };

      const response = await createOrder(orderData).unwrap();

      dispatch(clearCart());
      setOrderComplete(true);
      toast.success("Order placed successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center transform transition-all duration-300 scale-100 hover:scale-105">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-4">
            Thank you for your purchase. Your order is being processed!
          </p>
          <p className="text-gray-500 mb-8">
            Check your email for order details.
          </p>
          <Link
            to="/dashboard"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-200 transform hover:-translate-y-1"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Your Cart is Empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to proceed with checkout.
          </p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-200"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 pt-5 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-5 text-center tracking-tight">
        Checkout
      </h1>
      <ScrollArea className="h-[calc(100vh-150px)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Summary */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-200 hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">
                  Order Summary
                </h2>
                <div className="space-y-6">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center border-b border-gray-100 pb-4"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={item.images[0]?.url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <h3 className="text-sm font-medium text-gray-800">
                          {item.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">
                        Rs.{(item.discountedPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 pt-4 mt-6 space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Subtotal</p>
                    <p>Rs.{totalPrice.toFixed(2)}</p>
                  </div>

                  <div className="flex justify-between text-sm text-gray-600">
                    <p>Tax (13%)</p>
                    <p>Rs.{tax.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-lg font-semibold text-gray-900 pt-3 border-t border-gray-200">
                    <p>Total</p>
                    <p>Rs.{orderTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Supplier information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label
                        htmlFor="shopName"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Shop Name
                      </label>
                      <input
                        id="shopName"
                        {...register("shopName", {
                          required: "Shop Name is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          errors.shopName ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.shopName && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.shopName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Email Address
                      </label>
                      <input
                        id="email"
                        type="email"
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^\S+@\S+\.\S+$/,
                            message: "Email is invalid",
                          },
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        id="phoneNumber"
                        type="tel"
                        {...register("phoneNumber", {
                          required: "Phone number is required",
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message:
                              "Please enter a valid 10-digit phone number",
                          },
                        })}
                        placeholder="1234567890"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          errors.phoneNumber
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                      />
                      {errors.phoneNumber && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.phoneNumber.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
                    <h2 className="text-xl font-semibold text-gray-800 ">
                      Shipping address
                    </h2>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="address"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Address
                      </label>
                      <input
                        id="address"
                        {...register("address", {
                          required: "Address is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          errors.address ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.address && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.address.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="city"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        City
                      </label>
                      <input
                        id="city"
                        {...register("city", {
                          required: "City is required",
                        })}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                          errors.city ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.city && (
                        <p className="mt-2 text-xs text-red-500">
                          {errors.city.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          State
                        </label>
                        <input
                          id="state"
                          {...register("state", {
                            required: "State is required",
                          })}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                            errors.state ? "border-red-500" : "border-gray-300"
                          }`}
                        />
                        {errors.state && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.state.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          ZIP Code
                        </label>
                        <input
                          id="zipCode"
                          {...register("zipCode", {
                            required: "ZIP code is required",
                          })}
                          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-200 ${
                            errors.zipCode
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        />
                        {errors.zipCode && (
                          <p className="mt-2 text-xs text-red-500">
                            {errors.zipCode.message}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between  mt-10 items-center">
                    <Link
                      to="../cart"
                      className="text-indigo-600 hover:text-indigo-500 font-medium transition-colors duration-200"
                    >
                      Back to Cart
                    </Link>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all duration-200 transform${
                        isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                    >
                      {isSubmitting
                        ? "Processing..."
                        : `Place Order (Rs.${orderTotal.toFixed(2)})`}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Checkout;
