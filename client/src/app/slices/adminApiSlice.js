import { admin_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const supplierApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    allocateDistrubitor: builder.mutation({
      query: ({ selectedSupplier: distributorId, userId }) => ({
        url: `${admin_url}/allocate-distributor`,
        method: "PUT",
        body: { distributorId, userId },
        credentials: "include",
      }),
    }),

    getAllocationRequest: builder.query({
      query: () => ({
        url: `${admin_url}/allocation-request`,
        method: "GET",
        credentials: "include",
      }),
    }),
    getDistributorProfile: builder.query({
      query: () => ({
        url: `${admin_url}/distributor-profile`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getSingleSupplier: builder.query({
      query: (id) => ({
        url: `${admin_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getAllOrdersAdmin: builder.query({
      query: () => ({
        url: `${admin_url}/all-orders`,
        method: "GET",
        credentials: "include",
      }),
    }),

    allProducts: builder.query({
      query: () => ({
        url: `${admin_url}/all-products`,
        method: "GET",
        credentials: "include",
      }),
    }),

    allCustomers: builder.query({
      query: () => ({
        url: `${admin_url}/all-customers`,
        method: "GET",
        credentials: "include",
      }),
    }),

    ban: builder.mutation({
      query: (id) => ({
        url: `${admin_url}/ban/${id}`,
        method: "PUT",
        credentials: "include",
      }),
    }),
    addCustomers: builder.mutation({
      query: (data) => ({
        url: `${admin_url}/add-customer`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

export const {
  useAllocateDistrubitorMutation,
  useGetAllocationRequestQuery,
  useGetAllOrdersAdminQuery,
  useAllProductsQuery,
  useAllCustomersQuery,
  useBanMutation,
  useAddCustomersMutation,
} = supplierApiSlice;
