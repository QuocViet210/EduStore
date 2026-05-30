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
    },
    isActive: {
        type: Boolean,
        default: true // Mặc định ai mới đăng ký cũng được hoạt động
    }
}, { timestamps: true });


// Pre-save hook: Hash password before saving
userSchema.pre('save', function (next) {
    // 1. Tự động cập nhật thời gian
    this.updatedAt = new Date();

    // 2. Mã hóa mật khẩu nếu có sự thay đổi (tạo mới hoặc đổi pass)
    if (this.isModified('password')) {
        this.password = crypto.createHash('sha256').update(this.password).digest('hex');
    }

});

// Phương thức so sánh mật khẩu
userSchema.methods.comparePassword = function (password) {
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    return this.password === hashedPassword;
};

module.exports = mongoose.model('User', userSchema);