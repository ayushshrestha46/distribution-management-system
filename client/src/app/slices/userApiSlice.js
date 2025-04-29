import { user_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${user_url}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${user_url}/register`,
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `${user_url}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),

    activate: builder.mutation({
      query: (data) => ({
        url: `${user_url}/activate`,
        method: "POST",
        body: data,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `${user_url}/logout`,
        method: "POST",
        credentials: "include",
      }),
    }),

    requestDistributor: builder.mutation({
      query: () => ({
        url: `${user_url}/request-distributor`,
        method: "PUT",
        credentials: "include",
      }),
    }),

    getUserProfile: builder.query({
      query: () => ({
        url: `${user_url}/get-profile`,
        method: "GET",
        credentials: "include",
      }),
    }),

    getSuppliers: builder.query({
      query: () => ({
        url: `${user_url}/view-supplier`,
        method: "GET",
        credentials: "include",
      }),
    }),

    updateUserProfile: builder.mutation({
      query: (data) => ({
        url: `${user_url}/update-profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),


  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useActivateMutation,
  useLogoutMutation,
  useChangePasswordMutation,
  useRequestDistributorMutation,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetSuppliersQuery
} = userApiSlice;
