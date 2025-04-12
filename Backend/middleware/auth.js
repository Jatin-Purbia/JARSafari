const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
    const { token } = req.cookies; // Assuming the token is stored in cookies

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please log in to access this resource",
        });
    }

    try {
        // Verify the token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Attach the user to the request object
        req.User = await User.findById(decodedData.id);

        next();
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};