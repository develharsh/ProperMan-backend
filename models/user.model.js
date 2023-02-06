const mongoose = require("mongoose");

const userDetails = new mongoose.Schema(
  {
    name: String,
    phone_number: {
      type: String,
      required: true,
      unique: true,
    },
    dob: Date,
    email: String,
    gender: String,
    maritalStatus: String,
    aadhaar: String,
    pan: String,
    address: String,
    otp: {
      type: String,
      default: "AAAAAA",
    },
    otp_trial_left: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.User || mongoose.model("User", userDetails);
