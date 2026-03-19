const router = require("express").Router();
const authMiddleware = require("../middleware/authMiddleware");
const { getAllGoals, createGoal, updateGoal, deleteGoal } = require("../controllers/goalController");

// get all goals
router.get("/", authMiddleware, getAllGoals);

// create a new goal
router.post("/", authMiddleware, createGoal);

// update a goal
router.put("/:id", authMiddleware, updateGoal);

// delete a goal
router.delete("/:id", authMiddleware, deleteGoal);

module.exports = router;
