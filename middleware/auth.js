/**
 * Middleware kiểm tra xác thực người dùng
 */
const auth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập để truy cập'
        });
    }
    req.user = req.session.user;
    next();
};

/**
 * Middleware kiểm tra quyền admin
 */
const adminAuth = (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: 'Vui lòng đăng nhập'
        });
    }

    if (req.session.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập'
        });
    }

    req.user = req.session.user;
    next();
};

module.exports = { auth, adminAuth };
