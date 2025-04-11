const express = require("express");
const { registerUser, loginUser, logoutUser } = require("../controllers/userController");

// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
// router.route("/me").get(isAuthenticatedUser, (req, res) => {
//     res.status(200).json({
//         success: true,
//         user: req.user,
//     });
// });
// router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles("admin"), (req, res) => {
//     res.status(200).json({
//         success: true,
//         message: "Admin users route",
//     });
// });

module.exports = router;