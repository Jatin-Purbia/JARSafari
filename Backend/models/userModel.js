const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
           
    firstname:{
        type: String,
        required: [true, "Please enter a first name"],
        minlength: [3, "First name should be greater than 3 characters"],
        maxlength: [20, "First name should be less than 20 characters"],
    },
    lastname: {
        type: String,
        required: [true, "Please enter a last name"],            
        minlength: [3, "Last name should be greater than 3 characters"],
        maxlength: [20, "Last name should be less than 20 characters"],     
    } ,  
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [validator.isEmail, "Please enter a valid email"],
        lowercase: true,
        minlength: [3, "Email should be greater than 3 characters"],
        maxlength: [30, "Email should be less than 30 characters"],

    },
    password: {            
        type: String,
        required: [true, "Please enter a password"],
        minlength: [6, "Password should be greater than 6 characters"],
        select: false, // Do not return password by default
    },    
    role: {
        type: String,
        enum: ["user", "admin"], // Assuming you have a "user" and "admin" roles
        default: "user",
    },
    
resetpasswordToken: String,
resetpasswordExpire: Date,
});


//in arrow function we cannot use this keyword , then we use normal function
//Hash password before saving to database
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
});


//JWT Token
userSchema.methods.getJWTToken = function() {
    return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
    });
};

//Compare password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

//Generate password reset token
// userSchema.methods.getResetPasswordToken = function() {
//     // Generate token
//     const resetToken = crypto.randomBytes(20).toString("hex");
//     // Hash and set to resetPasswordToken field
//     this.resetPasswordToken = crypto
//         .createHash("sha256")
//         .update(resetToken)
//         .digest("hex");   // he is using sha256 hashing algorithm to hash the token
//     // Set token expire time
//     this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
//     return resetToken;  
// }

module.exports = mongoose.model("User", userSchema);        