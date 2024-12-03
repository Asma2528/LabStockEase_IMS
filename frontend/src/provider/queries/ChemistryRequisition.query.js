import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const ChemistryRequisitionApi = createApi({
    reducerPath: 'ChemistryRequisitionApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['ChemistryRequisition', 'UserRequisitions', 'ApprovedRequisitions'],
    endpoints: (builder) => ({
        // Mutation to create a new requisition
        createRequisition: builder.mutation({
            query: (requisitionData) => ({
                url: '/chemistry-requisition/create',
                method: 'POST',
                body: requisitionData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['UserRequisitions'],
        }),
        
        // Query to get all requisitions for a specific user (faculty)
        // ChemistryRequisitionApi.js
getUserRequisitions: builder.query({
    query: (searchParams) => ({
        url: `/chemistry-requisition/user-requisitions`,
        method: 'GET',
        params: searchParams, // Pass searchParams as query parameters
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    }),
    providesTags: ['UserRequisitions'],
}),

        // Mutation to update a requisition by ID
        updateRequisition: builder.mutation({
            query: ({ id, updateData }) => ({
                url: `/chemistry-requisition/update/${id}`,
                method: 'PATCH',
                body:updateData,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['UserRequisitions'],
        }),

        // Mutation to delete a requisition by ID
        deleteRequisition: builder.mutation({
            query: (id) => ({
                url: `/chemistry-requisition/delete/${id}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['UserRequisitions'],
        }),

        // Query to get all requisitions (admin view)
        getAllRequisitions: builder.query({
            query: (searchParams) => ({
                url: '/chemistry-requisition/all-requisitions',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
                params: searchParams, // Pass search parameters to the query
            }),
            providesTags: ['ChemistryRequisition'],
        }),
        

      // Mutation to approve a requisition
approveRequisition: builder.mutation({
    query: ({ id, updateData }) => ({
        url: `/chemistry-requisition/approve/${id}`,
        method: 'PATCH',
        body: updateData, // Ensure this is defined if passing additional data
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
    }),
    invalidatesTags: ['ChemistryRequisition'],
}),
      // Query to get all approved and issued requisitions for chemistry role
      getApprovedAndIssuedRequisitions: builder.query({
        query: (searchParams) => ({
            url: '/chemistry-requisition/approved-requisitions',
            method: 'GET',
            params: searchParams, // Pass search parameters as query parameters
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        }),
        providesTags: ['ApprovedRequisitions'],
    }),

    // Mutation to change the status of a requisition to 'Issued'
    changeStatusToIssued: builder.mutation({
        query: ({ id }) => ({
            url: `/chemistry-requisition/change-status/${id}`,
            method: 'PATCH',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
            },
        }),
        invalidatesTags: ['ApprovedRequisitions'],
    }),
    }),
});

export const {
    useCreateRequisitionMutation,
    useGetUserRequisitionsQuery,
    useUpdateRequisitionMutation,
    useDeleteRequisitionMutation,
    useGetAllRequisitionsQuery,
    useApproveRequisitionMutation,
    useGetApprovedAndIssuedRequisitionsQuery, 
    useChangeStatusToIssuedMutation, 
} = ChemistryRequisitionApi;
