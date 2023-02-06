const express = require("express");
const router = express.Router();
const { SendOTP } = require("../controllers/user.controller");

router.post("/send-otp", SendOTP);

module.exports = router;
