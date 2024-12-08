const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const NotificationService = require("../services/Notification.service");

class NotificationController {
  // Create a new notification
  static RegisterNotification = CatchAsync(async (req, res) => {
    const notificationData = req.body;
    const notification = await NotificationService.createNotification(notificationData);
    return res.status(httpStatus.CREATED).json(notification);
  });

  // Get all notifications with optional filters
  static GetAllNotifications = CatchAsync(async (req, res) => {
    const filters = {
      userId: req.query.userId,
      type: req.query.type,
      isRead: req.query.isRead,
    };
    const notifications = await NotificationService.getAllNotifications(filters);
    return res.status(httpStatus.OK).json(notifications);
  });

  // Get a single notification by ID
  static GetNotificationById = CatchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const notification = await NotificationService.getNotificationById(id);
    if (!notification) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Notification not found" });
    }

    return res.status(httpStatus.OK).json(notification);
  });

  // Update a notification by ID
  static UpdateNotificationById = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!id || id.length !== 24) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const updatedNotification = await NotificationService.updateNotificationById(id, updates);

    if (!updatedNotification) {
      return res.status(httpStatus.NOT_FOUND).json({ message: "Notification not found" });
    }

    return res.status(httpStatus.OK).json(updatedNotification);
  });

  // Delete a notification by ID
  static DeleteNotification = CatchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    await NotificationService.deleteNotification(id);
    return res.status(httpStatus.OK).json({ message: "Notification deleted successfully" });
  });

  // Mark a notification as read
  static MarkAsRead = CatchAsync(async (req, res) => {
    const { id } = req.params;

    if (!id || id.length !== 24) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
    }

    const updatedNotification = await NotificationService.markAsRead(id);
    return res.status(httpStatus.OK).json(updatedNotification);
  });


// Get all unread notifications (no userId required)
static GetUnreadNotifications = CatchAsync(async (req, res) => {
    const unreadNotifications = await NotificationService.getUnreadNotifications();
    return res.status(httpStatus.OK).json({ unreadNotifications });
  });
}

module.exports = NotificationController;
