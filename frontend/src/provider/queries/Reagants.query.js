import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ReagantsApi = createApi({
    reducerPath: 'ReagantsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllReagantsItems', 'getReagantsItem'],
    endpoints: (builder) => ({
        addReagantsItem: builder.mutation({
            query: (item) => ({
                url: '/reagants/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagantsItems']
        }),
        getAllReagantsItems: builder.query({
            query: (obj) => ({
                url: `/reagants/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllReagantsItems'],
        }),
        getForSearchReagantsItem: builder.query({
            query: () => ({
                url: `/reagants/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllReagantsItems']
        }),
        deleteReagantsItem: builder.mutation({
            query: (id) => ({
                url: `/reagants/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagantsItems'],
        }),
        getReagantsItem: builder.query({
            query: (id) => ({
                url: `/reagants/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getReagantsItem'],
        }),
        updateReagantsItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/reagants/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagantsItems', 'getReagantsItem'],
        }),
    }),
});

export const {
    useAddReagantsItemMutation,
    useGetAllReagantsItemsQuery,
    useDeleteReagantsItemMutation,
    useGetReagantsItemQuery,
    useUpdateReagantsItemMutation,
    useGetForSearchReagantsItemQuery
} = ReagantsApi;
