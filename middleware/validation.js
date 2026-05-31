/**
 * Middleware xác thực dữ liệu request
 */
const { body, validationResult } = require('express-validator');

/**
 * Middleware xử lý kết quả validation
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Dữ liệu không hợp lệ',
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    }
    next();
};

/**
 * Validators cho SẢN PHẨM
 */
const validateProduct = [
    body('name')
        .trim()
        .notEmpty().withMessage('Tên sản phẩm không được để trống')
        .isLength({ min: 3 }).withMessage('Tên sản phẩm phải ít nhất 3 ký tự'),

    body('price')
        .isFloat({ min: 0.01 }).withMessage('Giá phải lớn hơn 0'),

    body('stock')
        .isInt({ min: 0 }).withMessage('Số lượng phải >= 0'),

    body('category')
        .trim()
        .notEmpty().withMessage('Danh mục không được để trống'),

    handleValidationErrors
];

/**
 * Validators cho ĐĂNG KÝ
 */
const validateRegister = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 50 }).withMessage('Username phải 3-50 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username chỉ được chứa chữ, số, dấu gạch dưới'),

    body('email')
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('password')
        .isLength({ min: 6 }).withMessage('Mật khẩu phải ít nhất 6 ký tự'),

    body('confirmPassword')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Mật khẩu không khớp');
            }
            return true;
        }),

    handleValidationErrors
];

/**
 * Validators cho ĐĂNG NHẬP
 */
const validateLogin = [
    body('email')
        .notEmpty().withMessage('Email không được để trống')
        .isEmail().withMessage('Email không hợp lệ'),

    body('password')
        .notEmpty().withMessage('Mật khẩu không được để trống'),

    handleValidationErrors
];

/**
 * Validators cho CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
 */
const validateUpdateUser = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3 }).withMessage('Username phải ít nhất 3 ký tự')
        .matches(/^[a-zA-Z0-9_]+$/).withMessage('Username chỉ được chứa chữ, số, dấu gạch dưới'),

    body('email')
        .optional()
        .isEmail().withMessage('Email không hợp lệ')
        .normalizeEmail(),

    body('phone')
        .optional()
        .trim()
        .matches(/^[0-9\-\+]{10,}$/).withMessage('Số điện thoại không hợp lệ'),

    body('address')
        .optional()
        .trim()
        .isLength({ min: 5 }).withMessage('Địa chỉ phải ít nhất 5 ký tự'),

    handleValidationErrors
];

/**
 * Validators cho ĐỔI MẬT KHẨU
 */
const validateChangePassword = [
    body('oldPassword')
        .notEmpty().withMessage('Mật khẩu cũ không được để trống'),

    body('newPassword')
        .notEmpty().withMessage('Mật khẩu mới không được để trống')
        .isLength({ min: 6 }).withMessage('Mật khẩu mới phải ít nhất 6 ký tự'),

    body('confirmPassword')
        .notEmpty().withMessage('Xác nhận mật khẩu không được để trống')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Mật khẩu mới không khớp');
            }
            return true;
        }),

    handleValidationErrors
];

/**
 * Validators cho TẠO ĐƠN HÀNG
 */
const validateCreateOrder = [
    body('items')
        .isArray({ min: 1 }).withMessage('Đơn hàng phải có ít nhất 1 sản phẩm'),

    body('items.*.productId')
        .notEmpty().withMessage('ID sản phẩm không được để trống'),

    body('items.*.quantity')
        .isInt({ min: 1 }).withMessage('Số lượng phải >= 1'),

    body('shippingAddress.name')
        .trim()
        .notEmpty().withMessage('Tên người nhận không được để trống')
        .isLength({ min: 3 }).withMessage('Tên phải ít nhất 3 ký tự'),

    body('shippingAddress.phone')
        .trim()
        .notEmpty().withMessage('Số điện thoại không được để trống')
        .matches(/^[0-9\-\+]{10,}$/).withMessage('Số điện thoại không hợp lệ'),

    body('shippingAddress.address')
        .trim()
        .notEmpty().withMessage('Địa chỉ không được để trống')
        .isLength({ min: 5 }).withMessage('Địa chỉ phải ít nhất 5 ký tự'),

    handleValidationErrors
];

/**
 * Validators cho CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG
 */
const validateUpdateOrderStatus = [
    body('status')
        .optional()
        .isIn(['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'])
        .withMessage('Trạng thái đơn hàng không hợp lệ'),

    body('paymentStatus')
        .optional()
        .isIn(['pending', 'paid', 'failed'])
        .withMessage('Trạng thái thanh toán không hợp lệ'),

    handleValidationErrors
];

module.exports = {
    validateProduct,
    validateRegister,
    validateLogin,
    validateUpdateUser,
    validateChangePassword,
    validateCreateOrder,
    validateUpdateOrderStatus,
    handleValidationErrors
};
