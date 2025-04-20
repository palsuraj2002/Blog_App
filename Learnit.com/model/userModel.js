const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio: { type: String },
    joinDate: { type: Date, default: Date.now }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;