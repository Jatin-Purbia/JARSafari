const express = require("express");
const { registerUser, loginUser, logoutUser, getUserDetails, updatePassword, updateProfile } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middleware/auth");


// const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");
const router = express.Router();

router.route("/user/register").post(registerUser);
router.route("/user/login").post(loginUser);
router.route("/user/logout").get(logoutUser);
router.route("/user/getuser").get(isAuthenticatedUser, getUserDetails);
router.route("/user/updatepassword").put(isAuthenticatedUser, updatePassword);
router.route("/user/updateprofile").put(isAuthenticatedUser, updateProfile);

// router.route("/user/forgotpassword").post(forgotPassword);

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