/**
 * Middleware xử lý lỗi toàn cục
 * Tất cả lỗi sẽ được format theo chuẩn JSON
 */
const errorHandler = (err, req, res, next) => {
    // Log lỗi ra console (dùng cho development)
    console.error('🔴 Error:', {
        message: err.message,
        status: err.status || 500,
        path: req.path,
        method: req.method
    });

    // Lấy status code và message từ error object
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Lỗi máy chủ nội bộ';

    // Trả về response JSON
    res.status(status).json({
        success: false,
        status,
        message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.details
        })
    });
};

module.exports = errorHandler;
