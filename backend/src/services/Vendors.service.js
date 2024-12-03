const VendorModel = require('../models/vendors.models');

// Create a new vendor
exports.createVendor = async (vendorData) => {
    const newVendor = new VendorModel(vendorData);
    return await newVendor.save();
};

// Service: Get all vendors with filtering
exports.getAllVendors = async (filters = {}) => {
    const query = {};
    
    // Apply filters based on the search parameters
    if (filters.code) query.code = { $regex: filters.code, $options: 'i' };
    if (filters.name) query.name = { $regex: filters.name, $options: 'i' };
    if (filters.contact_person) query.contact_person = { $regex: filters.contact_person, $options: 'i' };
    if (filters.classification) query.classification = filters.classification;
    if (filters.grading) query.grading = filters.grading;

    return await VendorModel.find(query);
};




// Update a vendor by ID
exports.updateVendor = async (vendorId, updateData) => {
    return await VendorModel.findByIdAndUpdate(vendorId, updateData, { new: true });
};

// Delete a vendor by ID
exports.deleteVendor = async (vendorId) => {
    return await VendorModel.findByIdAndDelete(vendorId);
};
