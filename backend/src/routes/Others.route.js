const express = require("express");
const Authentication = require("../middlewares/Authentication");
const OthersController = require("../controllers/OthersController");
const OthersValidation = require("../validations/Others.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Others items without pagination
router.get("/get-all", OthersController.GetAllItems);

// Route to register a new Others item
router.post("/register", OthersValidation.RegisterOthers, Validation, OthersController.RegisterOthersItem);

// Route to get a Others item by its ID
router.get("/get/:id", OthersValidation.Params_id, Validation, OthersController.getById);

// Route to update a Others item by its ID
router.patch("/update/:id", OthersValidation.RegisterOthers, Validation, OthersController.updateById);

// Route to delete a Others item by its ID
router.delete("/delete/:id", OthersValidation.Params_id, Validation, OthersController.DeleteOthersItem);

router.get("/get-search", OthersController.GetOthersItemForSearch);

module.exports = router;
