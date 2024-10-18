const express = require("express");
const Authentication = require("../middlewares/Authentication");
const ReagentsController = require("../controllers/ReagentsController");
const ReagentsValidation = require("../validations/Reagents.validation");
const Validation = require("../middlewares/Validation");
const router = express.Router();

// Apply authentication middleware to all routes
router.use(Authentication);

// Route to get all Reagents items without pagination
router.get("/get-all", ReagentsController.GetAllItems);

// Route to register a new Reagents item
router.post("/register", ReagentsValidation.RegisterReagents, Validation, ReagentsController.RegisterReagentsItem);

// Route to get a Reagents item by its ID
router.get("/get/:id", ReagentsValidation.Params_id, Validation, ReagentsController.getById);

// Route to update a Reagents item by its ID
router.patch("/update/:id", ReagentsValidation.RegisterReagents, Validation, ReagentsController.updateById);

// Route to delete a Reagents item by its ID
router.delete("/delete/:id", ReagentsValidation.Params_id, Validation, ReagentsController.DeleteReagentsItem);

router.get("/get-search", ReagentsController.GetReagentsItemForSearch);


router.post(
    "/register-log",
    ReagentsValidation.LogIssuedQuantity,  // Validation for logging quantity
    Validation,  // General validation middleware
    ReagentsController.LogIssuedQuantity  // Controller to handle logging
  );

  router.get("/get-all-logs", ReagentsController.GetLogs);

  router.get("/get-search-log", ReagentsController.SearchLogs);

  router.patch("/update-log/:id",  ReagentsValidation.LogIssuedQuantity, Validation, ReagentsController.updateLogById);

  router.delete("/delete-log/:id", ReagentsValidation.Params_id, Validation, ReagentsController.DeleteReagentsLogItem);

module.exports = router;
