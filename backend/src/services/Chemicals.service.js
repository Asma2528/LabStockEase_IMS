const httpStatus = require("http-status");
const { ChemicalsModel, ChemicalsLogModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ChemicalsService {
    // Register a new Chemicals item
    static async RegisterChemicalsItem(user, body) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        // const existingChemical = await ChemicalsModel.findOne({ item_code });
        // if (existingChemical) {
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Item Code already exists");
        // }

        // if (existingItem.item_code === item_code) {
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Item Code already exists");
        // }

        const checkExist = await ChemicalsModel.findOne({ barcode, user });
        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Chemicals item already exists in the record");
        }

        await ChemicalsModel.create({
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Chemicals item added :)" };
    }


 // Delete a Chemicals item by its ID
static async DeleteChemicalsItem(user, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
    }

    const result = await ChemicalsModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chemicals item not found in the record');
    }

    // Delete associated logs
    await ChemicalsLogModel.deleteMany({ item: id });

    return { msg: 'Item and associated logs deleted successfully' };
}


    // Get a Chemicals item by its ID
    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
        }

        const item = await ChemicalsModel.findById(id);
        if (!item) {
            throw new ApiError(httpStatus.NOT_FOUND, "Chemicals item not found in the record");
        }

        return { item };
    }

    // Get all Chemicals items with search functionality
    static async GetAllItems(query = '') {
        const regexQuery = new RegExp(query, 'i');
        const queries = {
            $or: [
                { item_code: regexQuery },
                { item_name: regexQuery },
                { company: regexQuery },
                { purpose: regexQuery },
                { unit_of_measure: regexQuery },
                { location: regexQuery },
                { status: regexQuery },
                { description: regexQuery },
                { barcode: regexQuery }
            ]
        };

        const data = await ChemicalsModel.find(queries)
            .select("item_code item_name company createdAt purpose BillNo total_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");

        const totalChemicals = data.length;

        return {
            items: data,
            total: totalChemicals
        };
    }
// Update a Chemicals item by its ID
static async UpdateChemicalsItemById(user, body, id) {
    const {
        item_code, item_name, company, purpose, BillNo, total_quantity,
        current_quantity, min_stock_level, unit_of_measure,
        expiration_date, location, status, description,
        barcode, low_stock_alert, expiration_alert_date
    } = body;

    const existingItem = await ChemicalsModel.findById(id);
    if (!existingItem) {
        throw new ApiError(httpStatus.NOT_FOUND, "Chemicals item not found");
    }

    // Calculate the new total and current quantities
    const updatedTotalQuantity = existingItem.current_quantity + total_quantity;
    const updatedCurrentQuantity = updatedTotalQuantity;

    // Check if the barcode has changed
    if (existingItem.barcode !== barcode) {
        const checkExistBarcode = await ChemicalsModel.findOne({ barcode });
        if (checkExistBarcode) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Chemicals item with this barcode already exists in another record");
        }
    }

    // Update the item
    await ChemicalsModel.findByIdAndUpdate(id, {
        item_code, item_name, company, purpose, BillNo,
        total_quantity: updatedTotalQuantity, 
        current_quantity: updatedCurrentQuantity,
        min_stock_level, unit_of_measure,
        expiration_date, location, status, description,
        barcode, low_stock_alert, expiration_alert_date
    }, { new: true });

    return { msg: "Chemicals item updated" };
}

    // Get Chemicals items for search
    static async GetChemicalsItemForSearch() {
        const data = await ChemicalsModel.find({})
            .select("item_code item_name company barcode");

        return {
            items: data
        };
    }

    // Log issued quantity
    static async LogIssuedQuantity(item_id, issued_quantity, date_issued, user_email) {
        // Check if item_id is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(item_id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Item ID must be a valid MongoDB ObjectId");
        }

        // Find the chemical item first
        const chemical = await ChemicalsModel.findById(item_id);
        if (!chemical) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Chemical item not found');
        }

        // Check if there's enough stock before logging
        if (chemical.current_quantity < issued_quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Issued quantity exceeds current stock.');
        }

        const logEntry = new ChemicalsLogModel({
            item: item_id,
            issued_quantity,
            date_issued,
            user_email
        });

        await logEntry.save();

        // Update the stock in the ChemicalsModel
        chemical.current_quantity -= issued_quantity;

        if (chemical.current_quantity === 0) {
            chemical.status = 'Out of Stock';
        } else if (chemical.current_quantity <= chemical.min_stock_level) {
            chemical.status = 'Low Stock';
        } else {
            chemical.status = 'In Stock'; // Optional, if you want to reset it when above minimum stock
        }

        await chemical.save();

        return logEntry;
    }




    // Get logs
    static async GetLogs() {
        const logs = await ChemicalsLogModel.find({})
            .populate('item', 'item_code item_name') // Populate item details if needed
            .sort({ date_issued: -1 }); // Sort logs by date (most recent first)
        return logs;
    }

    // Search logs with item code handling
   // Search logs with item code handling
static async SearchLogs(item_id, user_email, date_start, date_end) {
    const query = {};

    // Check if item_id is an ObjectId
    if (item_id) {
        const chemical = await ChemicalsModel.findOne({ item_code: item_id });
        if (chemical) {
            query.item = chemical._id; // Set the query to the ObjectId
        } else {
            throw new ApiError(httpStatus.NOT_FOUND, "Chemical item not found");
        }
    }

    if (user_email) {
        query.user_email = user_email;
    }

    if (date_start || date_end) {
        query.date_issued = {};
        if (date_start) {
            query.date_issued.$gte = new Date(date_start); // Greater than or equal to start date
        }
        if (date_end) {
            query.date_issued.$lte = new Date(date_end); // Less than or equal to end date
        }
    }

    const logs = await ChemicalsLogModel.find(query)
        .populate('item', 'item_code item_name current_quantity') // Populate item details
        .sort({ date_issued: -1 }); // Sort logs by date

    // Filter out logs with deleted items
    const validLogs = logs.filter(log => log.item !== null);

    return validLogs;
}

 // Update chemical log item by ID
 static async UpdateChemicalLogItemById(logId, newIssuedQuantity, user_email, date_issued) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Log ID must be a valid MongoDB ObjectId");
    }

    const logEntry = await ChemicalsLogModel.findById(logId).populate('item');
    if (!logEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Log entry not found');
    }

    const chemical = logEntry.item;
    const existingQuantity = logEntry.issued_quantity;

    if (typeof newIssuedQuantity !== 'number' || newIssuedQuantity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid issued quantity.');
    }

    // Calculate the difference in issued quantity
    const quantityDifference = newIssuedQuantity - existingQuantity;

    // Update the current quantity based on the quantity difference
    chemical.current_quantity -= quantityDifference; // Decrease for increase in issued quantity; increase for decrease

    // Ensure the updated current quantity does not go negative
    if (chemical.current_quantity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Issued quantity exceeds current stock.');
    }

    // Update the chemical status based on the current quantity
    if (chemical.current_quantity === 0) {
        chemical.status = 'Out of Stock';
    } else if (chemical.current_quantity <= chemical.min_stock_level) {
        chemical.status = 'Low Stock';
    } else {
        chemical.status = 'In Stock';
    }

    await chemical.save();

    // Ensure date_issued is a valid date before saving
    if (!date_issued || isNaN(new Date(date_issued).getTime())) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date issued.');
    }

    logEntry.issued_quantity = newIssuedQuantity;
    logEntry.user_email = user_email;
    logEntry.date_issued = new Date(date_issued); // Use the correct field name and format
    await logEntry.save();

    return { msg: "Chemical log updated successfully" };
}

// Delete a Chemicals log item by its ID
static async DeleteChemicalsLogItem(logId) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Log ID must be a valid MongoDB ObjectId");
    }

    // Find the log entry
    const logEntry = await ChemicalsLogModel.findById(logId).populate('item');
    if (!logEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Log entry not found');
    }

    const chemical = logEntry.item;

    // Add the issued quantity back to the current quantity of the chemical
    chemical.current_quantity += logEntry.issued_quantity;

    // Update the chemical status based on the new current quantity
    if (chemical.current_quantity === 0) {
        chemical.status = 'Out of Stock';
    } else if (chemical.current_quantity <= chemical.min_stock_level) {
        chemical.status = 'Low Stock';
    } else {
        chemical.status = 'In Stock';
    }

    await chemical.save();

    // Now delete the log entry
    await ChemicalsLogModel.findByIdAndDelete(logId);

    return { msg: 'Log entry deleted successfully' };
}

}

module.exports = ChemicalsService;
