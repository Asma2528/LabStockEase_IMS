const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const { validateToken } = require("../utils/Token.utils");

const Authentication = (req, res, next) => {
    try {
        const headers = req.headers['authorization'] || ''; // Use lowercase 'authorization'
        if (!headers || !headers.startsWith("Bearer ")) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Please login first");
        }

        const auth_token = headers.split(" ")[1];
        if (!auth_token) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Please provide a valid token");
        }

        const data = validateToken(auth_token);
        if (!data) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid token");
        }

        req.user = data.userid; // Set the user info to the request object
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = Authentication;
