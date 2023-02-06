const userModel = require("../models/user.model");
const sms = require("../utils/sms");
const functions = require("../utils/functions");

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
// exports.SendOTP = (req, res) => {
//   try {
//   } catch (error) {
//     console.log(error);
//     error.code = error.implicit ? error.code : 500;
//     error.message =
//       error.implicit || error.message ? error.message : "Something went wrong";
//     res.status(error.code).json({ success: false, message: error.message });
//   }
// };
