const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/database");

//config dotenv
dotenv.config();

//connect to database
connectDB();

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to uncaught exception");
  process.exit(1);
});

const PORT = process.env.PORT || 4000;
const HOST = '172.31.107.222'; // Use the specific IP address

const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
  console.log(`You can also access it via http://localhost:${PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
