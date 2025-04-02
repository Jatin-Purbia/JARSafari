const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const connectDB = require("./config/database");

//config dotenv
dotenv.config({path: "backend/config/config.env"});

//connect to database
connectDB();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
});