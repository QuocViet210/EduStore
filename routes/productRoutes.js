const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');
const { validateProduct } = require('../middleware/validation');
const { adminAuth, auth } = require('../middleware/auth');
const upload = require('../config/multer');
const userController = require('../controllers/userController');

// ✅ AUTH ROUTES - Render pages
router.get('/login', userController.getLoginPage);
router.get('/register', userController.getRegisterPage);
router.get('/profile', auth, userController.getProfilePage);
router.get('/change-password', auth, userController.getChangePasswordPage);

// ✅ ROUTES RENDER (EJS) - Công khai
router.get('/', productController.getAllProducts);
router.get('/shop', productController.getShop);
router.get('/product', (req, res) => res.redirect('/shop'));
router.get('/product/:id', productController.getProductDetail);
router.get('/single', (req, res) => {
    res.redirect('/shop');
});
router.get('/cart', cartController.getCart);
router.get('/cart/add/:id', cartController.addToCart);
router.get('/cart/remove/:id', cartController.removeFromCart);
router.get('/cart/update/:id', cartController.updateCart);
router.get('/checkout', (req, res) => res.render('checkout'));
router.get('/contact', (req, res) => res.render('contact'));

// ✅ API ROUTES - Công khai (Read)
// Lấy danh sách sản phẩm (có pagination, filter, search)
router.get('/api/products', productController.getProductsAPI);

// Lấy chi tiết sản phẩm
router.get('/api/products/:id', productController.getProductDetailAPI);

// ✅ ADMIN API ROUTES - Cần xác thực (CRUD)
/**
 * ✅ CREATE: Tạo sản phẩm mới với upload ảnh
 * POST /api/products
 * 
 * Body (multipart/form-data):
 * - sku: "BUT-001"
 * - name: "Bút bi xanh"
 * - price: 5000
 * - stock: 100
 * - category: "Bút"
 * - description: "Mô tả sản phẩm"
 * - image: <file>
 */
router.post('/api/products',
    adminAuth,
    upload.single('image'),
    validateProduct,
    productController.createProduct
);

/**
 * ✅ UPDATE: Cập nhật sản phẩm (có thể đổi ảnh)
 * PUT /api/products/:id
 * 
 * Body (multipart/form-data):
 * - name: "Bút bi đỏ" (tuỳ chọn)
 * - price: 6000 (tuỳ chọn)
 * - stock: 80 (tuỳ chọn)
 * - category: "Bút" (tuỳ chọn)
 * - description: "Mô tả mới" (tuỳ chọn)
 * - image: <file> (tuỳ chọn)
 */
router.put('/api/products/:id',
    adminAuth,
    upload.single('image'),
    productController.updateProduct
);

/**
 * ✅ DELETE: Xóa sản phẩm (Soft delete - chỉ ẩn)
 * DELETE /api/products/:id
 */
router.delete('/api/products/:id',
    adminAuth,
    productController.deleteProduct
);

/**
 * 🔄 BONUS: Khôi phục sản phẩm đã xóa
 * PATCH /api/products/:id/restore
 */
router.patch('/api/products/:id/restore',
    adminAuth,
    productController.restoreProduct
);

/**
 * 🗑️ HARD DELETE: Xóa vĩnh viễn sản phẩm (không thể khôi phục!)
 * DELETE /api/products/:id/permanent
 */
router.delete('/api/products/:id/permanent',
    adminAuth,
    productController.hardDeleteProduct
);

module.exports = router;
