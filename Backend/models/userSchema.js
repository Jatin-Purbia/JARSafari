const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {        
            firstname:{
                type: String,
                required: [true, "Please enter a first name"],
            },
            lastname: {
                type: String,
                required: [true, "Please enter a last name"],       
           }
    },    
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
    },
    password: {            
        type: String,
        required: [true, "Please enter a password"],
    },    
    // role: {
    //     type: String,
    //     enum: ["user", "admin"], // Assuming you have a "user" and "admin" roles
    //     default: "user",
    // },
});

module.exports = mongoose.model("User", userSchema);        