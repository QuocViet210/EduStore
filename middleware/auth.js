/**
 * Middleware kiểm tra xác thực người dùng chung (User)
 */
const auth = (req, res, next) => {
    // Nếu chưa đăng nhập
    if (!req.session.user) {
        // Kiểm tra xem yêu cầu là API hay lướt Web
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập để truy cập'
            });
        } else {
            // Khách hàng bấm nút trên web -> Đá về trang đăng nhập
            return res.redirect('/login');
        }
    }

    req.user = req.session.user;
    next();
};

/**
 * Middleware kiểm tra quyền Quản trị viên (Admin)
 */
const adminAuth = (req, res, next) => {
    // 1. Kiểm tra đăng nhập trước
    if (!req.session.user) {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập'
            });
        } else {
            return res.redirect('/login');
        }
    }

    // 2. Kiểm tra quyền Admin
    if (req.session.user.role !== 'admin') {
        if (req.originalUrl.startsWith('/api')) {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập khu vực Admin!'
            });
        } else {
            // Không phải Admin mà ráng vào lướt web Admin -> Đá về trang chủ
            return res.redirect('/');
        }
    }

    req.user = req.session.user;
    next();
};

// Middleware kiểm tra xem user có phải là admin không
const requireAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        next();
    } else {
        return res.status(403).send('Truy cập bị từ chối! Bạn không có quyền quản trị.');
    }
};

module.exports = { auth, adminAuth, requireAdmin };