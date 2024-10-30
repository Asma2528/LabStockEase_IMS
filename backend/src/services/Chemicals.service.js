const httpStatus = require("http-status");
const {
  ChemicalsModel,
  ChemicalsLogModel,
  ChemicalsRestockModel,
} = require("../models");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");

class ChemicalsService {
  static async RegisterChemicalsItem(user, body) {
    const {
      item_name,
      company,
      purpose,
      min_stock_level,
      unit_of_measure,
      description,
    } = body;

    // Generate item code
    const itemCodePrefix = item_name.slice(0, 1).toUpperCase();
    const lastItem = await ChemicalsModel.findOne({
      item_code: { $regex: `^${itemCodePrefix}-` },
    })
      .sort({ item_code: -1 })
      .exec();

    let nextNumber = 1;
    if (lastItem) {
      const lastItemCode = lastItem.item_code;
      const lastNumber = parseInt(lastItemCode.split("-")[1], 10);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const item_code = `${itemCodePrefix}-${nextNumber}`;
    const total_quantity = 0;
    const current_quantity = 0;

    const chemical = await ChemicalsModel.create({
      item_code,
      item_name,
      company,
      purpose,
      total_quantity,
      current_quantity,
      min_stock_level,
      unit_of_measure,
      description,
      status: current_quantity > min_stock_level ? "In Stock" : "Out of Stock",
      user,
    });

    return { msg: "Chemicals item added successfully!", chemical };
  }

  // Restock chemical by adding purchased quantities
  static async RestockChemical(user, body) {
    const {
      chemical_id,
      item_code,
      item_name,
      quantity_purchased,
      purchase_date,
      expiration_date,
      supplier,
      bill_number,
      cost_per_purchase,
      location,
      barcode,
    } = body;

    // Fetch chemical by either ID, item code, or item name
    let existingChemical;

    if (body.chemical) {
      if (!mongoose.Types.ObjectId.isValid(body.chemical)) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Invalid chemical ID");
      }
      existingChemical = await ChemicalsModel.findById(body.chemical);
    } else if (item_code) {
      existingChemical = await ChemicalsModel.findOne({ item_code });
    } else if (item_name) {
      existingChemical = await ChemicalsModel.findOne({ item_name });
    }

    if (!existingChemical) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chemical not found");
    }

    // Log the purchase in Restock Model
    const restockRecord = await ChemicalsRestockModel.create({
      chemical: existingChemical._id,
      quantity_purchased,
      purchase_date,
      expiration_date,
      supplier,
      bill_number,
      cost_per_purchase,
      location,
      barcode,
    });

    // Update the chemical stock
    existingChemical.total_quantity += quantity_purchased;
    existingChemical.current_quantity += quantity_purchased;

    // Update chemical status
    existingChemical.status =
      existingChemical.current_quantity <= existingChemical.min_stock_level
        ? "Out of Stock"
        : "In Stock";

    await existingChemical.save();

    return { msg: "Chemical restocked successfully", restockRecord };
  }

  static async GetAllRestocks(filters = {}) {
    const query = {};

    // Lookup for chemical ID by item_code or item_name before querying the restock data
    if (filters.chemical) {
      // Find matching chemicals by item_code or item_name using regex
      const matchingChemicals = await ChemicalsModel.find({
        $or: [
          { item_code: { $regex: filters.chemical, $options: "i" } },
          { item_name: { $regex: filters.chemical, $options: "i" } },
        ],
      }).select("_id"); // Only get the _id of matching chemicals

      // Extract the IDs into an array
      const chemicalIds = matchingChemicals.map((c) => c._id);
      query.chemical = { $in: chemicalIds }; // Match any of the found chemical IDs
    }

    if (filters.purchase_date) {
      const startOfDay = new Date(filters.purchase_date);
      startOfDay.setUTCHours(0, 0, 0, 0);
      const endOfDay = new Date(filters.purchase_date);
      endOfDay.setUTCHours(23, 59, 59, 999);
      query.purchase_date = { $gte: startOfDay, $lte: endOfDay };
    }

    if (filters.bill_number) {
      query.bill_number = { $regex: filters.bill_number, $options: "i" };
    }

    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }

    if (filters.barcode) {
      query.barcode = { $regex: filters.barcode, $options: "i" };
    }

    const restocks = await ChemicalsRestockModel.find(query)
      .populate("chemical", "item_code item_name")
      .sort({ purchase_date: -1 });

    return restocks;
  }

  // Update restock record by ID
  static async UpdateRestockRecordById(restockId, body) {
    const {
      quantity_purchased,
      purchase_date,
      supplier,
      bill_number,
      cost_per_purchase,
      location,
      barcode,
    } = body;

    if (!mongoose.Types.ObjectId.isValid(restockId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Restock ID format");
    }

    const restockRecord = await ChemicalsRestockModel.findById(restockId);
    if (!restockRecord) {
      throw new ApiError(httpStatus.NOT_FOUND, "Restock record not found");
    }

    const originalQuantity = restockRecord.quantity_purchased;

    // Update restock record fields
    restockRecord.quantity_purchased =
      quantity_purchased || restockRecord.quantity_purchased;
    restockRecord.purchase_date = purchase_date || restockRecord.purchase_date;
    restockRecord.supplier = supplier || restockRecord.supplier;
    restockRecord.bill_number = bill_number || restockRecord.bill_number;
    restockRecord.cost_per_purchase =
      cost_per_purchase || restockRecord.cost_per_purchase;
    restockRecord.location = location || restockRecord.location;
    restockRecord.barcode = barcode || restockRecord.barcode;

    await restockRecord.save();

    // Adjust the chemical's current and total quantity based on the change in purchased quantity
    const chemicalRecord = await ChemicalsModel.findById(
      restockRecord.chemical
    );
    if (chemicalRecord) {
      const quantityDifference = quantity_purchased - originalQuantity;
      chemicalRecord.current_quantity += quantityDifference;
      chemicalRecord.total_quantity += quantityDifference;

      chemicalRecord.status =
        chemicalRecord.current_quantity <= chemicalRecord.min_stock_level
          ? "Low Stock"
          : "In Stock";
      await chemicalRecord.save();
    }

    return { msg: "Restock record updated successfully", restockRecord };
  }

  // Delete restock record by ID
  static async DeleteRestockRecordById(restockId) {
    if (!mongoose.Types.ObjectId.isValid(restockId)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid Restock ID format");
    }

    const restockRecord = await ChemicalsRestockModel.findById(restockId);
    if (!restockRecord) {
      throw new ApiError(httpStatus.NOT_FOUND, "Restock record not found");
    }

    const originalQuantity = restockRecord.quantity_purchased;

    await ChemicalsRestockModel.findByIdAndDelete(restockId);

    const chemicalRecord = await ChemicalsModel.findById(
      restockRecord.chemical
    );
    if (chemicalRecord) {
      chemicalRecord.current_quantity -= originalQuantity;
      chemicalRecord.total_quantity -= originalQuantity;

      chemicalRecord.status =
        chemicalRecord.current_quantity <= chemicalRecord.min_stock_level
          ? "Low Stock"
          : "In Stock";
      await chemicalRecord.save();
    }

    return { msg: "Restock record deleted successfully" };
  }

  // Delete a Chemicals item and its associated restocks and logs
  static async DeleteChemicalsItem(user, id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
    }

    const chemical = await ChemicalsModel.findById(id);
    if (!chemical) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Chemicals item not found in the record"
      );
    }

    // Delete associated restock records
    await ChemicalsRestockModel.deleteMany({ chemical: id });

    // Delete associated logs
    await ChemicalsLogModel.deleteMany({ item: id });

    // Finally, delete the chemical item itself
    await ChemicalsModel.findByIdAndDelete(id);

    return {
      msg: "Item and associated restocks and logs deleted successfully",
    };
  }

  // Get a Chemicals item by its ID
  static async getById(id) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid item ID format");
    }

    const item = await ChemicalsModel.findById(id);
    if (!item) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Chemicals item not found in the record"
      );
    }

    return { item };
  }

  // Get all Chemicals items with search functionality
  static async GetAllItems(filters = {}) {
    const query = {}; // Initialize an empty query object

    // Add individual fields to the query object if they are present in the filters
    if (filters.item_code)
      query.item_code = { $regex: filters.item_code, $options: "i" };
    if (filters.item_name)
      query.item_name = { $regex: filters.item_name, $options: "i" };
    if (filters.company)
      query.company = { $regex: filters.company, $options: "i" };
    if (filters.status)
      query.status = { $regex: filters.status, $options: "i" };
    if (filters.purpose)
      query.purpose = { $regex: filters.purpose, $options: "i" };
    if (filters.unit_of_measure)
      query.unit_of_measure = {
        $regex: filters.unit_of_measure,
        $options: "i",
      };
    if (filters.description)
      query.description = { $regex: filters.description, $options: "i" };

    const data = await ChemicalsModel.find(query).select(
      "item_code item_name company createdAt purpose total_quantity current_quantity min_stock_level unit_of_measure updatedAt status description"
    );

    const totalChemicals = data.length;

    return {
      items: data,
      total: totalChemicals,
    };
  }

  static async UpdateChemicalsItemById(user, body, id) {
    const {
      item_name,
      company,
      purpose,
      min_stock_level,
      unit_of_measure,
      description,
      expiration_date,
    } = body;

    const existingItem = await ChemicalsModel.findById(id);
    if (!existingItem) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chemicals item not found");
    }

    const updatedData = {
      item_name,
      company,
      purpose,
      min_stock_level,
      unit_of_measure,
      description,
    };

    if (expiration_date) {
      updatedData.expiration_date = expiration_date;
    }

    await ChemicalsModel.findByIdAndUpdate(id, updatedData, { new: true });

    return { msg: "Chemicals item updated successfully" };
  }

  // Get Chemicals items for search
  static async GetChemicalsItemForSearch() {
    const data = await ChemicalsModel.find({}).select(
      "item_code item_name company"
    );

    return {
      items: data,
    };
  }

  // Log issued quantity
  static async LogIssuedQuantity(
    item_id,
    issued_quantity,
    date_issued,
    user_email
  ) {
    if (!mongoose.Types.ObjectId.isValid(item_id)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Item ID must be a valid MongoDB ObjectId"
      );
    }

    const chemical = await ChemicalsModel.findById(item_id);
    if (!chemical) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chemical item not found");
    }

    if (chemical.current_quantity < issued_quantity) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Issued quantity exceeds current stock."
      );
    }

    const logEntry = new ChemicalsLogModel({
      item: item_id,
      issued_quantity,
      date_issued,
      user_email,
    });

    await logEntry.save();

    chemical.current_quantity -= issued_quantity;

    if (chemical.current_quantity === 0) {
      chemical.status = "Out of Stock";
    } else if (chemical.current_quantity <= chemical.min_stock_level) {
      chemical.status = "Low Stock";
    } else {
      chemical.status = "In Stock";
    }

    await chemical.save();

    return logEntry;
  }

  static async GetLogs(filters) {
    const query = {};

    // Use regular expression for partial match on item_code
    if (filters.item_code) {
      const chemical = await ChemicalsModel.findOne({
        item_code: { $regex: filters.item_code, $options: "i" },
      });
      if (chemical) query.item = chemical._id;
    }

    // Use regular expression for partial match on item_name
    if (filters.item_name) {
      const chemical = await ChemicalsModel.findOne({
        item_name: { $regex: filters.item_name, $options: "i" },
      });
      if (chemical) query.item = chemical._id;
    }

    // Use regular expression for partial match on user_email
    if (filters.user_email) {
      query.user_email = { $regex: filters.user_email, $options: "i" };
    }

    // Filter by a specific date (date_issued)
    if (filters.date_issued) {
      const startOfDay = new Date(filters.date_issued);
      startOfDay.setUTCHours(0, 0, 0, 0); // Set to the start of the day
      const endOfDay = new Date(filters.date_issued);
      endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day

      query.date_issued = { $gte: startOfDay, $lte: endOfDay };
    }

    // Fetch logs based on the constructed query, and populate the item with specific fields
    const logs = await ChemicalsLogModel.find(query)
      .populate("item", "item_code item_name")
      .sort({ date_issued: -1 });

    return logs;
  }

  // Update chemical log item by ID
  static async UpdateChemicalLogItemById(
    logId,
    newIssuedQuantity,
    user_email,
    date_issued
  ) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Log ID must be a valid MongoDB ObjectId"
      );
    }

    const logEntry = await ChemicalsLogModel.findById(logId).populate("item");
    if (!logEntry) {
      throw new ApiError(httpStatus.NOT_FOUND, "Log entry not found");
    }

    const chemical = logEntry.item;
    const existingQuantity = logEntry.issued_quantity;

    if (typeof newIssuedQuantity !== "number" || newIssuedQuantity < 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid issued quantity.");
    }

    const quantityDifference = newIssuedQuantity - existingQuantity;

    chemical.current_quantity -= quantityDifference;

    if (chemical.current_quantity < 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Issued quantity exceeds current stock."
      );
    }

    if (chemical.current_quantity === 0) {
      chemical.status = "Out of Stock";
    } else if (chemical.current_quantity <= chemical.min_stock_level) {
      chemical.status = "Low Stock";
    } else {
      chemical.status = "In Stock";
    }

    await chemical.save();

    if (!date_issued || isNaN(new Date(date_issued).getTime())) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid date issued.");
    }

    logEntry.issued_quantity = newIssuedQuantity;
    logEntry.user_email = user_email;
    logEntry.date_issued = new Date(date_issued);
    await logEntry.save();

    return { msg: "Chemical log updated successfully" };
  }

  // Delete a Chemicals log item by its ID
  static async DeleteChemicalsLogItem(logId) {
    if (!mongoose.Types.ObjectId.isValid(logId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Log ID must be a valid MongoDB ObjectId"
      );
    }

    const logEntry = await ChemicalsLogModel.findById(logId).populate("item");
    if (!logEntry) {
      throw new ApiError(httpStatus.NOT_FOUND, "Log entry not found");
    }

    const chemical = logEntry.item;

    chemical.current_quantity += logEntry.issued_quantity;

    if (chemical.current_quantity === 0) {
      chemical.status = "Out of Stock";
    } else if (chemical.current_quantity <= chemical.min_stock_level) {
      chemical.status = "Low Stock";
    } else {
      chemical.status = "In Stock";
    }

    await chemical.save();

    await ChemicalsLogModel.findByIdAndDelete(logId);

    return { msg: "Log entry deleted successfully" };
  }
}

module.exports = ChemicalsService;
