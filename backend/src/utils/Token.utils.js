const jwt = require("jsonwebtoken");
const { PUBLIC_DATA } = require("../../constant");

// Function to generate a token with user ID and role
exports.generateToken = (user, expire = '1d') => {
    // Include the role in the token payload
    const token = jwt.sign(
        {
            userid: user._id,
            role: user.role // Include role here
        },
        PUBLIC_DATA.jwt_auth,
        {
            expiresIn: expire
        }
    );
    return token;
};

// Function to validate and decode a token
exports.validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, PUBLIC_DATA.jwt_auth);
        return {
            userid: decoded.userid,
            role: decoded.role // Ensure role is returned here
        };
    } catch (error) {
        return null; // Handle invalid or expired tokens
    }
};
