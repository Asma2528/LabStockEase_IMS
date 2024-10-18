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
            logIssuedQuantity: builder.mutation({
                query: (logData) => ({
                    url: '/chemicals/register-log',  // Assuming this is the endpoint for logging issued quantity
                    method: 'POST',
                    body: logData,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                invalidatesTags: ['getChemicalsItem', 'logIssuedQuantity','getAllChemicalsItems','searchChemicalsLogs','getChemicalsLogs'], // Invalidating tags to refetch relevant data
            }),
            getChemicalsLogs: builder.query({
                query: () => ({
                    url: `/chemicals/get-all-logs`,
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                invalidatesTags: ['getAllChemicalsItems', 'getChemicalsLogs'] 
            }),
            
            searchChemicalsLogs: builder.query({
                query: (searchParams = {}) => {
                    const { item_id, user_email, date_start, date_end } = searchParams;
                    const params = new URLSearchParams();
            
                    if (item_id) params.append('item_id', item_id);
                    if (user_email) params.append('user_email', user_email);
                    if (date_start) params.append('date_start', date_start);
                    if (date_end) params.append('date_end', date_end);
            
                    return {
                        url: `/chemicals/get-search-log?${params.toString()}`,
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        },
                    };
                },
                providesTags: ['getChemicalsLogs'],
            }),
            
            
            updateLog: builder.mutation({
                query: ({ logId, logData }) => ({
                    url: `/chemicals/update-log/${logId}`, // Adjust according to your backend route
                    method: 'PATCH',
                    body: logData,
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                invalidatesTags: ['getChemicalsLogs','getAllChemicalsItems'], // Invalidate logs to refetch after updating
            }),
            deleteChemicalsLog: builder.mutation({
                query: (logId) => ({
                    url: `/chemicals/delete-log/${logId}`, // Adjust the endpoint as per your backend route
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                }),
                invalidatesTags: ['getChemicalsLogs', 'getAllChemicalsItems'], // Invalidate logs to refetch after deletion
            }),
            
        }),
    });

    export const {
        useAddChemicalsItemMutation,
        useGetAllChemicalsItemsQuery,
        useDeleteChemicalsItemMutation,
        useGetChemicalsItemQuery,
        useUpdateChemicalsItemMutation,
        useGetForSearchChemicalsItemQuery,
        useLogIssuedQuantityMutation,
        useGetChemicalsLogsQuery,
        useSearchChemicalsLogsQuery, 
        useUpdateLogMutation,
        useDeleteChemicalsLogMutation
    } = ChemicalsApi;
