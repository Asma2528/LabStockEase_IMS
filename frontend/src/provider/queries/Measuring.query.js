import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const MeasuringApi = createApi({
    reducerPath: 'MeasuringApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllMeasuringItems', 'getMeasuringItem'],
    endpoints: (builder) => ({
        addMeasuringItem: builder.mutation({
            query: (item) => ({
                url: '/measuring/register', // Updated to match backend route
                method: 'POST',
                body: item,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllMeasuringItems']
        }),
        getAllMeasuringItems: builder.query({
            query: (obj) => ({
                url: `/measuring/get-all?query=${obj.query}`, // Removed pagination parameters
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllMeasuringItems'],
        }),
        getForSearchMeasuringItem: builder.query({
            query: () => ({
                url: `/measuring/get-search`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            providesTags: ['getAllMeasuringItems']
        }),
        deleteMeasuringItem: builder.mutation({
            query: (id) => ({
                url: `/measuring/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllMeasuringItems'],
        }),
        getMeasuringItem: builder.query({
            query: (id) => ({
                url: `/measuring/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getMeasuringItem'],
        }),
        updateMeasuringItem: builder.mutation({
            query: ({ data,id }) => ({
                url: `/measuring/update/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllMeasuringItems', 'getMeasuringItem'],
        }),
    }),
});

export const {
    useAddMeasuringItemMutation,
    useGetAllMeasuringItemsQuery,
    useDeleteMeasuringItemMutation,
    useGetMeasuringItemQuery,
    useUpdateMeasuringItemMutation,
    useGetForSearchMeasuringItemQuery
} = MeasuringApi;
