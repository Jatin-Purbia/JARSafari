const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3 , 'Firstname must be at least 3 characters long']
        },
        lastname: { 
            type: String,
            // required: true,
            minlength: [3 , 'Lastname must be at least 3 characters long']
        }       
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [3 , 'Email must be at least 3 characters long']    
    },
    password: {
        type: String,
        required: true,  
        select: false      
    },
    socketId: {  //for tracking captian
        type: String,
        // required: true
    }
}); 

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
    return token;
}

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);   
}

userSchema.statics.hashPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
