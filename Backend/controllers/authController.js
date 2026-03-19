const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =====================
// REGISTER
// =====================
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // basic validation
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json("All fields are required");
    }

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json("Email already exists");
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: role || "student",
    });

    await newUser.save();
    return res.status(201).json("User Registered");
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
};

// =====================
// LOGIN
// =====================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // basic validation
    if (!email || !password) {
      return res.status(400).json("Email and password are required");
    }

    // check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json("User not found");
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid password");
    }

    // create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      message: "Login successful",
      token,
      role: user.role,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
};

// =====================
// GET CURRENT USER
// =====================
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json("User not found");
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server error");
  }
};
