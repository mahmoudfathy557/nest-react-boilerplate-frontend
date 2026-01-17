import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  authResponseSchema,
  type AuthResponse,
  type SignInInput,
  type SignUpInput,
} from "./authSchemas";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signUp: builder.mutation<AuthResponse, SignUpInput>({
      query: (credentials) => ({
        url: "/auth/signup",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => {
        // Validate response with Zod
        return authResponseSchema.parse(response);
      },
      invalidatesTags: ["Auth"],
    }),
    signIn: builder.mutation<AuthResponse, SignInInput>({
      query: (credentials) => ({
        url: "/auth/signin",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: unknown) => {
        // Validate response with Zod
        return authResponseSchema.parse(response);
      },
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useSignUpMutation, useSignInMutation } = authApi;
