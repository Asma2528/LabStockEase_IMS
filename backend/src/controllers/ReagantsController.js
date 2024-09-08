const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ReagantsService = require("../services/Reagants.service");

class ReagantsController {
    // Register a new Reagants item
    static RegisterReagantsItem = CatchAsync(async (req, res) => {
        const res_obj = await ReagantsService.RegisterReagantsItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a Reagants item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await ReagantsService.UpdateReagantsItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a Reagants item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Reagants item
        const res_obj = await ReagantsService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all Reagants items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await ReagantsService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a Reagants item by its ID
    static DeleteReagantsItem = CatchAsync(async (req, res) => {
        const res_obj = await ReagantsService.DeleteReagantsItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetReagantsItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await ReagantsService.GetReagantsItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = ReagantsController;
