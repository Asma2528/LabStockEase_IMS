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
        logIssuedQuantity: builder.mutation({
            query: (logData) => ({
                url: '/reagents/register-log',  // Assuming this is the endpoint for logging issued quantity
                method: 'POST',
                body: logData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getReagentsItem', 'logIssuedQuantity','getAllReagentsItems','searchReagentsLogs','getReagentsLogs'], // Invalidating tags to refetch relevant data
        }),
        getReagentsLogs: builder.query({
            query: () => ({
                url: `/reagents/get-all-logs`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllReagentsItems', 'getReagentsLogs'] 
        }),
        
        searchReagentsLogs: builder.query({
            query: (searchParams = {}) => {
                const { item_id, user_email, date_start, date_end } = searchParams;
                const params = new URLSearchParams();
        
                if (item_id) params.append('item_id', item_id);
                if (user_email) params.append('user_email', user_email);
                if (date_start) params.append('date_start', date_start);
                if (date_end) params.append('date_end', date_end);
        
                return {
                    url: `/reagents/get-search-log?${params.toString()}`,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                };
            },
            providesTags: ['getReagentsLogs'],
        }),
        
        
        updateLog: builder.mutation({
            query: ({ logId, logData }) => ({
                url: `/reagents/update-log/${logId}`, // Adjust according to your backend route
                method: 'PATCH',
                body: logData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getReagentsLogs','getAllReagentsItems'], // Invalidate logs to refetch after updating
        }),
        deleteReagentsLog: builder.mutation({
            query: (logId) => ({
                url: `/reagents/delete-log/${logId}`, // Adjust the endpoint as per your backend route
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getReagentsLogs', 'getAllReagentsItems'], // Invalidate logs to refetch after deletion
        }),
        
    }),
});

export const {
    useAddReagentsItemMutation,
    useGetAllReagentsItemsQuery,
    useDeleteReagentsItemMutation,
    useGetReagentsItemQuery,
    useUpdateReagentsItemMutation,
    useGetForSearchReagentsItemQuery,
    useLogIssuedQuantityMutation,
    useGetReagentsLogsQuery,
    useSearchReagentsLogsQuery, 
    useUpdateLogMutation,
    useDeleteReagentsLogMutation
} = ReagentsApi;
