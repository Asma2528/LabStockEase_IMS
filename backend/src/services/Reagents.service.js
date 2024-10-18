const httpStatus = require("http-status");
const { ReagentsModel, ReagentsLogModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ReagentsService {
    // Register a new Reagents item
    static async RegisterReagentsItem(user, body) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        // const existingReagent = await ReagentsModel.findOne({ item_code });
        // if (existingReagent) {
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Item Code already exists");
        // }

        // if (existingItem.item_code === item_code) {
        //     throw new ApiError(httpStatus.BAD_REQUEST, "Item Code already exists");
        // }

        const checkExist = await ReagentsModel.findOne({ barcode, user });
        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Reagents item already exists in the record");
        }

        await ReagentsModel.create({
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Reagents item added :)" };
    }


 // Delete a Reagents item by its ID
static async DeleteReagentsItem(user, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
    }

    const result = await ReagentsModel.findByIdAndDelete(id);
    if (!result) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Reagents item not found in the record');
    }

    // Delete associated logs
    await ReagentsLogModel.deleteMany({ item: id });

    return { msg: 'Item and associated logs deleted successfully' };
}


    // Get a Reagents item by its ID
    static async getById(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
        }

        const item = await ReagentsModel.findById(id);
        if (!item) {
            throw new ApiError(httpStatus.NOT_FOUND, "Reagents item not found in the record");
        }

        return { item };
    }

    // Get all Reagents items with search functionality
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

        const data = await ReagentsModel.find(queries)
            .select("item_code item_name company createdAt purpose BillNo total_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");

        const totalReagents = data.length;

        return {
            items: data,
            total: totalReagents
        };
    }
// Update a Reagents item by its ID
static async UpdateReagentsItemById(user, body, id) {
    const {
        item_code, item_name, company, purpose, BillNo, total_quantity,
        current_quantity, min_stock_level, unit_of_measure,
        expiration_date, location, status, description,
        barcode, low_stock_alert, expiration_alert_date
    } = body;

    const existingItem = await ReagentsModel.findById(id);
    if (!existingItem) {
        throw new ApiError(httpStatus.NOT_FOUND, "Reagents item not found");
    }

    // Calculate the new total and current quantities
    const updatedTotalQuantity = existingItem.current_quantity + total_quantity;
    const updatedCurrentQuantity = updatedTotalQuantity;

    // Check if the barcode has changed
    if (existingItem.barcode !== barcode) {
        const checkExistBarcode = await ReagentsModel.findOne({ barcode });
        if (checkExistBarcode) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Reagents item with this barcode already exists in another record");
        }
    }

    // Update the item
    await ReagentsModel.findByIdAndUpdate(id, {
        item_code, item_name, company, purpose, BillNo,
        total_quantity: updatedTotalQuantity, 
        current_quantity: updatedCurrentQuantity,
        min_stock_level, unit_of_measure,
        expiration_date, location, status, description,
        barcode, low_stock_alert, expiration_alert_date
    }, { new: true });

    return { msg: "Reagents item updated" };
}

    // Get Reagents items for search
    static async GetReagentsItemForSearch() {
        const data = await ReagentsModel.find({})
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

        // Find the reagent item first
        const reagent = await ReagentsModel.findById(item_id);
        if (!reagent) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Reagent item not found');
        }

        // Check if there's enough stock before logging
        if (reagent.current_quantity < issued_quantity) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Issued quantity exceeds current stock.');
        }

        const logEntry = new ReagentsLogModel({
            item: item_id,
            issued_quantity,
            date_issued,
            user_email
        });

        await logEntry.save();

        // Update the stock in the ReagentsModel
        reagent.current_quantity -= issued_quantity;

        if (reagent.current_quantity === 0) {
            reagent.status = 'Out of Stock';
        } else if (reagent.current_quantity <= reagent.min_stock_level) {
            reagent.status = 'Low Stock';
        } else {
            reagent.status = 'In Stock'; // Optional, if you want to reset it when above minimum stock
        }

        await reagent.save();

        return logEntry;
    }




    // Get logs
    static async GetLogs() {
        const logs = await ReagentsLogModel.find({})
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
        const reagent = await ReagentsModel.findOne({ item_code: item_id });
        if (reagent) {
            query.item = reagent._id; // Set the query to the ObjectId
        } else {
            throw new ApiError(httpStatus.NOT_FOUND, "Reagent item not found");
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

    const logs = await ReagentsLogModel.find(query)
        .populate('item', 'item_code item_name current_quantity') // Populate item details
        .sort({ date_issued: -1 }); // Sort logs by date

    // Filter out logs with deleted items
    const validLogs = logs.filter(log => log.item !== null);

    return validLogs;
}

 // Update reagent log item by ID
 static async UpdateReagentLogItemById(logId, newIssuedQuantity, user_email, date_issued) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Log ID must be a valid MongoDB ObjectId");
    }

    const logEntry = await ReagentsLogModel.findById(logId).populate('item');
    if (!logEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Log entry not found');
    }

    const reagent = logEntry.item;
    const existingQuantity = logEntry.issued_quantity;

    if (typeof newIssuedQuantity !== 'number' || newIssuedQuantity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid issued quantity.');
    }

    // Calculate the difference in issued quantity
    const quantityDifference = newIssuedQuantity - existingQuantity;

    // Update the current quantity based on the quantity difference
    reagent.current_quantity -= quantityDifference; // Decrease for increase in issued quantity; increase for decrease

    // Ensure the updated current quantity does not go negative
    if (reagent.current_quantity < 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Issued quantity exceeds current stock.');
    }

    // Update the reagent status based on the current quantity
    if (reagent.current_quantity === 0) {
        reagent.status = 'Out of Stock';
    } else if (reagent.current_quantity <= reagent.min_stock_level) {
        reagent.status = 'Low Stock';
    } else {
        reagent.status = 'In Stock';
    }

    await reagent.save();

    // Ensure date_issued is a valid date before saving
    if (!date_issued || isNaN(new Date(date_issued).getTime())) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid date issued.');
    }

    logEntry.issued_quantity = newIssuedQuantity;
    logEntry.user_email = user_email;
    logEntry.date_issued = new Date(date_issued); // Use the correct field name and format
    await logEntry.save();

    return { msg: "Reagent log updated successfully" };
}

// Delete a Reagents log item by its ID
static async DeleteReagentsLogItem(logId) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Log ID must be a valid MongoDB ObjectId");
    }

    // Find the log entry
    const logEntry = await ReagentsLogModel.findById(logId).populate('item');
    if (!logEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Log entry not found');
    }

    const reagent = logEntry.item;

    // Add the issued quantity back to the current quantity of the reagent
    reagent.current_quantity += logEntry.issued_quantity;

    // Update the reagent status based on the new current quantity
    if (reagent.current_quantity === 0) {
        reagent.status = 'Out of Stock';
    } else if (reagent.current_quantity <= reagent.min_stock_level) {
        reagent.status = 'Low Stock';
    } else {
        reagent.status = 'In Stock';
    }

    await reagent.save();

    // Now delete the log entry
    await ReagentsLogModel.findByIdAndDelete(logId);

    return { msg: 'Log entry deleted successfully' };
}

}

module.exports = ReagentsService;
