const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const OthersService = require("../services/Others.service");

class OthersController {
    // Register a new Others item
    static RegisterOthersItem = CatchAsync(async (req, res) => {
        const res_obj = await OthersService.RegisterOthersItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a Others item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await OthersService.UpdateOthersItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a Others item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Others item
        const res_obj = await OthersService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all Others items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await OthersService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a Others item by its ID
    static DeleteOthersItem = CatchAsync(async (req, res) => {
        const res_obj = await OthersService.DeleteOthersItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetOthersItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await OthersService.GetOthersItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = OthersController;
