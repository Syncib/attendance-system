const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAdminAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ message: "Token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id, role } = jwt.verify(token, process.env.SECRET);
    
    if (role !== 'admin') {
      return res.status(403).json({ message: "Access denied" });
    }

    req.user = await User.findOne({ _id, role }).select("_id");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }
    
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = requireAdminAuth;
