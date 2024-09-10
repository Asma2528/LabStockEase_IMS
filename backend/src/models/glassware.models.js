const mongoose = require("mongoose");

const GlasswareSchema = new mongoose.Schema({
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
    issued_quantity: {
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
    location: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
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
}, {
    timestamps: true
});

const GlasswareModel = mongoose.model("ChemistryGlassware", GlasswareSchema);

module.exports = GlasswareModel;
