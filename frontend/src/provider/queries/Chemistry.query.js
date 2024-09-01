import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ChemistryApi = createApi({
    reducerPath: 'ChemistryApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllChemistryItems', 'getChemistryItem'],
    endpoints: (builder) => ({
        addChemistryItem: builder.mutation({
            query: (item) => ({
                url: '/chemistry/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemistryItems'],
        }),
        getAllChemistryItems: builder.query({
            query: (obj) => ({
                url: `/chemistry/get-all?query=${obj.query}&page=${obj.page}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
        
            providesTags: ['getAllChemistryItems'],
        }),
       getForSearchChemistryItem: builder.query({
            // query: (obj) => ({
                query: () => ({
                url: `/chemistry/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllChemistryItems']
        }),
        deleteChemistryItem: builder.mutation({
            query: (id) => ({
                url: `/chemistry/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemistryItems'],
        }),
       getChemistryItem: builder.query({
            query: (id) => ({
                url: `/chemistry/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getChemistryItem'],
        }),
        updateChemistryItem: builder.mutation({
            query: ({ id, data }) => ({
                url: `/chemistry/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllChemistryItems', 'getChemistryItem'],
        }),
    }),
});

export const {
    useAddChemistryItemMutation,
    useGetAllChemistryItemsQuery,
    useDeleteChemistryItemMutation,
    useGetChemistryItemQuery,
    useUpdateChemistryItemMutation,
    useGetForSearchChemistryItemQuery
} = ChemistryApi;
