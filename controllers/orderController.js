const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const { sendSuccess, sendError, getPagination } = require('../utils/responseHandler');

/**
 * ✅ CREATE: Tạo đơn hàng mới
 * POST /api/orders
 */
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body;
        const userId = req.session.user._id;

        // 1️⃣ Kiểm tra dữ liệu
        if (!items || !Array.isArray(items) || items.length === 0) {
            return sendError(res, 'Đơn hàng phải có ít nhất 1 sản phẩm', 400);
        }

        if (!shippingAddress || !shippingAddress.name || !shippingAddress.phone || !shippingAddress.address) {
            return sendError(res, 'Vui lòng cung cấp địa chỉ giao hàng đầy đủ', 400);
        }

        // 2️⃣ Kiểm tra sản phẩm & tính tổng tiền
        let totalPrice = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return sendError(res, `Sản phẩm ${item.productId} không tồn tại`, 404);
            }

            if (!product.isActive) {
                return sendError(res, `Sản phẩm "${product.name}" đã ngừng bán`, 400);
            }

            if (product.stock < item.quantity) {
                return sendError(res, `Sản phẩm "${product.name}" chỉ còn ${product.stock} cái`, 400);
            }

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            orderItems.push({
                productId: product._id,
                productName: product.name,
                quantity: item.quantity,
                price: product.price
            });

            // Giảm stock
            product.stock -= item.quantity;
            await product.save();
        }

        // 3️⃣ Tạo đơn hàng
        const order = new Order({
            userId,
            items: orderItems,
            totalPrice,
            shippingAddress,
            status: 'pending',
            paymentStatus: 'pending'
        });

        await order.save();

        console.log(`✅ Tạo đơn hàng thành công: ${order._id}`);
        sendSuccess(res, order, 'Tạo đơn hàng thành công', 201);

    } catch (error) {
        console.error('❌ Error in createOrder:', error);
        sendError(res, 'Lỗi khi tạo đơn hàng', 500);
    }
};

/**
 * ✅ READ: Lấy đơn hàng của người dùng hiện tại
 * GET /api/orders/my-orders
 */
exports.getMyOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '' } = req.query;
        const userId = req.session.user._id;
        const { skip } = getPagination(page, limit);

        let filter = { userId };

        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('userId', 'username email');

        const total = await Order.countDocuments(filter);

        sendSuccess(res, {
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        }, 'Lấy danh sách đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in getMyOrders:', error);
        sendError(res, 'Lỗi khi lấy danh sách đơn hàng', 500);
    }
};

/**
 * ✅ READ: Lấy tất cả đơn hàng - Admin API
 * GET /api/orders
 */
exports.getAllOrders = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '', search = '' } = req.query;
        const { skip } = getPagination(page, limit);

        let filter = {};

        if (status) {
            filter.status = status;
        }

        if (search) {
            filter.$or = [
                { 'shippingAddress.name': { $regex: search, $options: 'i' } },
                { 'shippingAddress.phone': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 })
            .populate('userId', 'username email');

        const total = await Order.countDocuments(filter);

        sendSuccess(res, {
            orders,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        }, 'Lấy danh sách đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in getAllOrders:', error);
        sendError(res, 'Lỗi khi lấy danh sách đơn hàng', 500);
    }
};

/**
 * ✅ READ: Lấy chi tiết đơn hàng
 * GET /api/orders/:id
 */
exports.getOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id).populate('userId', 'username email');

        if (!order) {
            return sendError(res, 'Đơn hàng không tồn tại', 404);
        }

        // Kiểm tra quyền: user chỉ xem được đơn hàng của mình
        if (req.session.user.role !== 'admin' && order.userId._id.toString() !== req.session.user._id) {
            return sendError(res, 'Bạn không có quyền xem đơn hàng này', 403);
        }

        sendSuccess(res, order, 'Lấy chi tiết đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in getOrderDetail:', error);
        sendError(res, 'Lỗi khi lấy chi tiết đơn hàng', 500);
    }
};

/**
 * ✅ UPDATE: Cập nhật trạng thái đơn hàng - Admin API
 * PUT /api/orders/:id/status
 */
exports.updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return sendError(res, 'Đơn hàng không tồn tại', 404);
        }

        // Kiểm tra trạng thái hợp lệ
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        const validPaymentStatuses = ['pending', 'paid', 'failed'];

        if (status && !validStatuses.includes(status)) {
            return sendError(res, 'Trạng thái đơn hàng không hợp lệ', 400);
        }

        if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
            return sendError(res, 'Trạng thái thanh toán không hợp lệ', 400);
        }

        // Cập nhật
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();

        console.log(`✅ Cập nhật trạng thái đơn hàng: ${order._id} -> ${status}`);
        sendSuccess(res, order, 'Cập nhật trạng thái đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in updateOrderStatus:', error);
        sendError(res, 'Lỗi khi cập nhật trạng thái đơn hàng', 500);
    }
};

/**
 * ✅ UPDATE: Cập nhật ghi chú đơn hàng
 * PUT /api/orders/:id/notes
 */
exports.updateOrderNotes = async (req, res) => {
    try {
        const { id } = req.params;
        const { notes } = req.body;

        const order = await Order.findById(id);
        if (!order) {
            return sendError(res, 'Đơn hàng không tồn tại', 404);
        }

        order.notes = notes?.trim() || '';
        await order.save();

        console.log(`✅ Cập nhật ghi chú đơn hàng: ${order._id}`);
        sendSuccess(res, order, 'Cập nhật ghi chú thành công');

    } catch (error) {
        console.error('❌ Error in updateOrderNotes:', error);
        sendError(res, 'Lỗi khi cập nhật ghi chú', 500);
    }
};

/**
 * ✅ DELETE: Hủy đơn hàng
 * DELETE /api/orders/:id
 */
exports.cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);
        if (!order) {
            return sendError(res, 'Đơn hàng không tồn tại', 404);
        }

        // Chỉ có thể hủy đơn "pending" hoặc "confirmed"
        if (!['pending', 'confirmed'].includes(order.status)) {
            return sendError(res, 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý hoặc đã xác nhận', 400);
        }

        // Hoàn lại stock
        for (const item of order.items) {
            const product = await Product.findById(item.productId);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        order.status = 'cancelled';
        await order.save();

        console.log(`✅ Hủy đơn hàng: ${order._id}`);
        sendSuccess(res, order, 'Hủy đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in cancelOrder:', error);
        sendError(res, 'Lỗi khi hủy đơn hàng', 500);
    }
};

/**
 * 📊 BONUS: Lấy thống kê đơn hàng - Admin API
 * GET /api/orders/stats
 */
exports.getOrderStats = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        const stats = {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            ordersByStatus: ordersByStatus.reduce((acc, item) => {
                acc[item._id] = item.count;
                return acc;
            }, {})
        };

        sendSuccess(res, stats, 'Lấy thống kê đơn hàng thành công');

    } catch (error) {
        console.error('❌ Error in getOrderStats:', error);
        sendError(res, 'Lỗi khi lấy thống kê', 500);
    }
};
