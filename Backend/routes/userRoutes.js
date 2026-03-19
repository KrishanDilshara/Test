const router = require("express").Router();
const { addUser, getAllUsers, updateUser, deleteUser } = require("../controllers/userController");

// add user
router.post("/add", addUser);

// get all users
router.get("/", getAllUsers);

// update user
router.put("/:id", updateUser);

// delete user
router.delete("/:id", deleteUser);

module.exports = router;