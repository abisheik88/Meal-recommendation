const { registerUser, loginUser, logout, getUser, userStatus, updateUser, changePassword } = require("../controllers/UserController");
const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", protect, getUser)
router.get("/userstatus", userStatus)
router.patch("/update", protect, updateUser)
router.patch("/changepassword", protect, changePassword)


module.exports = router