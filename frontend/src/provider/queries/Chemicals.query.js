import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ChemicalsApi = createApi({
    reducerPath: 'ChemicalsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllChemicalsItems', 'getChemicalsItem'],
    endpoints: (builder) => ({
        addChemicalsItem: builder.mutation({
            query: (item) => ({
                url: '/chemicals/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemicalsItems']
        }),
        getAllChemicalsItems: builder.query({
            query: (obj) => ({
                url: `/chemicals/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllChemicalsItems'],
        }),
        getForSearchChemicalsItem: builder.query({
            query: () => ({
                url: `/chemicals/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllChemicalsItems']
        }),
        deleteChemicalsItem: builder.mutation({
            query: (id) => ({
                url: `/chemicals/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemicalsItems'],
        }),
        getChemicalsItem: builder.query({
            query: (id) => ({
                url: `/chemicals/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getChemicalsItem'],
        }),
        updateChemicalsItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/chemicals/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemicalsItems', 'getChemicalsItem'],
        }),
    }),
});

export const {
    useAddChemicalsItemMutation,
    useGetAllChemicalsItemsQuery,
    useDeleteChemicalsItemMutation,
    useGetChemicalsItemQuery,
    useUpdateChemicalsItemMutation,
    useGetForSearchChemicalsItemQuery
} = ChemicalsApi;
