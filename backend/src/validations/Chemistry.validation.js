const { body, param, query } = require('express-validator');

class ChemistryValidation {
    static RegisterChemistry = [
        body('item_name').notEmpty().withMessage('Item name cannot be empty'),
        body('company').notEmpty().withMessage('Company/Brand cannot be empty'),
        body('purpose').optional().isString().withMessage('Purpose must be a string'),
        body('BillNo').notEmpty().withMessage('Bill No cannot be empty'),
        body('total_quantity').isInt({ gt: 0 }).withMessage('Total quantity must be a positive integer').notEmpty().withMessage('Total quantity cannot be empty'),
        body('issued_quantity').isInt({ gt: -1 }).withMessage('Issued quantity must be a positive integer').notEmpty().withMessage('Issued quantity cannot be empty'),
        body('current_quantity').isInt({ gt: 0 }).withMessage('Current quantity must be a positive integer').notEmpty().withMessage('Current quantity cannot be empty'),
        body('min_stock_level').isInt({ gt: 0 }).withMessage('Minimum stock level must be a positive integer').notEmpty().withMessage('Minimum stock level cannot be empty'),
        body('unit_of_measure').notEmpty().withMessage('Unit of measure cannot be empty'),
        body('expiration_date').isISO8601().withMessage('Expiration date must be a valid date').notEmpty().withMessage('Expiration date cannot be empty'),
        body('location').notEmpty().withMessage('Location cannot be empty'),
        body('status').optional().isString().withMessage('Status must be a string'),
        body('description').optional().isString().withMessage('Description must be a string'),
        body('barcode').optional().isString().withMessage('Barcode must be a string'),
        body('low_stock_alert').isBoolean().withMessage('Low stock alert must be a boolean'),
        body('expiration_alert_date').isISO8601().withMessage('Expiration alert date must be a valid date').notEmpty().withMessage('Expiration alert date cannot be empty')
    ];

    static Params_id = [
        param('id').isMongoId().withMessage('Provide a valid ID').notEmpty().withMessage('ID is required')
    ];


}

module.exports = ChemistryValidation;
