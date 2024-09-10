const express = require("express");
const Authentication = require("../middlewares/Authentication");
const GlasswareController = require("../controllers/GlasswareController");
const GlasswareValidation = require("../validations/Glassware.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Glassware items without pagination
router.get("/get-all", GlasswareController.GetAllItems);

// Route to register a new Glassware item
router.post("/register", GlasswareValidation.RegisterGlassware, Validation, GlasswareController.RegisterGlasswareItem);

// Route to get a Glassware item by its ID
router.get("/get/:id", GlasswareValidation.Params_id, Validation, GlasswareController.getById);

// Route to update a Glassware item by its ID
router.patch("/update/:id", GlasswareValidation.RegisterGlassware, Validation, GlasswareController.updateById);

// Route to delete a Glassware item by its ID
router.delete("/delete/:id", GlasswareValidation.Params_id, Validation, GlasswareController.DeleteGlasswareItem);

router.get("/get-search", GlasswareController.GetGlasswareItemForSearch);

module.exports = router;
