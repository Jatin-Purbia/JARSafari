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
// Configure CORS to allow requests from the frontend
app.use(cors({
  origin: ['http://localhost:19006', 'http://10.23.38.80:19006', 'exp://10.23.38.80:19000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({ 
    success: true,
    status: "Server is running",
    timestamp: new Date().toISOString(),
    ip: req.ip,
    host: req.hostname
  });
});

// API version prefix
const API_PREFIX = "/api/v1";

//Route defination
app.use(`${API_PREFIX}`, plan);
app.use(`${API_PREFIX}`, user);
app.use(`${API_PREFIX}/auth`, auth);

//Middleware for error
// app.use(errprMiddleware);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl
  });
});

module.exports = app;