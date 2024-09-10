const express = require("express");
const Authentication = require("../middlewares/Authentication");
const MeasuringController = require("../controllers/MeasuringController");
const MeasuringValidation = require("../validations/Measuring.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Measuring items without pagination
router.get("/get-all", MeasuringController.GetAllItems);

// Route to register a new Measuring item
router.post("/register", MeasuringValidation.RegisterMeasuring, Validation, MeasuringController.RegisterMeasuringItem);

// Route to get a Measuring item by its ID
router.get("/get/:id", MeasuringValidation.Params_id, Validation, MeasuringController.getById);

// Route to update a Measuring item by its ID
router.patch("/update/:id", MeasuringValidation.RegisterMeasuring, Validation, MeasuringController.updateById);

// Route to delete a Measuring item by its ID
router.delete("/delete/:id", MeasuringValidation.Params_id, Validation, MeasuringController.DeleteMeasuringItem);

router.get("/get-search", MeasuringController.GetMeasuringItemForSearch);

module.exports = router;
