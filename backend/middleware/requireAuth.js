const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = async (req, res, next) => {
  // Get the authorization header
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Token required" });n
  }

  const token = authorization.split(" ")[1];

  try {
    // Verify the token
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAuth;
