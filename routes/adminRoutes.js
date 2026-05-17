const express = require('express');
const router = express.Router();
const multer = require('multer');
const adminController = require('../controllers/adminController');

// Cấu hình nơi lưu ảnh (Bài 8)
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/img'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// Route hiển thị trang chủ Admin (Dashboard)
router.get('/', adminController.getDashboard);

// Route hiển thị form Thêm sản phẩm
router.get('/add-product', (req, res) => {
    console.log("👉 Đã vào được Route: /admin/add-product");
    res.render('admin/add-product');
});

// Route xử lý lưu dữ liệu (Dùng middleware upload.single('image'))
router.post('/add-product', upload.single('image'), adminController.postAddProduct);

module.exports = router;