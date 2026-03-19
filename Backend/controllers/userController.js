const User = require("../models/User");

// =====================
// ADD USER
// =====================
exports.addUser = async (req, res) => {
  const { firstName, lastName, email, role } = req.body;

  try {
    const newUser = new User({ firstName, lastName, email, role });
    await newUser.save();
    res.json("User Added");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error adding user");
  }
};

// =====================
// GET ALL USERS
// =====================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error fetching users");
  }
};

// =====================
// UPDATE USER
// =====================
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, role, status } = req.body;
    let user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error updating user");
  }
};

// =====================
// DELETE USER
// =====================
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json("User not found");

    await user.deleteOne();
    res.json("User deleted");
  } catch (err) {
    console.log(err);
    res.status(500).send("Error deleting user");
  }
};
