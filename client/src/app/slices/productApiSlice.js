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
    addDiscount: builder.mutation({
      query: (data) => ({
        url: `${product_url}/add-discount/${data.id}`,
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
        body: data,
      }),
    }),

    getSingleProduct: builder.query({
      query: (id) => ({
        url: `${product_url}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getProducts: builder.query({
      query: () => ({
        url: `${product_url}/products-list`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getDistributorProducts: builder.query({
      query: () => ({
        url: `${product_url}/distributor-products`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateStockQuantity: builder.mutation({
      query: (data) => ({
        url: `${product_url}/updateStock/${data.id}`,
        method: "PATCH",
        credentials: "include",
        body: { quantity: data.quantity },
      }),
    }),
  }),
});

export const {
  useAddProductMutation,
  useEditProductMutation,
  useGetSingleProductQuery,
  useGetProductsQuery,
  useGetDistributorProductsQuery,
  useUpdateStockQuantityMutation,
  useAddDiscountMutation,
} = productApiSlice;
