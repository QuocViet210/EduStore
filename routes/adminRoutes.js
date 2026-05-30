const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth, requireAdmin } = require('../middleware/auth');
const upload = require('../config/multer');


// ✅ MIDDLEWARE: Kiểm tra admin
router.use(adminAuth);

// ✅ DASHBOARD
router.get('/', adminController.getDashboard);

router.get('/chat', adminAuth, adminController.getChatPage);

// ✅ PRODUCTS MANAGEMENT
router.get('/products', adminController.getProductsList);
router.get('/products/add', adminController.getAddProductPage);
router.post('/products/add', upload.single('image'), adminController.postAddProduct);
router.get('/products/edit/:id', adminController.getEditProductPage);
router.post('/products/edit/:id', upload.single('image'), adminController.postUpdateProduct);
router.post('/products/delete/:id', adminController.postDeleteProduct);

// ✅ ORDERS MANAGEMENT
router.get('/orders', adminController.getOrdersList);
router.get('/orders/:id', adminController.getOrderDetail);
router.post('/orders/:id/update-status', adminController.postUpdateOrderStatus);

// ✅ USERS MANAGEMENT
router.get('/users', adminController.getUsersList);
router.patch('/users/toggle-status/:id', requireAdmin, adminController.toggleUserStatus);

module.exports = router;