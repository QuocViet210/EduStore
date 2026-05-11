const mongoose = require('mongoose');

// Tạo cấu trúc (Schema) cho một đồ dùng văn phòng phẩm
const productSchema = new mongoose.Schema({
    sku: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    imageUrl: {
        type: String,
        default: '/img/van-phong-pham-01.jpg'
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
