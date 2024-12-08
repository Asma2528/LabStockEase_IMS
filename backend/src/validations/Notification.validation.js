const { body, param } = require('express-validator');

class NotificationValidation {
    static RegisterNotification = [
        body('title')
            .notEmpty().withMessage('Title is required')
            .isString().withMessage('Title must be a string'),
        body('message')
            .notEmpty().withMessage('Message is required')
            .isString().withMessage('Message must be a string'),
        body('userId')
            .notEmpty().withMessage('User ID is required')
            .isMongoId().withMessage('User ID must be a valid MongoDB Object ID'),
        body('type')
            .optional()
            .isString().withMessage('Type must be a string')
            .isIn(['low_stock', 'expiration', 'custom']).withMessage('Type must be one of: low_stock, expiration, custom'),
        body('isRead')
            .optional()
            .isBoolean().withMessage('isRead must be a boolean')
    ];

    static UpdateNotification = [
        param('id')
            .isMongoId().withMessage('Provide a valid Notification ID'),
        body('title')
            .optional()
            .isString().withMessage('Title must be a string'),
        body('message')
            .optional()
            .isString().withMessage('Message must be a string'),
        body('type')
            .optional()
            .isString().withMessage('Type must be a string')
            .isIn(['low_stock', 'expiration', 'custom']).withMessage('Type must be one of: low_stock, expiration, custom'),
        body('isRead')
            .optional()
            .isBoolean().withMessage('isRead must be a boolean')
    ];

    static Params_id = [
        param('id')
            .isMongoId().withMessage('Provide a valid ID')
    ];
}

module.exports = NotificationValidation;
