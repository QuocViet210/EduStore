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
    // Tìm đoạn khai báo category và sửa lại như sau:
    category: {
        type: String,
        required: [true, 'Danh mục không được để trống'],
        // ENUM: Chỉ cho phép lưu 1 trong các giá trị dưới đây. Nhập sai sẽ bị chặn!
        enum: {
            values: ['Bút', 'Vở', 'Thước', 'Băng keo', 'Giấy', 'Máy tính', 'Khác'],
            message: 'Danh mục {VALUE} không hợp lệ! Vui lòng chọn danh mục có sẵn.'
        }
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