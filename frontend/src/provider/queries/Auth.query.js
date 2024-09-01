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
    }),
});

export const { useRegisterUserMutation, useLoginUserMutation } = AuthApi;
