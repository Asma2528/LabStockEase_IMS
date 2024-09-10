const httpStatus = require("http-status");
const { GlasswareModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class GlasswareService {
    // Register a new Glassware item
    static async RegisterGlasswareItem(user, body) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,location, status, description,
            barcode, low_stock_alert
        } = body;

        const checkExist = await GlasswareModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Glassware item already exists in the record");
        }

        await GlasswareModel.create({
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             location, status, description,
            barcode, low_stock_alert,  user
        });

        return { msg: "Glassware item added :)" };
    }



    // Delete a Glassware item by its ID
    static async DeleteGlasswareItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await GlasswareModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Glassware item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a Glassware item by its ID
    static async getById(id) {
        try {
            const item = await GlasswareModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Glassware item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Glassware item");
        }
    }
    

    // Get all Glassware items with pagination
  // Get all Glassware items with search functionality
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
        const data = await GlasswareModel.find(queries)
            .select("item_name company createdAt purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure updatedAt  location status description barcode low_stock_alert ");


           
        // Total documents
        const totalGlassware = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalGlassware
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Glassware items");
    }
}


    // Update a Glassware item by its ID
    static async UpdateGlasswareItemById(user,body, id) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            location, status, description,
            barcode, low_stock_alert,
        } = body;

        const existingItem = await GlasswareModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Glassware item not found");
        }

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await GlasswareModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Glassware item with this barcode already exists in another record");
            }
        }

        await GlasswareModel.findByIdAndUpdate(id, {
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             location, status, description,
            barcode, low_stock_alert
        }, { new: true });

        return { msg: "Glassware item updated" };
    }

    // Get Glassware items for search
    static async GetGlasswareItemForSearch() {
        const data = await GlasswareModel.find({})
            .select("item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = GlasswareService;
