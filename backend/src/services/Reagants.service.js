const httpStatus = require("http-status");
const { ReagantsModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ReagantsService {
    // Register a new Reagants item
    static async RegisterReagantsItem(user, body) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await ReagantsModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Reagants item already exists in the record");
        }

        await ReagantsModel.create({
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Reagants item added :)" };
    }



    // Delete a Reagants item by its ID
    static async DeleteReagantsItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await ReagantsModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Reagants item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a Reagants item by its ID
    static async getById(id) {
        try {
            const item = await ReagantsModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Reagants item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Reagants item");
        }
    }
    

    // Get all Reagants items with pagination
  // Get all Reagants items with search functionality
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
        const data = await ReagantsModel.find(queries)
            .select("item_name company createdAt purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");


           
        // Total documents
        const totalReagants = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalReagants
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Reagants items");
    }
}


    // Update a Reagants item by its ID
    static async UpdateReagantsItemById(user,body, id) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const existingItem = await ReagantsModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Reagants item not found");
        }

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await ReagantsModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Reagants item with this barcode already exists in another record");
            }
        }

        await ReagantsModel.findByIdAndUpdate(id, {
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        }, { new: true });

        return { msg: "Reagants item updated" };
    }

    // Get Reagants items for search
    static async GetReagantsItemForSearch() {
        const data = await ReagantsModel.find({})
            .select("item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = ReagantsService;
