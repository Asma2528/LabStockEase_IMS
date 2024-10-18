const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ReagentsService = require("../services/Reagents.service");

class ReagentsController {
    // Register a new Reagents item
    static RegisterReagentsItem = CatchAsync(async (req, res) => {
        const res_obj = await ReagentsService.RegisterReagentsItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    
    // Get a Reagents item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Reagents item
        const res_obj = await ReagentsService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    

    // Get all Reagents items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await ReagentsService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         
            // Update a Reagents item by its ID
            static updateById = CatchAsync(async (req, res) => {
                const res_obj = await ReagentsService.UpdateReagentsItemById(req?.user, req.body, req.params.id);
                return res.status(httpStatus.OK).json(res_obj);
            });

    // Delete a Reagents item by its ID
    static DeleteReagentsItem = CatchAsync(async (req, res) => {
        const res_obj = await ReagentsService.DeleteReagentsItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetReagentsItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await ReagentsService.GetReagentsItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })



     // New method to log issued quantities
     static LogIssuedQuantity = CatchAsync(async (req, res) => {
        const { item_id, issued_quantity, date_issued, user_email} = req.body;
        const logEntry = await ReagentsService.LogIssuedQuantity(item_id, issued_quantity, date_issued, user_email);
        return res.status(httpStatus.CREATED).json(logEntry);
    });

    static GetLogs = CatchAsync(async (req, res) => {
        const logs = await ReagentsService.GetLogs();
        return res.status(httpStatus.OK).json(logs);
    });

    static SearchLogs = CatchAsync(async (req, res) => {
        const { item_id, user_email, date_start, date_end } = req.query;
        const logs = await ReagentsService.SearchLogs(item_id, user_email, date_start, date_end);
        return res.status(httpStatus.OK).json(logs);
    });



    static updateLogById = CatchAsync(async (req, res) => {
        const { issued_quantity,user_email,date_issued } = req.body; // Ensure this is being destructured correctly
        const logId = req.params.id; // Log ID from the request parameters
    console.log(logId);
    console.log("Request Body:", req.body);
    
        if (typeof issued_quantity !== 'number' || issued_quantity < 0) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid issued quantity." });
        }
    
        const res_obj = await ReagentsService.UpdateReagentLogItemById(logId, issued_quantity, user_email,date_issued);
        return res.status(httpStatus.OK).json(res_obj);
    });
    
// Delete a Reagents log item by its ID
static DeleteReagentsLogItem = CatchAsync(async (req, res) => {
    const logId = req.params.id; // Log ID from the request parameters

    const res_obj = await ReagentsService.DeleteReagentsLogItem(logId);

    return res.status(httpStatus.OK).json(res_obj);
});
    
}

module.exports = ReagentsController;
