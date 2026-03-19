const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Import config
const connectDB = require("./config/database");

// Import routes
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const testRoutes = require("./routes/testRoutes");
const dashboardRouter = require("./routes/dashboardRoutes");
const goalRoutes = require("./routes/goalRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/user", userRouter);
app.use("/api", testRoutes);
app.use("/api", dashboardRouter);
app.use("/api/goals", goalRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Backend server is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});

