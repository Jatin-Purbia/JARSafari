const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a plan name"],
    },
    description: {
        type: String,
        required: [true, "Please enter a plan description"],
    },
    price: {
        type: Number,
        required: [true, "Please enter a plan price"],
    },
    duration: {
        type: Number,
        required: [true, "Please enter a plan duration"],
    },
});

module.exports = mongoose.model("Plan", planSchema);