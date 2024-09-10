const User = require("../models/User");
const jwt = require("jsonwebtoken");

const createToken = (user) => {
  const payload = { _id: user._id, role: user.role };
  return jwt.sign(payload, process.env.SECRET, { expiresIn: "3d" });
};

//register user
const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.register(name, email, password, role);
    //create a token

    const token = createToken({_id:user._id,role:user.role});
    res.status(201).json({_id:user._id,name:user.name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email,password)
    //create a token
    const token = createToken({_id:user._id,role:user.role});
    res.status(201).json({_id:user._id,name:user.name, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { registerUser, loginUser };
