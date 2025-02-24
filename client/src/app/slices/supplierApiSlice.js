import { supplier_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const supplierApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addSupplier: builder.mutation({
      query: (data) => ({
        url: `${supplier_url}/add-distributor`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    editSupplier: builder.mutation({
      query: (data) => ({
        url: `${supplier_url}/${data.id}`,
        method: "PUT",
        credentials: "include",
        body:data,
      }),
    }),
    getAllSupplier: builder.query({
      query: (data) => ({
        url: `${supplier_url}/`,
        method: "GET",
        body: data,
        credentials: 'include'
      }),
    }),
    getDistributorProfile : builder.query({
      query: () => ({
        url: `${supplier_url}/distributor-profile`,
        method: "GET",
        credentials: 'include'
      }),
    }),
    getSingleSupplier: builder.query({
      query: ( id) => ({
        url: `${supplier_url}/${id}`,
        method: "GET",
        credentials: 'include'
      }),
    }),
  }),
});

export const {
  useAddSupplierMutation,
  useGetAllSupplierQuery,
  useGetSingleSupplierQuery,
  useEditSupplierMutation,
  useGetDistributorProfileQuery
} = supplierApiSlice;
