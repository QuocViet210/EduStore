const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRegister, validateLogin, validateUpdateUser, validateChangePassword } = require('../middleware/validation');
const { auth, adminAuth } = require('../middleware/auth');

// 🔒 AUTHENTICATION ROUTES (Công khai)
/**
 * Đăng ký tài khoản mới
 * POST /api/auth/register
 */
router.post('/auth/register', validateRegister, userController.register);

/**
 * Đăng nhập
 * POST /api/auth/login
 */
router.post('/auth/login', validateLogin, userController.login);

/**
 * Đăng xuất
 * POST /api/auth/logout
 */
router.post('/auth/logout', auth, userController.logout);

// 👤 USER ROUTES (Cần xác thực)
/**
 * Lấy thông tin cá nhân của người dùng
 * GET /api/users/profile/me
 */
router.get('/profile/me', auth, userController.getCurrentUser);

/**
 * Cập nhật thông tin cá nhân
 * PUT /api/users/profile/me
 */
router.put('/profile/me', auth, validateUpdateUser, userController.updateUser);

/**
 * Đổi mật khẩu
 * PUT /api/users/profile/change-password
 */
router.put('/profile/change-password', auth, validateChangePassword, userController.changePassword);

// 👥 ADMIN USER MANAGEMENT ROUTES (Chỉ Admin)
/**
 * Lấy danh sách tất cả người dùng
 * GET /api/users
 */
router.get('/', adminAuth, userController.getAllUsers);

/**
 * Lấy chi tiết người dùng
 * GET /api/users/:id
 */
router.get('/:id', adminAuth, userController.getUserById);

/**
 * Cập nhật thông tin người dùng (Admin)
 * PUT /api/users/:id
 */
router.put('/:id', adminAuth, validateUpdateUser, userController.updateUser);

/**
 * Xóa người dùng (Soft delete)
 * DELETE /api/users/:id
 */
router.delete('/:id', adminAuth, userController.deleteUser);

/**
 * Khôi phục người dùng đã xóa
 * PATCH /api/users/:id/restore
 */
router.patch('/:id/restore', adminAuth, userController.restoreUser);

module.exports = router;
