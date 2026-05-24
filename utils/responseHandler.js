/**
 * Helper xử lý response thành công
 * @param {object} res - Response object
 * @param {*} data - Dữ liệu trả về
 * @param {string} message - Thông báo
 * @param {number} status - HTTP status code
 */
const sendSuccess = (res, data = null, message = 'Thành công', status = 200) => {
    res.status(status).json({
        success: true,
        message,
        data
    });
};

/**
 * Helper xử lý response lỗi
 * @param {object} res - Response object
 * @param {string} message - Thông báo lỗi
 * @param {number} status - HTTP status code
 * @param {*} details - Chi tiết lỗi (tuỳ chọn)
 */
const sendError = (res, message = 'Lỗi', status = 400, details = null) => {
    res.status(status).json({
        success: false,
        message,
        ...(details && { details })
    });
};

/**
 * Helper xử lý pagination
 * @param {number} page - Trang hiện tại (mặc định 1)
 * @param {number} limit - Số lượng item trên trang (mặc định 10)
 */
const getPagination = (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    return { skip, limit };
};

module.exports = {
    sendSuccess,
    sendError,
    getPagination
};
