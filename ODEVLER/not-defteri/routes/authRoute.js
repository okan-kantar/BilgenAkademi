const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { verifyRefreshToken } = require("../middleware/auth");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", verifyRefreshToken, authController.refreshToken);

module.exports = router;