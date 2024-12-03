const ChemistryRequisitionModel = require('../models/chemistry.requisition.models');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');

class ChemistryRequisitionService {
    // Create a new requisition
    static async createRequisition(requisitionData) {
        const newRequisition = await ChemistryRequisitionModel.create(requisitionData);
        return newRequisition;
    }

    // Get all requisitions for a specific user (faculty)
    static async getUserRequisitions(facultyEmail, searchParams = {}) {
        const query = { faculty_email: facultyEmail };
    
        if (searchParams.item_name) {
            query.item_name = { $regex: searchParams.item_name, $options: 'i' }; // Case-insensitive search
        }
        if (searchParams.purpose) {
            query.purpose = { $regex: searchParams.purpose, $options: 'i' };
        }
        if (searchParams.date_of_requirement) {
            query.date_of_requirement = new Date(searchParams.date_of_requirement);
        }
        if (searchParams.status) {
            query.status = searchParams.status;
        }
    
        
        const userRequisitions = await ChemistryRequisitionModel.find(query);
        return userRequisitions;
    }

  // Update a requisition by ID, only if it belongs to the requesting faculty
static async updateRequisition(requisitionId, updateData, facultyEmail) {
    // Find the requisition to check its status
    const existingRequisition = await ChemistryRequisitionModel.findOne({ _id: requisitionId, faculty_email: facultyEmail });

    // Check if the requisition exists
    if (!existingRequisition) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Requisition not found');
    }

    // If the status is 'Approved' or 'Rejected', return an error message
    if (existingRequisition.status === 'Approved' || existingRequisition.status === 'Rejected') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Approved or rejected requests cannot be updated. Please make a new request');
    }

    // Proceed to update if the status is 'Pending'
    const requisition = await ChemistryRequisitionModel.findOneAndUpdate(
        { _id: requisitionId, faculty_email: facultyEmail, status: 'Pending' }, // Only allow updates to 'Pending' requisitions
        updateData,
        { new: true }
    );

    return requisition;
}

    
    // Delete a requisition by ID, only if it belongs to the requesting faculty
    static async deleteRequisition(requisitionId, facultyEmail) {
        const deletedRequisition = await ChemistryRequisitionModel.findOneAndDelete(
            { _id: requisitionId, faculty_email: facultyEmail, status: 'Pending' } // Only allow deletion of 'Pending' requisitions
        );

        if (!deletedRequisition) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Requisition not found or cannot be deleted');
        }

        return deletedRequisition;
    }

// Update the getAllRequisitions function to filter by search parameters
// Fetch all requisitions with optional filters, including issued status correctly
static async getAllRequisitions(searchParams = {}) {
    const filter = {};

    if (searchParams.item_name) {
        filter.item_name = { $regex: searchParams.item_name, $options: 'i' }; // Case-insensitive search
    }
    if (searchParams.purpose) {
        filter.purpose = { $regex: searchParams.purpose, $options: 'i' };
    }
    if (searchParams.faculty_email) {
        filter.faculty_email = { $regex: searchParams.faculty_email, $options: 'i' };
    }
    if (searchParams.status) {
        filter.status = searchParams.status; // This will directly filter by the specified status
    }
    if (searchParams.date_of_requirement) {
        filter.date_of_requirement = new Date(searchParams.date_of_requirement);
    }
    if (searchParams.createdAt) {
        filter.createdAt = {
            $gte: new Date(new Date(searchParams.createdAt).setHours(0, 0, 0)),
            $lt: new Date(new Date(searchParams.createdAt).setHours(23, 59, 59))
        };
    }

    // Ensure filter considers all statuses, including issued
    if (!searchParams.status) {
        filter.status = { $in: ['Pending', 'Approved', 'Rejected', 'Issued'] };
    }

    const allRequisitions = await ChemistryRequisitionModel.find(filter);
    return allRequisitions;
}





  // Update a requisition status to any valid state
static async approveRequisition(requisitionId, adminEmail, newStatus) {

    const allowedStatuses = ['Approved', 'Rejected', 'Pending'];

    if (!allowedStatuses.includes(newStatus)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid status');
    }

    const updatedRequisition = await ChemistryRequisitionModel.findOneAndUpdate(
        { _id: requisitionId }, // Remove the status condition if updates to all statuses are allowed
        { status: newStatus, approved_by: adminEmail, approved_at: new Date() },
        { new: true }
    );

    if (!updatedRequisition) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Requisition not found or cannot be modified');
    }

    return updatedRequisition;
}


   // Get approved and issued requisitions based on search criteria
static async getApprovedAndIssuedRequisitions(searchParams = {}) {
    const query = { status: { $in: ['Approved', 'Issued'] } };

    if (searchParams.item_name) {
        query.item_name = new RegExp(searchParams.item_name, 'i'); // Case-insensitive search
    }
    if (searchParams.purpose) {
        query.purpose = new RegExp(searchParams.purpose, 'i');
    }
    if (searchParams.faculty_email) {
        query.faculty_email = new RegExp(searchParams.faculty_email, 'i');
    }
    if (searchParams.date_of_requirement) {
        query.date_of_requirement = new Date(searchParams.date_of_requirement);
    }
    if (searchParams.status) {
        query.status = searchParams.status;
    }
    if (searchParams.createdAt) {
        query.createdAt = {
            $gte: new Date(new Date(searchParams.createdAt).setHours(0, 0, 0)),
            $lt: new Date(new Date(searchParams.createdAt).setHours(23, 59, 59)),
        };
    }

    const requisitions = await ChemistryRequisitionModel.find(query);
    return requisitions;
}

// Change the status from Approved to Issued
static async changeStatusToIssued(requisitionId, userEmail) {
    const requisition = await ChemistryRequisitionModel.findOneAndUpdate(
        { _id: requisitionId, status: 'Approved' },
        { status: 'Issued', issued_by: userEmail, issued_at: new Date() },
        { new: true }
    );

    if (!requisition) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Requisition not found or cannot be modified');
    }

    return requisition;
}

}

module.exports = ChemistryRequisitionService;
