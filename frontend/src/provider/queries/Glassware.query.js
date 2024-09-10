import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const GlasswareApi = createApi({
    reducerPath: 'GlasswareApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllGlasswareItems', 'getGlasswareItem'],
    endpoints: (builder) => ({
        addGlasswareItem: builder.mutation({
            query: (item) => ({
                url: '/glassware/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllGlasswareItems']
        }),
        getAllGlasswareItems: builder.query({
            query: (obj) => ({
                url: `/glassware/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllGlasswareItems'],
        }),
        getForSearchGlasswareItem: builder.query({
            query: () => ({
                url: `/glassware/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllGlasswareItems']
        }),
        deleteGlasswareItem: builder.mutation({
            query: (id) => ({
                url: `/glassware/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllGlasswareItems'],
        }),
        getGlasswareItem: builder.query({
            query: (id) => ({
                url: `/glassware/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getGlasswareItem'],
        }),
        updateGlasswareItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/glassware/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllGlasswareItems', 'getGlasswareItem'],
        }),
    }),
});

export const {
    useAddGlasswareItemMutation,
    useGetAllGlasswareItemsQuery,
    useDeleteGlasswareItemMutation,
    useGetGlasswareItemQuery,
    useUpdateGlasswareItemMutation,
    useGetForSearchGlasswareItemQuery
} = GlasswareApi;
