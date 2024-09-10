const { body, param } = require('express-validator');

class MeasuringValidation {
    static RegisterMeasuring = [
        body('item_name').notEmpty().withMessage('Item name cannot be empty'),
        body('company').notEmpty().withMessage('Company/Brand cannot be empty'),
        body('purpose').optional().isString().withMessage('Purpose must be a string'),
        body('BillNo').notEmpty().withMessage('Bill No cannot be empty'),
        body('total_quantity').isInt({ gt: 0 }).withMessage('Total quantity must be a positive integer'),
        body('issued_quantity').isInt({ gte: 0 }).withMessage('Issued quantity must be a non-negative integer'),
        body('current_quantity').isInt({ gte: 0 }).withMessage('Current quantity must be a non-negative integer'),
        body('min_stock_level').isInt({ gt: 0 }).withMessage('Minimum stock level must be a positive integer'),
        body('unit_of_measure').notEmpty().withMessage('Unit of measure cannot be empty'),
        body('location').notEmpty().withMessage('Location cannot be empty'),
        body('status').optional().isString().withMessage('Status must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('barcode').optional().isString().withMessage('Barcode must be a string'),
        body('low_stock_alert').isBoolean().withMessage('Low stock alert must be a boolean'),
    ];

    static Params_id = [
        param('id').isMongoId().withMessage('Provide a valid ID').notEmpty().withMessage('ID is required')
    ];
}

module.exports = MeasuringValidation;
