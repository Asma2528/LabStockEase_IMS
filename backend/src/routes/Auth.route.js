const AuthController = require("../controllers/Auth.controller");
const Authentication = require("../middlewares/Authentication");
const Validation = require("../middlewares/Validation");
const AuthValidation = require("../validations/Auth.validation");
const roleMiddleware = require("../middlewares/roleMiddleware");
const forgotPasswordRouter = require('./Auth.forgotPassword');

const router = require("express").Router();

// Public routes
router.post("/register", AuthValidation.RegisterUser, Validation, AuthController.RegisterUser);
router.post("/login", AuthValidation.LoginUser, Validation, AuthController.LoginUser);

// Add forgot password routes
router.use('/forgot-password', forgotPasswordRouter);// Mount the forgetPassword router

// Protected routes with role-based access
router.get("/profile", Authentication, AuthController.ProfileController);

// Role-based routes for different departments
router.get("/chemistry", Authentication, roleMiddleware(['chemistry', 'admin']), (req, res) => {
    res.send("Chemistry department content");
});

router.get("/physics", Authentication, roleMiddleware(['physics', 'admin']), (req, res) => {
    res.send("Physics department content");
});

router.get("/biology", Authentication, roleMiddleware(['biology', 'admin']), (req, res) => {
    res.send("Biology department content");
});

router.get("/botany", Authentication, roleMiddleware(['botany', 'admin']), (req, res) => {
    res.send("Botany department content");
});

router.get("/microbiology", Authentication, roleMiddleware(['microbiology', 'admin']), (req, res) => {
    res.send("Microbiology department content");
});

router.get("/lifescience", Authentication, roleMiddleware(['lifescience', 'admin']), (req, res) => {
    res.send("Life Science department content");
});

// Admin-specific routes
router.get("/admin", Authentication, roleMiddleware(['admin']), (req, res) => {
    res.send("Admin dashboard");
});

module.exports = router;
