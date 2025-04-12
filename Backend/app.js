const express = require("express");
const mongoose = require("mongoose");

const errprMiddleware = require("./middleware/error");
//Route imports
const plan = require("./routes/planRoute");
const user = require("./routes/userRoute");
const app = express();

app.use(express.json());

//Route defination
app.use("/api/v1", plan);
app.use("/api/v1", user);

//Middleware for error
app.use(errprMiddleware);

module.exports = app;