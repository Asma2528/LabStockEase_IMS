const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const GlasswareService = require("../services/Glassware.service");

class GlasswareController {
    // Register a new Glassware item
    static RegisterGlasswareItem = CatchAsync(async (req, res) => {
        const res_obj = await GlasswareService.RegisterGlasswareItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a Glassware item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await GlasswareService.UpdateGlasswareItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a Glassware item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Glassware item
        const res_obj = await GlasswareService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all Glassware items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await GlasswareService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a Glassware item by its ID
    static DeleteGlasswareItem = CatchAsync(async (req, res) => {
        const res_obj = await GlasswareService.DeleteGlasswareItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetGlasswareItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await GlasswareService.GetGlasswareItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = GlasswareController;