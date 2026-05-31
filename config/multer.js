const multer = require('multer');
const path = require('path');
const fs = require('fs');



// Tạo thư mục uploads nếu chưa tồn tại
const uploadDir = path.join(__dirname, '../public/uploads/products');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Cấu hình storage (nơi lưu file)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Tên file: timestamp + tên file gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'product-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// Kiểm tra loại file
const fileFilter = (req, file, cb) => {
    // Chỉ cho phép ảnh
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ cho phép upload ảnh (JPG, PNG, GIF)'), false);
    }
};

// Tạo instance multer
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024  // 5MB
    }
});

module.exports = upload;
