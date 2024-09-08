const httpStatus = require("http-status");
const { ChemicalsModel } = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require('mongoose');

class ChemicalsService {
    // Register a new Chemicals item
    static async RegisterChemicalsItem(user, body) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await ChemicalsModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Chemicals item already exists in the record");
        }

        await ChemicalsModel.create({
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Chemicals item added :)" };
    }



    // Delete a Chemicals item by its ID
    static async DeleteChemicalsItem(user,id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error("Invalid item ID format");
            }
    
            
            const result = await ChemicalsModel.findByIdAndDelete(id);
            if (!result) {
                throw new Error('Chemicals item not found in the record');
            }
            return { msg: 'Item deleted successfully' };
        } catch (error) {
            console.error("Error deleting item:", error.message);  // Add this line
            throw new Error(error.message);
        }
    }
    
    // Get a Chemicals item by its ID
    static async getById(id) {
        try {
            const item = await ChemicalsModel.findById(id);
    
            if (!item) {
                throw new ApiError(httpStatus.NOT_FOUND, "Chemicals item not found in the record");
            }
    
            return { item };
        } catch (error) {
            console.error("Error in getById method:");
            console.error("Error message:", error.message);
            console.error("Error stack:", error.stack);
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Chemicals item");
        }
    }
    

    // Get all Chemicals items with pagination
  // Get all Chemicals items with search functionality
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
        const data = await ChemicalsModel.find(queries)
            .select("item_name company createdAt purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure updatedAt expiration_date location status description barcode low_stock_alert expiration_alert_date");


           
        // Total documents
        const totalChemicals = data.length; // Since there's no pagination, total is simply the length of data

        return {
            items: data,
            total: totalChemicals
        };
    } catch (error) {
        console.error('Error in GetAllItems:', error);
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Error fetching Chemicals items");
    }
}


    // Update a Chemicals item by its ID
    static async UpdateChemicalsItemById(user,body, id) {
        const {
            item_name, company, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const existingItem = await ChemicalsModel.findById(id);

        if (!existingItem) {
            throw new ApiError(httpStatus.NOT_FOUND, "Chemicals item not found");
        }

        if (existingItem.barcode !== barcode) {
            const checkExistBarcode = await ChemicalsModel.findOne({ barcode });

            if (checkExistBarcode) {
                throw new ApiError(httpStatus.BAD_REQUEST, "Chemicals item with this barcode already exists in another record");
            }
        }

        await ChemicalsModel.findByIdAndUpdate(id, {
            item_name, company,  purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
             expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        }, { new: true });

        return { msg: "Chemicals item updated" };
    }

    // Get Chemicals items for search
    static async GetChemicalsItemForSearch() {
        const data = await ChemicalsModel.find({})
            .select("item_name company barcode");
        
            

        return {
            items: data
        };
    }
}

module.exports = ChemicalsService;
