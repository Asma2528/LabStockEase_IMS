const express = require("express");
const Authentication = require("../middlewares/Authentication");
const ChemistryController = require("../controllers/ChemistryController");
const ChemistryValidation = require("../validations/Chemistry.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all chemistry items with pagination
router.get("/get-all", ChemistryValidation.query_page, Validation, ChemistryController.GetAllItems);

// Route to register a new chemistry item
router.post("/register", ChemistryValidation.RegisterChemistry, Validation, ChemistryController.RegisterChemistryItem);

// Route to get a chemistry item by its ID
router.get("/get/:id", ChemistryValidation.Params_id, Validation, ChemistryController.getById);

// Route to update a chemistry item by its ID
router.patch("/update/:id", ChemistryValidation.RegisterChemistry, Validation, ChemistryController.updateById);

// Route to delete a chemistry item by its ID
router.delete("/delete/:id", ChemistryValidation.Params_id, Validation, ChemistryController.DeleteChemistryItem);

router.get("/get-search",ChemistryController.GetChemistryItemForSearch);

module.exports = router;
