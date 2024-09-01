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
        const res_obj = await ChemistryService.updateById(req?.user, req.body, req.params.id);
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get a chemistry item by its ID
    static getById = CatchAsync(async (req, res) => {
        console.log('Get all route accessed');
        const res_obj = await ChemistryService.getById(req?.user, req.params.id);
        return res.status(httpStatus.OK).json(res_obj);
    });

    // Get all chemistry items with pagination
    static GetAllItems = CatchAsync(async (req, res) => {
        console.log('Get all route accessed');
        const res_obj = await ChemistryService.GetAllItems(req?.user, req.query.page);
        return res.status(httpStatus.OK).json(res_obj);
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
