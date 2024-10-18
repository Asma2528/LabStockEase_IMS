    const httpStatus = require("http-status");
    const ApiError = require("../utils/ApiError");

    // Role-based middleware
    const roleMiddleware = (roles) => (req, res, next) => {
        const userRole = req.user.role; // Assuming role is added to req.user in Authentication middleware

        if (!roles.includes(userRole)) {
            return next(new ApiError(httpStatus.FORBIDDEN, "Access denied"));
        }

        next();
    };

    module.exports = roleMiddleware;
