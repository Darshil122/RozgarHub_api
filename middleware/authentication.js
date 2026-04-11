const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    let token;

    // Check cookie
    if (req.cookies.token) {
      token = req.cookies.token;
    }

    // Fallback to Authorization header
    else if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Token is missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

module.exports = authentication;