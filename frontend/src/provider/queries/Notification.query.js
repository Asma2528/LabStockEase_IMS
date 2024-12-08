import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const NotificationApi = createApi({
    reducerPath: 'NotificationsApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),

    tagTypes: ['getAllNotifications', 'getNotification'],
    endpoints: (builder) => ({
        // Get all notifications
        getAllNotifications: builder.query({
            query: () => ({
                url: '/notification/get-all',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllNotifications'],
        }),

        // Get a single notification by ID
        getNotificationById: builder.query({
            query: (id) => ({
                url: `/notification/get/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getNotification'],
        }),

        // Create a new notification
        createNotification: builder.mutation({
            query: (notificationData) => ({
                url: '/notification/create',
                method: 'POST',
                body: notificationData,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllNotifications'],
        }),

        // Mark notification as read
        markAsRead: builder.mutation({
            query: (notificationId) => ({
                url: `/notification/mark-read/${notificationId}`,
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getNotification'],
        }),

        // Delete a notification by ID
        deleteNotification: builder.mutation({
            query: (notificationId) => ({
                url: `/notification/delete/${notificationId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllNotifications'],
        }),

        // Delete all notifications for a specific user
        deleteAllNotifications: builder.mutation({
            query: (userId) => ({
                url: `/notification/delete-all/${userId}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            invalidatesTags: ['getAllNotifications'],
        }),

        // Get unread notifications
        getUnreadNotifications: builder.query({
            query: () => ({
                url: '/notification/get-unread',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            }),
            providesTags: ['getAllNotifications'],
        }),
    }),
});

export const {
    useGetAllNotificationsQuery,
    useGetNotificationByIdQuery,
    useCreateNotificationMutation,
    useMarkAsReadMutation,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
    useGetUnreadNotificationsQuery,
} = NotificationApi;
