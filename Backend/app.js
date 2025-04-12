const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// const errprMiddleware = require("./middleware/error");
//Route imports
const plan = require("./routes/planRoute");
const user = require("./routes/userRoute");
const auth = require("./routes/auth");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ status: "Server is running" });
});

//Route defination
app.use("/api/v1", plan);
app.use("/api/v1", user);
app.use("/api/v1/auth", auth);

//Middleware for error
// app.use(errprMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;