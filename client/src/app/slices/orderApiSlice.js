import { order_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (data) => ({
        url: `${order_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    getOrdersShop: builder.query({
      query: () => ({
        url: `${order_url}/get-orders/shop`,
        method: "GET",
        credentials: "include",
      }),
    }),
    generateBiil: builder.query({
      query: (Id) => ({
        url: `${order_url}/generateBill/${Id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getOrdersDistributor: builder.query({
      query: (data) => ({
        url: `${order_url}/get-orders/distributor`,
        method: "GET",
        body: data,
        credentials: "include",
      }),
    }),

    deliverOrder: builder.mutation({
      query: (Id) => ({
        url: `${order_url}/delivered-order/${Id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    acceptOrder: builder.mutation({
      query: (Id) => ({
        url: `${order_url}/accept-order/${Id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    rejectOrder: builder.mutation({
      query: (Id) => ({
        url: `${order_url}/reject-order/${Id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    cashPayment: builder.mutation({
      query: (id) => ({
        url: `${order_url}/cash-payment/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    initiatePayment: builder.mutation({
      query: (data) => ({
        url: `${order_url}/initiate-payment`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    completePayment: builder.mutation({
      query: ({ pidx, orderId }) => ({
        url: `${order_url}/complete-payment?pidx=${pidx}`,
        method: "PUT",
        body: { orderId },
        credentials: "include",
      }),
    }),
    
  }),
});

export const {
  useCreateOrderMutation,
  useGetOrdersShopQuery,
  useGetOrdersDistributorQuery,
  useAcceptOrderMutation,
  useDeliverOrderMutation,
  useRejectOrderMutation,
  useGenerateBiilQuery,
  useInitiatePaymentMutation,
  useCompletePaymentMutation,
  useCashPaymentMutation,
} = productApiSlice;
