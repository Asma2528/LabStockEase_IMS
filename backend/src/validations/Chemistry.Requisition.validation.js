const { body, param } = require('express-validator');

class ChemistryRequisitionValidation {
    static CreateRequisition = [
        body('item_name')
            .notEmpty().withMessage('Item name cannot be empty')
            .isString().withMessage('Item name must be a string'),
        body('quantity_required')
            .isInt({ gt: 0 }).withMessage('Quantity required must be a positive integer')
            .notEmpty().withMessage('Quantity required is mandatory'),
        body('date_of_requirement')
            .isISO8601().withMessage('Date of requirement must be a valid date')
            .notEmpty().withMessage('Date of requirement is mandatory'),
        body('purpose')
            .notEmpty().withMessage('Purpose cannot be empty')
            .isString().withMessage('Purpose must be a string')
        // Removed faculty_email validation as it will be set in the controller
    ];

    static UpdateRequisition = [
        param('id')
            .isMongoId().withMessage('Provide a valid Requisition ID'),
        body('item_name')
            .optional()
            .isString().withMessage('Item name must be a string'),
        body('quantity_required')
            .optional()
            .isInt({ gt: 0 }).withMessage('Quantity required must be a positive integer'),
        body('date_of_requirement')
            .optional()
            .isISO8601().withMessage('Date of requirement must be a valid date'),
        body('purpose')
            .optional()
            .isString().withMessage('Purpose must be a string')
    ];

    static ApproveRequisition = [
        param('id')
            .isMongoId().withMessage('Provide a valid Requisition ID')
    ];

    static Params_id = [
        param('id')
            .isMongoId().withMessage('Provide a valid ID')
    ];
}

module.exports = ChemistryRequisitionValidation;
