const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const MeasuringService = require("../services/Measuring.service");

class MeasuringController {
    // Register a new Measuring item
    static RegisterMeasuringItem = CatchAsync(async (req, res) => {
        const res_obj = await MeasuringService.RegisterMeasuringItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a Measuring item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await MeasuringService.UpdateMeasuringItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a Measuring item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Measuring item
        const res_obj = await MeasuringService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all Measuring items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await MeasuringService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a Measuring item by its ID
    static DeleteMeasuringItem = CatchAsync(async (req, res) => {
        const res_obj = await MeasuringService.DeleteMeasuringItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetMeasuringItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await MeasuringService.GetMeasuringItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = MeasuringController;
