const httpStatus = require("http-status");
const { ReagentsModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ReagentsService {
    // Register a new Reagents item
    static async RegisterReagentsItem(user, body) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await ReagentsModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Reagents item already exists in the record");
        }

        await ReagentsModel.create({
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Reagents item added :)" };
    }



    // Delete a Reagents item by its ID
    static async DeleteReagentsItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }


            const result = await ReagentsModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Reagents item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }

    // Get a Reagents item by its ID
    static async getById(id) {
        try {
            const item = await ReagentsModel.findById(id);

            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Reagents item not found in the record");
            }

            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Reagents item");
        }
    }


    // Get all Reagents items with pagination
  // Get all Reagents items with search functionality
static async GetAllItems(query = '') {
    try {


        const regexQuery = new RegExp(query, 'i'); // Create regex for string matching

        // Build the search query
        const queries = {
            $or: [
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

        // Retrieve filtered items
        const data = await ReagentsModel.find(queries)
            .select("item_name company createdAt purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");



        // Total documents
        const totalReagents = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalReagents
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Reagents items");
    }
}


    // Update a Reagents item by its ID
    static async UpdateReagentsItemById(user,body, id) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const existingItem = await ReagentsModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Reagents item not found");
        }

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await ReagentsModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Reagents item with this barcode already exists in another record");
            }
        }

        await ReagentsModel.findByIdAndUpdate(id, {
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        }, { new: true });

        return { msg: "Reagents item updated" };
    }

    // Get Reagents items for search
    static async GetReagentsItemForSearch() {
        const data = await ReagentsModel.find({})
            .select("item_name company barcode");



        return {
            items: data
        };
    }
}

module.exports = ReagentsService;