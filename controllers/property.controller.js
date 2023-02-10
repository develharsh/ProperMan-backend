const userModel = require("../models/user.model");
const sms = require("../utils/sms");
const functions = require("../utils/functions");
const jwt = require("jsonwebtoken");

exports.SendOTP = async (req, res) => {
  try {
    if (!req.body.phone_number)
      throw {
        message: "Phone number is missing",
        code: 400,
        implicit: true,
      };
    req.body.phone_number = `+91${req.body.phone_number.replace("+91", "")}`;
    const otp = functions.generateOTP();
    sms.sendOtp(req.body, otp);
    await userModel.findOneAndUpdate(
      { phone_number: req.body.phone_number },
      {
        phone_number: req.body.phone_number,
        otp,
        otp_trial_left: 3,
      },
      { upsert: true }
    );
    res.status(200).json({ success: true, message: "Message sent" });
  } catch (error) {
    console.log(error);
    error.code = error.implicit ? error.code : 500;
    error.message =
      error.implicit || error.message ? error.message : "Something went wrong";
    res.status(error.code).json({ success: false, message: error.message });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    if (!req.body.phone_number)
      throw {
        message: "Phone number is missing",
        code: 400,
        implicit: true,
      };
    req.body.phone_number = `+91${req.body.phone_number.replace("+91", "")}`;
    if (!req.body.otp)
      throw {
        message: "Otp is missing",
        code: 400,
        implicit: true,
      };
    const user = await userModel.findOne({
      phone_number: req.body.phone_number,
    });
    if (!user)
      throw {
        message: "No such user exists with the given phone number",
        code: 500,
        implicit: true,
      };
    if (user.otp === "AAAAAA") {
      throw {
        message: "OTP Verification trials exceeded, Please Send OTP Again",
        code: 500,
        implicit: true,
      };
    }
    if (user.otp_trial_left < 1) {
      throw {
        message: "OTP Verification trials exceeded, Please Send OTP Again",
        code: 500,
        implicit: true,
      };
    }
    if (user.otp !== req.body.otp) {
      user.otp_trial_left -= 1;
      user.save();
      throw { message: "Invalid OTP was entered", code: 400, implicit: true };
    }
    user.otp_trial_left = 0;
    user.otp = "AAAAAA";
    user.save();
    user.otp = undefined;
    user.otp_trial_left = undefined;
    user.role = "Client";
    const token = jwt.sign(
      { role: user.role, _id: user._id },
      process.env.NODE_APP_JWT_SECRET,
      { expiresIn: process.env.NODE_APP_JWT_EXPIRE }
    );
    res.status(200).json({
      success: true,
      message: "OTP verified, Logging you in...",
      token,
      data: user,
    });
  } catch (error) {
    console.log(error);
    const response = { success: false };
    error.code = error.implicit ? error.code : 500;
    response.message =
      error.implicit || error.message ? error.message : "Something went wrong";
    if (error.detail) response.detail = error.detail;
    res.status(error.code).json(response);
  }
};
exports.loadSession = async (req, res) => {
  try {
    req.user.otp = undefined;
    req.user.otp_trial_left = undefined;
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    console.log(error);
    const response = { success: false };
    error.code = error.implicit ? error.code : 500;
    response.message =
      error.implicit || error.message ? error.message : "Something went wrong";
    if (error.detail) response.detail = error.detail;
    res.status(error.code).json(response);
  }
};
// exports.SendOTP = (req, res) => {
//   try {
//     res.status(200).json({ success: true });
//   } catch (error) {
//     console.log(error);
//     const response = { success: false };
//     error.code = error.implicit ? error.code : 500;
//     response.message =
//       error.implicit || error.message ? error.message : "Something went wrong";
//     if (error.detail) response.detail = error.detail;
//     res.status(error.code).json(response);
//   }
// };
