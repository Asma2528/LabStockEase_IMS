const NotificationModel = require("../models/notification.models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");

class NotificationService {
  // Create a new notification
  static async createNotification(notificationData) {
    const newNotification = await NotificationModel.create(notificationData);
    return newNotification;
  }

  // Get all notifications with optional filters
  static async getAllNotifications(filters = {}) {
    const query = {};

    if (filters.userId) {
      query.userId = filters.userId;
    }
    if (filters.type) {
      query.type = filters.type; // Filter by notification type
    }
    if (filters.isRead !== undefined) {
      query.isRead = filters.isRead; // Filter by read/unread status
    }
    if (filters.createdAt) {
      query.createdAt = {
        $gte: new Date(new Date(filters.createdAt).setHours(0, 0, 0)),
        $lt: new Date(new Date(filters.createdAt).setHours(23, 59, 59)),
      };
    }

    const notifications = await NotificationModel.find(query).sort({
      createdAt: -1,
    });
    return notifications;
  }

  // Get a single notification by ID
  static async getNotificationById(notificationId) {
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
    }
    return notification;
  }

  // Mark a notification as read
  static async markAsRead(notificationId) {
    const notification = await NotificationModel.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Notification not found or cannot be updated"
      );
    }

    return notification;
  }


  // Delete a single notification by ID
  static async deleteNotification(notificationId) {
    const notification = await NotificationModel.findByIdAndDelete(
      notificationId
    );

    if (!notification) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Notification not found or cannot be deleted"
      );
    }

    return notification;
  }

  // Update a notification by ID
  static async updateNotificationById(id, updates) {
    const updatedNotification = await NotificationModel.findByIdAndUpdate(
      id,
      updates,
      {
        new: true, // Return the updated document
        runValidators: true, // Run schema validators on the updates
      }
    );

    return updatedNotification;
  }

  // Delete all notifications for a specific user
  static async deleteAllNotifications(userId) {
    const result = await NotificationModel.deleteMany({ userId });
    return result;
  }

// Get all unread notifications (no userId required)
static async getUnreadNotifications() {
    const unreadNotifications = await NotificationModel.find({
      isRead: false,  // Filter for unread notifications
    }).sort({ createdAt: -1 });  // Optionally sort by creation date, newest first
  
    return unreadNotifications;
  }
  
  
}

module.exports = NotificationService;
