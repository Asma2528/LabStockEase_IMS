const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: [true, "Email ID is required"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Password ID is required"],
        trim: true
    },
    role: {
        type: String,
        enum: ['admin', 'chemistry', 'physics', 'biology', 'botany', 'microbiology', 'lifescience'],
        required: [true, "Role is required"]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

const model = mongoose.model("user", Schema);
module.exports = model;
