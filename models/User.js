const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /.+\@.+\..+/
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    phone: String,
    address: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Thay thế đoạn cũ bằng đoạn này trong file models/User.js

userSchema.pre('save', async function (next) {
    // 1. Kiểm tra: nếu mật khẩu không bị thay đổi thì không cần băm lại
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // 2. Băm mật khẩu (Dùng crypto theo ý bạn)
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');

        // 3. Cập nhật updatedAt
        this.updatedAt = new Date();

        // 4. Gọi next() để hoàn thành middleware
        next();
    } catch (error) {
        // Nếu có lỗi, truyền error vào next để Mongoose bắt lỗi
        next(error);
    }
});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = function (password) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    return this.password === hashedPassword;
};

module.exports = mongoose.model('User', userSchema);