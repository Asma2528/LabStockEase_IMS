const express = require("express");
const Authentication = require("../middlewares/Authentication");
const ChemicalsController = require("../controllers/ChemicalsController");
const ChemicalsValidation = require("../validations/Chemicals.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Chemicals items without pagination
router.get("/get-all", ChemicalsController.GetAllItems);

// Route to register a new Chemicals item
router.post("/register", ChemicalsValidation.RegisterChemicals, Validation, ChemicalsController.RegisterChemicalsItem);

// Route to get a Chemicals item by its ID
router.get("/get/:id", ChemicalsValidation.Params_id, Validation, ChemicalsController.getById);

// Route to update a Chemicals item by its ID
router.patch("/update/:id", ChemicalsValidation.RegisterChemicals, Validation, ChemicalsController.updateById);

// Route to delete a Chemicals item by its ID
router.delete("/delete/:id", ChemicalsValidation.Params_id, Validation, ChemicalsController.DeleteChemicalsItem);

router.get("/get-search", ChemicalsController.GetChemicalsItemForSearch);

module.exports = router;
