const express = require("express");
const mongoose = require("mongoose");

//Route imports
const plan = require("./routes/planRoute");

const app = express();

app.use(express.json());

//Route defination
app.use("/api/v1", plan);



module.exports = app;