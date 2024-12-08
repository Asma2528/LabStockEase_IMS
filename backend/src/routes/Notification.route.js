const express = require("express");
const Authentication = require("../middlewares/Authentication");
const NotificationController = require("../controllers/NotificationController");
const NotificationValidation = require("../validations/Notification.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all notifications
router.get("/get-all", NotificationController.GetAllNotifications);

// Route to register a new notification
router.post(
  "/register", 
  NotificationValidation.RegisterNotification, 
  Validation, 
  NotificationController.RegisterNotification
);

// Route to get a notification by its ID
router.get(
  "/get/:id", 
  NotificationValidation.Params_id, 
  Validation, 
  NotificationController.GetNotificationById
);

// Route to update a notification by its ID
router.patch(
  "/update/:id", 
  NotificationValidation.UpdateNotification, 
  Validation, 
  NotificationController.UpdateNotificationById
);

// Route to delete a notification by its ID
router.delete(
  "/delete/:id", 
  NotificationValidation.Params_id, 
  Validation, 
  NotificationController.DeleteNotification
);

// Route to mark a notification as read
router.patch(
  "/mark-as-read/:id",
  NotificationValidation.Params_id,
  Validation,
  NotificationController.MarkAsRead
);



// Route to get all unread notifications
router.get(
    "/unread-notifications",
    NotificationController.GetUnreadNotifications
  );

module.exports = router;
