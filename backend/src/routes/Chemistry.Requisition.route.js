const express = require("express");
const ChemistryRequisitionController = require("../controllers/ChemistryRequisitionController");
const Authentication = require("../middlewares/Authentication");
const roleMiddleware = require("../middlewares/roleMiddleware");
const Validation = require("../middlewares/Validation");
const ChemistryRequisitionValidation = require("../validations/Chemistry.Requisition.validation");

const router = express.Router();

// Apply authentication to all routes in this module
router.use(Authentication);

// Routes for faculty to create, view, update, and delete their requisitions
router.post(
  "/create",
  roleMiddleware(['chemistry-faculty','chemistry']),
  ChemistryRequisitionValidation.CreateRequisition,
  Validation,
  ChemistryRequisitionController.createRequisition
);

router.get(
  "/user-requisitions",
  roleMiddleware(['chemistry-faculty','chemistry']),
  ChemistryRequisitionController.getUserRequisitions
);

router.patch(
  "/update/:id",
  roleMiddleware(['chemistry-faculty','chemistry']),
  ChemistryRequisitionValidation.UpdateRequisition,
  Validation,
  ChemistryRequisitionController.updateRequisition
);


router.delete(
  "/delete/:id",
  roleMiddleware(['chemistry-faculty','chemistry']),
  ChemistryRequisitionValidation.Params_id,
  Validation,
  ChemistryRequisitionController.deleteRequisition
);

// Routes for admin to view and approve requisitions
router.get(
  "/all-requisitions",
  roleMiddleware(['admin']),
  ChemistryRequisitionController.getAllRequisitions
);

router.patch(
  "/approve/:id",
  roleMiddleware(['admin']),
  ChemistryRequisitionValidation.ApproveRequisition,
  Validation,
  ChemistryRequisitionController.approveRequisition
);


router.get(
    "/approved-requisitions",
    roleMiddleware(['chemistry']),
    ChemistryRequisitionController.getApprovedAndIssuedRequisitions
);

router.patch(
    "/change-status/:id",
    roleMiddleware(['chemistry']),
    ChemistryRequisitionController.changeStatusToIssued
);

module.exports = router;
