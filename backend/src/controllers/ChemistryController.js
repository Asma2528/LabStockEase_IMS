const httpStatus = require("http-status");
const CatchAsync = require("../utils/CatchAsync");
const ChemistryService = require("../services/Chemistry.service");

class ChemistryController {
    // Register a new chemistry item
    static RegisterChemistryItem = CatchAsync(async (req, res) => {
        const res_obj = await ChemistryService.RegisterChemistryItem(req?.user, req.body);
        return res.status(httpStatus.CREATED).json(res_obj);
    });

    // Update a chemistry item by its ID
    static updateById = CatchAsync(async (req, res) => {
        console.log("Before cont")
        const res_obj = await ChemistryService.UpdateChemistryItemById(req?.user, req.body, req.params.id);
        console.log("After cont")
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a chemistry item by its ID
    static getById = CatchAsync(async (req, res) => {
        const { id } = req.params;
    
        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid ID format" });
        }
    
    
        // Call the service method to get the chemistry item
        const res_obj = await ChemistryService.getById(id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });



    // Get all chemistry items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        try {
            const query = req.query.query || ''; // handle optional query parameter
            const result = await ChemistryService.GetAllItems(query); // Call the service method
            res.json(result);
        } catch (error) {
            console.error('Error fetching items:', error); // Log the error to the server console
            res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    });         

    // Delete a chemistry item by its ID
    static DeleteChemistryItem = CatchAsync(async (req, res) => {
        const res_obj = await ChemistryService.DeleteChemistryItem(req?.user, req.params.id);
    
        return res.status(httpStatus.OK).json(res_obj);
    });
    
    static GetChemistryItemForSearch= CatchAsync(async(req,res)=>{
        const res_obj  = await ChemistryService.GetChemistryItemForSearch(req?.user);
        return    res.status(httpStatus.OK).json(res_obj)

    })
}

module.exports = ChemistryController;
