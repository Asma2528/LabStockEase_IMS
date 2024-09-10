import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const OthersApi = createApi({
    reducerPath: 'OthersApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllOthersItems', 'getOthersItem'],
    endpoints: (builder) => ({
        addOthersItem: builder.mutation({
            query: (item) => ({
                url: 'others/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllOthersItems']
        }),
        getAllOthersItems: builder.query({
            query: (obj) => ({
                url: `/others/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllOthersItems'],
        }),
        getForSearchOthersItem: builder.query({
            query: () => ({
                url: `/others/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllOthersItems']
        }),
        deleteOthersItem: builder.mutation({
            query: (id) => ({
                url: `/others/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllOthersItems'],
        }),
        getOthersItem: builder.query({
            query: (id) => ({
                url: `/others/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getOthersItem'],
        }),
        updateOthersItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/others/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllOthersItems', 'getOthersItem'],
        }),
    }),
});

export const {
    useAddOthersItemMutation,
    useGetAllOthersItemsQuery,
    useDeleteOthersItemMutation,
    useGetOthersItemQuery,
    useUpdateOthersItemMutation,
    useGetForSearchOthersItemQuery
} = OthersApi;
