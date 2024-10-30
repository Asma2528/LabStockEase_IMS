const { body, param } = require('express-validator');

class ChemicalsValidation {
    static RegisterChemicals = [
        body('item_name').notEmpty().withMessage('Item name cannot be empty'),
        body('company').notEmpty().withMessage('Company/Brand cannot be empty'),
        body('purpose').optional().isString().withMessage('Purpose must be a string'),
        body('min_stock_level').isInt({ gte: 0 }).withMessage('Minimum stock level must be a non-negative integer'),
        body('unit_of_measure').notEmpty().withMessage('Unit of measure cannot be empty'),
        body('description').optional().isString().withMessage('Description must be a string'),
    ];

    // Validation for updating a restock record and for registering restock
static RestockChemical = [
    body('item_code').optional().isString().withMessage('Item Code must be a string'),
    body('item_name').optional().isString().withMessage('Item Name must be a string'),
    body('chemical_id').optional().isMongoId().withMessage('Invalid Chemical ID'),
    body('quantity_purchased').isInt({ gt: 0 }).withMessage('Quantity purchased must be a positive integer'),
    body('purchase_date').isISO8601().withMessage('Purchase date must be a valid date'),
    body('expiration_date').isISO8601().withMessage('Expiration date must be a valid date'),
    body('supplier').optional().isString().withMessage('Supplier must be a string'),
    body('bill_number').optional().isString().withMessage('Bill number must be a string'),
    body('cost_per_purchase').optional().isFloat({ gt: 0 }).withMessage('Cost per purchase must be a positive number'),
    body('location').optional().isString().withMessage('Location must be a string'),
    body('barcode').optional().isString().withMessage('Barcode must be a string'),
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
        param('id').isMongoId().withMessage('Provide a valid ID')
    ];
}

module.exports = ChemicalsValidation;
