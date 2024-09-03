const { body } = require("express-validator");

class AuthValidation {
    static RegisterUser = [
        body("token").notEmpty().withMessage("Token is Required"),

        body("name")
            .notEmpty()
            .withMessage("Name cannot be empty"),

        body("email")
            .isEmail()
            .withMessage("Email must be valid")
            .notEmpty()
            .withMessage("Email cannot be empty"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .notEmpty()
            .withMessage("Password is required"),
    ];

    static LoginUser = [
        body("token").notEmpty().withMessage("Token is Required"),
        
        body("email")
            .isEmail()
            .withMessage("Email must be valid")
            .notEmpty()
            .withMessage("Email cannot be empty"),

        body("password")
            .isLength({ min: 8 })
            .withMessage("Password must be at least 8 characters long")
            .notEmpty()
            .withMessage("Password is required"),
    ];
}

module.exports = AuthValidation;
