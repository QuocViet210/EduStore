const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // unique: Không cho phép trùng email
    password: { type: String, required: true },
    role: { type: String, default: 'user' } // Quản trị viên sẽ mang giá trị 'admin'
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);