import { product_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (data) => ({
        url: `${product_url}/`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    editProduct: builder.mutation({
      query: (data) => ({
        url: `${product_url}/${data.id}`,
        method: "PUT",
        credentials: "include",
        body:data,
      }),
    }),
    getAllProduct: builder.query({
      query: (data) => ({
        url: `${product_url}/`,
        method: "GET",
        body: data,
        credentials: 'include'
      }),
    }),
    getSingleProduct: builder.query({
      query: ( id) => ({
        url: `${product_url}/${id}`,
        method: "GET",
        credentials: 'include'
      }),
    }),
  }),
});

export const {
useAddProductMutation,
useEditProductMutation,
useGetAllProductQuery,
useGetSingleProductQuery
} = productApiSlice;
