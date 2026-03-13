const User = require("../models/User");
const { generateToken } = require("../../shared/auth");

/**
 * POST /api/auth/register
 */
const register = async (req, res, next) => {
  try {
    console.log('📝 Registration attempt:', req.body.email, req.body.role);
    const { email } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already registered." });
    }

    console.log("User register2");

    const user = await User.create(req.body);
    console.log("✅ User created successfully");

    const token = generateToken(user);
    console.log("User Created", token);
    res.status(201).json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('❌ Registration Error:', error);
    next(error);
  }
};

/**
 * POST /api/auth/login
 */
const login = async (req, res, next) => {
  try {
    console.log('🔑 Login attempt:', req.body.email);
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials." });
    }

    const token = generateToken(user);
    console.log("Login Successful", token);

    res.json({
      success: true,
      data: { user, token },
    });
  } catch (error) {
    console.error('❌ Login Error:', error);
    next(error);
  }
};

/**
 * GET /api/auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found." });
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
