const mongoose = require("mongoose");

const chemicalsSchema = new mongoose.Schema({
    item_code: {
        type: String,
        trim: true,
        unique: true 
    },
    item_name: {
        type: String,
        required: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    purpose: {
        type: String,
        trim: true
    },
    BillNo: {
        type: String,
        required: true,
        trim: true
    },
    total_quantity: {
        type: Number,
        required: true,
        min: 0
    },
    current_quantity: {
        type: Number,
        required: true,
        min: 0
    },
    min_stock_level: {
        type: Number,
        required: true,
        min: 0
    },
    unit_of_measure: {
        type: String,
        required: true,
        trim: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ['Out of Stock', 'Low Stock', 'In Stock'],
        default: 'In Stock',
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    barcode: {
        type: String,
        trim: true,
        unique:true
    },
    low_stock_alert: {
        type: Boolean,
        default: true
    },
    expiration_alert_date: {
        type: Date,
        required: true
    }
}, {
    timestamps: true
});

const ChemicalsModel = mongoose.model("ChemistryChemicals", chemicalsSchema);

module.exports = ChemicalsModel;
