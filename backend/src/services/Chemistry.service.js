const httpStatus = require("http-status");
const { ChemistryModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ChemistryService {
    // Register a new chemistry item
    static async RegisterChemistryItem(user, body) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await ChemistryModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Chemistry item already exists in the record");
        }

        await ChemistryModel.create({
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Chemistry item added :)" };
    }



    // Delete a chemistry item by its ID
    static async DeleteChemistryItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await ChemistryModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Chemistry item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a chemistry item by its ID
    static async getById(id) {
        try {
            const item = await ChemistryModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Chemistry item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching chemistry item");
        }
    }
    

    // Get all chemistry items with pagination
  // Get all chemistry items with search functionality
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
        const data = await ChemistryModel.find(queries)
            .select("item_name company createdAt purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");


           
        // Total documents
        const totalChemistry = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalChemistry
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching chemistry items");
    }
}


    // Update a chemistry item by its ID
    static async UpdateChemistryItemById(user,body, id) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const existingItem = await ChemistryModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Chemistry item not found");
        }

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await ChemistryModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Chemistry item with this barcode already exists in another record");
            }
        }

        await ChemistryModel.findByIdAndUpdate(id, {
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        }, { new: true });

        return { msg: "Chemistry item updated" };
    }

    // Get chemistry items for search
    static async GetChemistryItemForSearch() {
        const data = await ChemistryModel.find({})
            .select("item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = ChemistryService;
