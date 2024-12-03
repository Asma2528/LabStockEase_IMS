const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { validateToken } = require("../utils/Token.utils");
const UserModel = require('../models/user.models'); // Adjust the path to your User model

const Authentication = async (req, res, next) => {
    try {
        const headers = req.headers['authorization'] || '';
        // console.log("Authorization header:", headers);
        
        if (!headers || !headers.startsWith("Bearer ")) {
            // console.log("Authorization header missing or incorrect format");
            throw new ApiError(httpStatus.UNAUTHORIZED, "Please login first");
        }

        const auth_token = headers.split(" ")[1];
        // console.log("Extracted token:", auth_token);

        if (!auth_token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Please provide a valid token");
        }

        const data = validateToken(auth_token);
        // console.log("Decoded token data:", data);

        if (!data || !data.userid || !data.role) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
        }

        // Retrieve user information from the database
        // console.log("Retrieving user from database...");
        const user = await UserModel.findById(data.userid).select('email role');
        if (!user) {
            // console.log("User not found");
            throw new ApiError(httpStatus.UNAUTHORIZED, "User not found");
        }

        // console.log("User found:", user);
        req.user = { id: data.userid, email: user.email, role: user.role };
        next();
    } catch (error) {
        console.error("Authentication error:", error);
        next(error);
    }
};


module.exports = Authentication;
