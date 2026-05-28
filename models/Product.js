const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    imageUrl: {
        type: String,
        default: '/img/default-product.png'
    },
    category: {
        type: String,
        enum: ['Bút', 'Sổ', 'Dấu', 'Khác'],
        default: 'Khác'
    },
    description: {
        type: String,
        maxlength: 500
    },
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

// Tự động cập nhật updatedAt trước khi lưu
productSchema.pre('save', function () {
    this.updatedAt = new Date();
});

module.exports = mongoose.model('Product', productSchema);