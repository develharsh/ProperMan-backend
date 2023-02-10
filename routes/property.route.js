const express = require("express");
const router = express.Router();
const {
  SendOTP,
  verifyOtp,
  loadSession,
} = require("../controllers/user.controller");
const { isAuthenticated } = require("../middlewares/auth");

router.get("/load-session", isAuthenticated, loadSession);
router.post("/send-otp", SendOTP);
router.post("/verify-otp", verifyOtp);

module.exports = router;
