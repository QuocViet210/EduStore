const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Tham chiếu tới người dùng
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    // Danh sách sản phẩm trong đơn hàng
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        productName: String,
        quantity: {
            type: Number,
            required: true,
            min: 1
        },
        price: {
            type: Number,
            required: true
        }
    }],

    // Thông tin thanh toán
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },

    // Thông tin giao hàng
    shippingAddress: {
        name: String,
        phone: String,
        address: String,
        ward: String,
        district: String,
        city: String
    },

    // Trạng thái đơn hàng
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },

    // Phương thức thanh toán
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'bank_transfer', 'cod', 'transfer', 'COD', 'Bank Transfer'],
        default: 'cod'
    },

    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending'
    },

    // Ghi chú đơn hàng
    notes: String,

    // Timestamp
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

// Index để tìm kiếm nhanh
orderSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Order', orderSchema);