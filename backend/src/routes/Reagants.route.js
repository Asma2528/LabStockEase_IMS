const express = require("express");
const Authentication = require("../middlewares/Authentication");
const ReagantsController = require("../controllers/ReagantsController");
const ReagantsValidation = require("../validations/Reagants.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Reagants items without pagination
router.get("/get-all", ReagantsController.GetAllItems);

// Route to register a new Reagants item
router.post("/register", ReagantsValidation.RegisterReagants, Validation, ReagantsController.RegisterReagantsItem);

// Route to get a Reagants item by its ID
router.get("/get/:id", ReagantsValidation.Params_id, Validation, ReagantsController.getById);

// Route to update a Reagants item by its ID
router.patch("/update/:id", ReagantsValidation.RegisterReagants, Validation, ReagantsController.updateById);

// Route to delete a Reagants item by its ID
router.delete("/delete/:id", ReagantsValidation.Params_id, Validation, ReagantsController.DeleteReagantsItem);

router.get("/get-search", ReagantsController.GetReagantsItemForSearch);

module.exports = router;
