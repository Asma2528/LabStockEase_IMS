const httpStatus = require("http-status");
const { MeasuringModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class MeasuringService {
    // Register a new Measuring item
    static async RegisterMeasuringItem(user, body) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,location, status, description,
            barcode, low_stock_alert
        } = body;

        const checkExist = await MeasuringModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Measuring item already exists in the record");
        }


        await MeasuringModel.create({
            item_code, item_name, company,  purpose, BillNo,  total_quantity: updatedTotalQuantity, 
            current_quantity: updatedCurrentQuantity,min_stock_level, unit_of_measure,
             location, status, description,
            barcode, low_stock_alert,  user
        });

        return { msg: "Measuring item added :)" };
    }



    // Delete a Measuring item by its ID
    static async DeleteMeasuringItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await MeasuringModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Measuring item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a Measuring item by its ID
    static async getById(id) {
        try {
            const item = await MeasuringModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Measuring item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Measuring item");
        }
    }
    

    // Get all Measuring items with pagination
  // Get all Measuring items with search functionality
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
        const data = await MeasuringModel.find(queries)
            .select("item_code item_name company createdAt purpose BillNo total_quantity  current_quantity min_stock_level unit_of_measure updatedAt  location status description barcode low_stock_alert ");


           
        // Total documents
        const totalMeasuring = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalMeasuring
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Measuring items");
    }
}


    // Update a Measuring item by its ID
    static async UpdateMeasuringItemById(user,body, id) {
        const {
            item_code, item_name, company, purpose, BillNo, total_quantity,
            current_quantity, min_stock_level, unit_of_measure,
            location, status, description,
            barcode, low_stock_alert,
        } = body;

        const existingItem = await MeasuringModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Measuring item not found");
        }

                 // Calculate the new total and current quantities
    const updatedTotalQuantity = existingItem.current_quantity + total_quantity;
    const updatedCurrentQuantity = updatedTotalQuantity;


        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await MeasuringModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Measuring item with this barcode already exists in another record");
            }
        }

        await MeasuringModel.findByIdAndUpdate(id, {
            item_code, item_name, company,  purpose, BillNo,  total_quantity: updatedTotalQuantity, 
            current_quantity: updatedCurrentQuantity, min_stock_level, unit_of_measure,
             location, status, description,
            barcode, low_stock_alert
        }, { new: true });

        return { msg: "Measuring item updated" };
    }

    // Get Measuring items for search
    static async GetMeasuringItemForSearch() {
        const data = await MeasuringModel.find({})
            .select("item_code item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = MeasuringService;
