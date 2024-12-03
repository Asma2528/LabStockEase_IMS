const httpStatus = require('http-status');
const ChemistryRequisitionService = require('../services/Chemistry.Requisition.service');
const CatchAsync = require('../utils/CatchAsync');

class ChemistryRequisitionController {
    // Faculty creates a requisition
    static createRequisition = CatchAsync(async (req, res) => {
        const requisitionData = {
            ...req.body,
            faculty_email: req.user.email, // Automatically set the faculty's email from the authenticated user
            status: 'Pending' // Ensure status is set to 'Pending'
        };

        console.log("Inside createRequisition Controller", requisitionData);

        const requisition = await ChemistryRequisitionService.createRequisition(requisitionData);
        return res.status(httpStatus.CREATED).json({ msg: 'Requisition created successfully', requisition });
    });


    // Faculty retrieves their own requisitions
    static getUserRequisitions = CatchAsync(async (req, res) => {
        const searchParams = {
            item_name: req.query.item_name || '',
            purpose: req.query.purpose || '',
            date_of_requirement: req.query.date_of_requirement || '',
            status: req.query.status || ''
        };
    
        const requisitions = await ChemistryRequisitionService.getUserRequisitions(req.user.email, searchParams);
        return res.status(httpStatus.OK).json({ requisitions });
    });

    // Faculty updates their own requisition
    static updateRequisition = CatchAsync(async (req, res) => {
        const { id } = req.params;
     
        const updatedRequisition = await ChemistryRequisitionService.updateRequisition(id, req.body, req.user.email);
       
        if (!updatedRequisition) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Requisition not found or cannot be updated' });
        }
        return res.status(httpStatus.OK).json({ msg: 'Requisition updated successfully', updatedRequisition });
    });

    // Faculty deletes their own requisition
    static deleteRequisition = CatchAsync(async (req, res) => {
        const { id } = req.params;
        const deletedRequisition = await ChemistryRequisitionService.deleteRequisition(id, req.user.email);
        if (!deletedRequisition) {
            return res.status(httpStatus.NOT_FOUND).json({ msg: 'Requisition not found or cannot be deleted' });
        }
        return res.status(httpStatus.OK).json({ msg: 'Requisition deleted successfully' });
    });

   // Admin retrieves all requisitions with search filters
static getAllRequisitions = CatchAsync(async (req, res) => {
    // Pass the query parameters directly to the service layer
    const requisitions = await ChemistryRequisitionService.getAllRequisitions(req.query);
    return res.status(httpStatus.OK).json({ requisitions });
});


   // Admin approves a requisition
static approveRequisition = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Extract the status from the request body

    // Call the service function with the status
    const approvedRequisition = await ChemistryRequisitionService.approveRequisition(id, req.user.email, status);

    if (!approvedRequisition) {
        return res.status(httpStatus.NOT_FOUND).json({ msg: 'Requisition not found or cannot be approved' });
    }

    return res.status(httpStatus.OK).json({ msg: 'Requisition approved successfully', approvedRequisition });
});


   // Chemistry staff retrieves approved and issued requisitions with search functionality
static getApprovedAndIssuedRequisitions = CatchAsync(async (req, res) => {
    const { item_name, purpose, date_of_requirement, createdAt, faculty_email,status } = req.query;

    // Call service method and pass the search parameters
    const requisitions = await ChemistryRequisitionService.getApprovedAndIssuedRequisitions({
        item_name,
        purpose,
        date_of_requirement,
        createdAt,
        faculty_email,
        status
    });

    return res.status(httpStatus.OK).json({ requisitions });
});

// Change the status of a requisition to Issued
static changeStatusToIssued = CatchAsync(async (req, res) => {
    const { id } = req.params;
    const userEmail = req.user.email;

    // Call service method to change status
    const updatedRequisition = await ChemistryRequisitionService.changeStatusToIssued(id, userEmail);

    return res.status(httpStatus.OK).json({ msg: 'Status updated to "Issued" successfully', updatedRequisition });
});

}

module.exports = ChemistryRequisitionController;
