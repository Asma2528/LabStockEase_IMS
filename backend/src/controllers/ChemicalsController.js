const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ChemicalsService = require("../services/Chemicals.service");

class ChemicalsController {
    // Register a new Chemicals item
    static RegisterChemicalsItem = CatchAsync(async (req, res) => {
        const res_obj = await ChemicalsService.RegisterChemicalsItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a Chemicals item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await ChemicalsService.UpdateChemicalsItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a Chemicals item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the Chemicals item
        const res_obj = await ChemicalsService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all Chemicals items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await ChemicalsService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a Chemicals item by its ID
    static DeleteChemicalsItem = CatchAsync(async (req, res) => {
        const res_obj = await ChemicalsService.DeleteChemicalsItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetChemicalsItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await ChemicalsService.GetChemicalsItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = ChemicalsController;
