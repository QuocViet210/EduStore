const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    // Trỏ tới ID của người dùng đã mua hàng (Khóa ngoại)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Mảng chứa các sản phẩm họ đã mua
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true }
    }],

    totalPrice: { type: Number, required: true },
    status: { type: String, default: 'Đang xử lý' } // Trạng thái đơn hàng
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);