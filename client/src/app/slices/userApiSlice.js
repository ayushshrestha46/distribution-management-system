import { user_url } from "../constants";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${user_url}/login`,
        method: "POST",
        body: data,
        credentials: 'include'
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: `${user_url}/register`,
        method: "POST",
        body: data,
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
        credentials: 'include'
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useActivateMutation, useLogoutMutation } =
  userApiSlice;