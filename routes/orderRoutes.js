const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { validateCreateOrder, validateUpdateOrderStatus } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

// USER ORDER ROUTES (Cần xác thực)
/**
 * Tạo đơn hàng mới
 * POST /api/orders
 */
router.post('/', auth, validateCreateOrder, orderController.createOrder);

/**
 * Lấy danh sách đơn hàng của người dùng hiện tại
 * GET /api/orders/my-orders
 */
router.get('/my-orders', auth, orderController.getMyOrders);

/**
 * Lấy chi tiết đơn hàng
 * GET /api/orders/:id
 */
router.get('/:id', auth, orderController.getOrderDetail);

/**
 * Hủy đơn hàng
 * DELETE /api/orders/:id
 */
router.delete('/:id', auth, orderController.cancelOrder);

// ADMIN ORDER MANAGEMENT ROUTES (Chỉ Admin)
/**
 * Lấy tất cả đơn hàng
 * GET /api/orders (với query params: status, search)
 */
router.get('/', adminAuth, orderController.getAllOrders);

/**
 * Cập nhật trạng thái đơn hàng
 * PUT /api/orders/:id/status
 */
router.put('/:id/status', adminAuth, validateUpdateOrderStatus, orderController.updateOrderStatus);

/**
 * Cập nhật ghi chú đơn hàng
 * PUT /api/orders/:id/notes
 */
router.put('/:id/notes', adminAuth, orderController.updateOrderNotes);

/**
 * Lấy thống kê đơn hàng
 * GET /api/orders/stats
 */
router.get('/stats', adminAuth, orderController.getOrderStats);

module.exports = router;
