import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ReagentsApi = createApi({
    reducerPath: 'ReagentsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllReagentsItems', 'getReagentsItem'],
    endpoints: (builder) => ({
        addReagentsItem: builder.mutation({
            query: (item) => ({
                url: '/reagents/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagentsItems']
        }),
        getAllReagentsItems: builder.query({
            query: (obj) => ({
                url: `/reagents/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllReagentsItems'],
        }),
        getForSearchReagentsItem: builder.query({
            query: () => ({
                url: `/reagents/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllReagentsItems']
        }),
        deleteReagentsItem: builder.mutation({
            query: (id) => ({
                url: `/reagents/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagentsItems'],
        }),
        getReagentsItem: builder.query({
            query: (id) => ({
                url: `/reagents/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getReagentsItem'],
        }),
        updateReagentsItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/reagents/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagentsItems', 'getReagentsItem'],
        }),
    }),
});

export const {
    useAddReagentsItemMutation,
    useGetAllReagentsItemsQuery,
    useDeleteReagentsItemMutation,
    useGetReagentsItemQuery,
    useUpdateReagentsItemMutation,
    useGetForSearchReagentsItemQuery
} = ReagentsApi;