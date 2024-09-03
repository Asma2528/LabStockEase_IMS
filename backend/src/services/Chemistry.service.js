const httpStatus = require("http-status");
const { ChemistryModel } = require("../models");
const ApiError = require("../utils/ApiError");

class ChemistryService {
    // Register a new chemistry item
    static async RegisterChemistryItem(user, body) {
        const {
            item_name, company, date_added, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            last_updated_date, expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date
        } = body;

        const checkExist = await ChemistryModel.findOne({ barcode, user });

        if (checkExist) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Chemistry item already exists in the record");
        }

        await ChemistryModel.create({
            item_name, company, date_added, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            last_updated_date, expiration_date, location, status, description,
            barcode, low_stock_alert, expiration_alert_date, user
        });

        return { msg: "Chemistry item added :)" };
    }



    // Delete a chemistry item by its ID
    static async DeleteChemistryItem(id) {
        const checkExist = await ChemistryModel.findByIdAndDelete(id);

        if (!checkExist) {
            throw new ApiError(httpStatus.NOT_FOUND, "Chemistry item not found in the record");
        }

        return { msg: "Chemistry item deleted :)" };
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
    static async GetAllItems(page = 1, query = '') {
        console.log("inside get all items - services");
        const limit = 10;
        const skip = (Number(page) - 1) * limit;

        const regexQuery = new RegExp(query, 'i'); // Create regex for string matching

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
            .select("item_name company date_added purpose BillNo total_quantity issued_quantity current_quantity min_stock_level unit_of_measure last_updated_date expiration_date location status description barcode low_stock_alert")
            .skip(skip)
            .limit(limit);
        
        console.log("Data retrieved:", data);

        // Total documents
        const totalChemistry = await ChemistryModel.countDocuments(queries);
        // Has more
        const hasMore = skip + limit < totalChemistry;

        console.log("before returning: ", data, hasMore);

        return {
            items: data,
            more: hasMore
        };
    }

    // Update a chemistry item by its ID
    static async UpdateChemistryItemById(body, id) {
        const {
            item_name, company, date_added, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            last_updated_date, expiration_date, location, status, description,
            barcode, low_stock_alert
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
            item_name, company, date_added, purpose, BillNo, total_quantity,
            issued_quantity, current_quantity, min_stock_level, unit_of_measure,
            last_updated_date, expiration_date, location, status, description,
            barcode, low_stock_alert
        }, { new: true });

        return { msg: "Chemistry item updated" };
    }

    // Get chemistry items for search
    static async GetChemistryItemForSearch() {
        const data = await ChemistryModel.find({})
            .select("item_name");
        
        return {
            items: data
        };
    }
}

module.exports = ChemistryService;
