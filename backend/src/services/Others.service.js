const httpStatus = require("http-status");
const { OthersModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class OthersService {
    // Register a new Others item
    static async RegisterOthersItem(user, body) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await OthersModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Others item already exists in the record");
        }

        await OthersModel.create({
            item_code, item_name, company,  purpose, BillNo, total_quantity,
             current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Others item added :)" };
    }



    // Delete a Others item by its ID
    static async DeleteOthersItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await OthersModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Others item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a Others item by its ID
    static async getById(id) {
        try {
            const item = await OthersModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Others item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Others item");
        }
    }
    

    // Get all Others items with pagination
  // Get all Others items with search functionality
static async GetAllItems(query = '') {
    try {

        
        const regexQuery = new RegExp(query, 'i'); // Create regex for string matching
        
        // Build the search query
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

        // Retrieve filtered items
        const data = await OthersModel.find(queries)
            .select("item_code item_name company createdAt purpose BillNo total_quantity  current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");


           
        // Total documents
        const totalOthers = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalOthers
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Others items");
    }
}


    // Update a Others item by its ID
    static async UpdateOthersItemById(user,body, id) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
             current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const existingItem = await OthersModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Others item not found");
        }

         // Calculate the new total and current quantities
    const updatedTotalQuantity = existingItem.current_quantity + total_quantity;
    const updatedCurrentQuantity = updatedTotalQuantity;

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await OthersModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Others item with this barcode already exists in another record");
            }
        }

        await OthersModel.findByIdAndUpdate(id, {
            item_code, item_name, company,  purpose, BillNo,  total_quantity: updatedTotalQuantity, 
            current_quantity: updatedCurrentQuantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        }, { new: true });

        return { msg: "Others item updated" };
    }

    // Get Others items for search
    static async GetOthersItemForSearch() {
        const data = await OthersModel.find({})
            .select("item_code item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = OthersService;
