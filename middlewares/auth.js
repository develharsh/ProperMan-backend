const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

module.exports.isAuthenticated = async (req, res, next) => {
  try {
    let token = req.headers.authorization,
      response = null;
    if (token) {
      token = token.replace("Bearer ", "");
      const payload = jwt.verify(token, process.env.NODE_APP_JWT_SECRET);
      if (payload.role === "Client") {
        response = await userModel.findOne({ _id: payload._id });
      } else throw { message: "Invalid Token" };
      if (!response) throw { message: "Please Log In Again" };
      else {
        req.user = response;
        req.user.role = payload.role;
      }
    } else throw { message: "Please Log In Again" };
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

module.exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.user.role))
        throw new Error("You are not authorized to access this resource");
      return next();
    } catch (err) {
      const { message } = err;
      return res.status(403).json({ success: false, message });
    }
  };
};
