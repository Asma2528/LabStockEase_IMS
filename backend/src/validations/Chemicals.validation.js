const { body, param } = require('express-validator');

class ChemicalsValidation {
    static RegisterChemicals = [
        body('item_code')
        .optional().isString().withMessage('Item Code must be a string'),
        body('item_name')
            .notEmpty().withMessage('Item name cannot be empty'),
        body('company')
            .notEmpty().withMessage('Company/Brand cannot be empty'),
        body('purpose')
            .optional().isString().withMessage('Purpose must be a string'),
        body('BillNo')
            .notEmpty().withMessage('Bill No cannot be empty'),
        body('total_quantity')
            .isInt({ gte: 0 }).withMessage('Total quantity must be a non-negative integer'),
        body('current_quantity')
            .isInt({ gte: 0 }).withMessage('Current quantity must be a non-negative integer'),
        body('min_stock_level')
            .isInt({ gte: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
        body('unit_of_measure')
            .notEmpty().withMessage('Unit of measure cannot be empty'),
        body('expiration_date')
            .isISO8601().withMessage('Expiration date must be a valid date'),
        body('location')
            .notEmpty().withMessage('Location cannot be empty'),
        body('status')
            .isString().withMessage('Status must be a string'),
        body('description')
            .optional().isString().withMessage('Description must be a string'),
        body('barcode')
            .notEmpty().withMessage('Barcode cannot be empty').isString().withMessage('Barcode must be a string'),
        body('low_stock_alert')
            .isBoolean().withMessage('Low stock alert must be a boolean'),
        body('expiration_alert_date')
            .isISO8601().withMessage('Expiration alert date must be a valid date')
    ];


    static LogIssuedQuantity = [
        body('item_id')
            .isMongoId().withMessage('Item ID must be a valid MongoDB ID')
            .notEmpty().withMessage('Item ID is required'),
        body('issued_quantity')
            .isInt({ gte: 0 }).withMessage('Issued quantity must be a non-negative integer')
            .notEmpty().withMessage('Issued quantity is required'),
        body('date_issued')
            .isISO8601().withMessage('Issued date must be a valid date')
    ];


    static Params_id = [
        param('id')
            .isMongoId().withMessage('Provide a valid ID')
            .notEmpty().withMessage('ID is required')
    ];
}

module.exports = ChemicalsValidation;
