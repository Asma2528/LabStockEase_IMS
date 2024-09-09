import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (obj) => ({
                url: '/auth/register',
                method: 'POST',
                body: obj,
            }),
        }),
        loginUser: builder.mutation({
            query: (obj) => ({
                url: '/auth/login',
                method: 'POST',
                body: obj,
            }),
        }),
        forgotPassword: builder.mutation({
            query: (obj) => ({
                url: '/auth/forgot-password',
                method: 'POST',
                body: obj,
            }),
        }),
        resetPassword: builder.mutation({
            query: ({ token, password }) => ({
                url: `auth/forgot-password/reset-password/${token}`,
                method: 'POST',
                body: { password },
            }),
        }),
    }),
});

export const { 
    useRegisterUserMutation, 
    useLoginUserMutation, 
    useForgotPasswordMutation,
    useResetPasswordMutation 
} = AuthApi;
