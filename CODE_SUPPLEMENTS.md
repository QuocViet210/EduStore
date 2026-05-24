# 📝 MÃ BỔ SUNG - HOÀN THÀNH PROJECT DEMO

Tài liệu này chứa tất cả mã cần bổ sung để hoàn thành project và có thể demo.

---

## 📂 **CẤU TRÚC FILE CẦN TẠO & SỬA ĐỔI**

```
Van_Phong_Pham_Shop/
├── views/
│   ├── login.ejs              ← NEW
│   ├── register.ejs           ← NEW
│   ├── profile.ejs            ← NEW
│   └── admin/
│       ├── products-list.ejs  ← NEW
│       ├── edit-product.ejs   ← NEW
│       ├── orders-list.ejs    ← NEW
│       └── order-detail.ejs   ← NEW
│
├── controllers/
│   ├── userController.js      ← UPDATE (thêm render methods)
│   └── adminController.js     ← UPDATE (thêm CRUD & render methods)
│
└── routes/
    ├── userRoutes.js          ← UPDATE (thêm routes cho render pages)
    └── adminRoutes.js         ← UPDATE (thêm routes chi tiết)
```

---

## 1️⃣ **UPDATE: controllers/userController.js**

Thêm các method render pages vào cuối file:

```javascript
/**
 * ✅ RENDER: Trang đăng nhập
 */
exports.getLoginPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/');  // Nếu đã login thì redirect home
    }
    res.render('login', { error: '' });
};

/**
 * ✅ RENDER: Trang đăng ký
 */
exports.getRegisterPage = (req, res) => {
    if (req.session.user) {
        return res.redirect('/');  // Nếu đã login thì redirect home
    }
    res.render('register', { error: '' });
};

/**
 * ✅ RENDER: Trang hồ sơ cá nhân
 */
exports.getProfilePage = async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect('/login');  // Chưa login thì redirect login
        }

        const user = await User.findById(req.session.user._id).select('-password');
        res.render('profile', { user });
    } catch (error) {
        console.error('❌ Error in getProfilePage:', error);
        res.status(500).render('error', { message: 'Lỗi Server!' });
    }
};

/**
 * ✅ RENDER: Trang đổi mật khẩu
 */
exports.getChangePasswordPage = (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('change-password', { error: '' });
};
```

---

## 2️⃣ **UPDATE: controllers/adminController.js**

Thêm các method CRUD & render pages:

```javascript
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

/**
 * ✅ RENDER: Trang Dashboard Admin
 */
exports.getDashboard = async (req, res) => {
    try {
        // Lấy thống kê
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalOrders = await Order.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);

        const stats = {
            totalProducts,
            totalUsers,
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0
        };

        // Lấy đơn hàng gần đây (10 cái mới nhất)
        const recentOrders = await Order.find()
            .populate('userId', 'username email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Lấy sản phẩm bán chạy nhất
        const topProducts = await Product.find({ isActive: true })
            .sort({ createdAt: -1 })
            .limit(5);

        res.render('admin/dashboard', {
            stats,
            recentOrders,
            topProducts,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getDashboard:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ RENDER: Trang danh sách sản phẩm
 */
exports.getProductsList = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        let filter = { isActive: true };
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { sku: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.render('admin/products-list', {
            products,
            currentPage: parseInt(page),
            totalPages,
            search,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getProductsList:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ RENDER: Trang thêm sản phẩm
 */
exports.getAddProductPage = (req, res) => {
    res.render('admin/add-product', { user: req.session.user });
};

/**
 * ✅ RENDER: Trang chỉnh sửa sản phẩm
 */
exports.getEditProductPage = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại!');
        }

        res.render('admin/edit-product', {
            product,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getEditProductPage:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ POST: Thêm sản phẩm mới
 */
exports.postAddProduct = async (req, res) => {
    try {
        const { sku, name, price, stock, category, description } = req.body;

        // Kiểm tra SKU trùng
        const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingSku) {
            return res.status(400).send('SKU đã tồn tại!');
        }

        const newProduct = new Product({
            sku: sku.toUpperCase(),
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            description,
            imageUrl: req.file ? `/img/${req.file.filename}` : '/img/default-product.png'
        });

        await newProduct.save();
        console.log('✅ Sản phẩm mới được thêm:', name);
        res.redirect('/admin/products');
    } catch (error) {
        console.error('❌ Error in postAddProduct:', error);
        res.status(500).send('Lỗi khi thêm sản phẩm!');
    }
};

/**
 * ✅ POST: Cập nhật sản phẩm
 */
exports.postUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, category, description } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại!');
        }

        // Cập nhật thông tin
        product.name = name;
        product.price = parseFloat(price);
        product.stock = parseInt(stock);
        product.category = category;
        product.description = description;

        // Nếu có upload ảnh mới
        if (req.file) {
            // Xóa ảnh cũ
            if (product.imageUrl && product.imageUrl !== '/img/default-product.png') {
                const fs = require('fs');
                const path = require('path');
                const oldImagePath = path.join(__dirname, '../public', product.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            product.imageUrl = `/img/${req.file.filename}`;
        }

        await product.save();
        console.log('✅ Sản phẩm được cập nhật:', name);
        res.redirect(`/admin/products`);
    } catch (error) {
        console.error('❌ Error in postUpdateProduct:', error);
        res.status(500).send('Lỗi khi cập nhật sản phẩm!');
    }
};

/**
 * ✅ POST: Xóa sản phẩm (Soft delete)
 */
exports.postDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, { isActive: false });
        console.log('✅ Sản phẩm đã bị ẩn');
        res.redirect('/admin/products');
    } catch (error) {
        console.error('❌ Error in postDeleteProduct:', error);
        res.status(500).send('Lỗi khi xóa sản phẩm!');
    }
};

/**
 * ✅ RENDER: Trang danh sách đơn hàng
 */
exports.getOrdersList = async (req, res) => {
    try {
        const { page = 1, limit = 10, status = '' } = req.query;
        const skip = (page - 1) * limit;

        let filter = {};
        if (status) {
            filter.status = status;
        }

        const orders = await Order.find(filter)
            .populate('userId', 'username email phone')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Order.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.render('admin/orders-list', {
            orders,
            currentPage: parseInt(page),
            totalPages,
            status,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getOrdersList:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ RENDER: Trang chi tiết đơn hàng
 */
exports.getOrderDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id)
            .populate('userId', 'username email phone')
            .populate('items.productId', 'name price');

        if (!order) {
            return res.status(404).send('Đơn hàng không tồn tại!');
        }

        res.render('admin/order-detail', {
            order,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getOrderDetail:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ POST: Cập nhật trạng thái đơn hàng
 */
exports.postUpdateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, paymentStatus, notes } = req.body;

        const order = await Order.findByIdAndUpdate(id, {
            status,
            paymentStatus,
            notes
        }, { new: true });

        console.log('✅ Trạng thái đơn hàng được cập nhật:', status);
        res.redirect(`/admin/orders/${id}`);
    } catch (error) {
        console.error('❌ Error in postUpdateOrderStatus:', error);
        res.status(500).send('Lỗi khi cập nhật!');
    }
};

/**
 * ✅ RENDER: Trang danh sách người dùng
 */
exports.getUsersList = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const skip = (page - 1) * limit;

        let filter = { isActive: true };
        if (search) {
            filter.$or = [
                { username: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(filter)
            .select('-password')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await User.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);

        res.render('admin/users-list', {
            users,
            currentPage: parseInt(page),
            totalPages,
            search,
            user: req.session.user
        });
    } catch (error) {
        console.error('❌ Error in getUsersList:', error);
        res.status(500).send('Lỗi Server!');
    }
};
```

---

## 3️⃣ **UPDATE: routes/userRoutes.js**

Thêm routes cho render login/register pages:

```javascript
// ✅ ROUTES RENDER (EJS) - Công khai
router.get('/login', userController.getLoginPage);
router.get('/register', userController.getRegisterPage);

// ✅ ROUTES RENDER (EJS) - Cần đăng nhập
router.get('/profile', auth, userController.getProfilePage);
router.get('/change-password', auth, userController.getChangePasswordPage);

// (Giữ nguyên các routes API khác)
```

---

## 4️⃣ **UPDATE: routes/adminRoutes.js**

Thay thế toàn bộ file bằng:

```javascript
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { adminAuth } = require('../middleware/auth');
const upload = require('../config/multer');

// ✅ MIDDLEWARE: Kiểm tra admin
router.use(adminAuth);

// ✅ DASHBOARD
router.get('/', adminController.getDashboard);

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

module.exports = router;
```

---

## 5️⃣ **TẠO: views/login.ejs**

```html
<%- include('partials/header') %>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body p-5">
                    <h2 class="text-center mb-4">Đăng Nhập</h2>

                    <% if (error) { %>
                        <div class="alert alert-danger">
                            <%= error %>
                        </div>
                    <% } %>

                    <form action="/api/users/auth/login" method="POST" id="loginForm">
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Mật Khẩu</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 mb-3">Đăng Nhập</button>
                    </form>

                    <div class="text-center">
                        <p>Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/users/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ Đăng nhập thành công!');
                window.location.href = '/';
            } else {
                alert('❌ Đăng nhập thất bại: ' + data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Lỗi Server!');
        }
    });
</script>

<%- include('partials/footer') %>
```

---

## 6️⃣ **TẠO: views/register.ejs**

```html
<%- include('partials/header') %>

<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
                <div class="card-body p-5">
                    <h2 class="text-center mb-4">Đăng Ký</h2>

                    <% if (error) { %>
                        <div class="alert alert-danger">
                            <%= error %>
                        </div>
                    <% } %>

                    <form id="registerForm">
                        <div class="mb-3">
                            <label for="username" class="form-label">Tên Đăng Nhập</label>
                            <input type="text" class="form-control" id="username" name="username" required>
                            <small class="text-muted">3-50 ký tự, chỉ chứa chữ, số, dấu gạch dưới</small>
                        </div>

                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>

                        <div class="mb-3">
                            <label for="password" class="form-label">Mật Khẩu</label>
                            <input type="password" class="form-control" id="password" name="password" required>
                            <small class="text-muted">Ít nhất 6 ký tự</small>
                        </div>

                        <div class="mb-3">
                            <label for="confirmPassword" class="form-label">Xác Nhận Mật Khẩu</label>
                            <input type="password" class="form-control" id="confirmPassword" name="confirmPassword" required>
                        </div>

                        <button type="submit" class="btn btn-primary w-100 mb-3">Đăng Ký</button>
                    </form>

                    <div class="text-center">
                        <p>Đã có tài khoản? <a href="/login">Đăng nhập</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };

        try {
            const response = await fetch('/api/users/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                alert('✅ Đăng ký thành công! Vui lòng đăng nhập.');
                window.location.href = '/login';
            } else {
                const errorMsg = data.errors?.map(e => e.message).join('\n') || data.message;
                alert('❌ Lỗi: ' + errorMsg);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('❌ Lỗi Server!');
        }
    });
</script>

<%- include('partials/footer') %>
```

---

## 7️⃣ **TẠO: views/profile.ejs**

```html
<%- include('partials/header') %>

<div class="container mt-5">
    <div class="row">
        <div class="col-md-3">
            <div class="card">
                <div class="card-body text-center">
                    <h5 class="card-title"><%= user.username %></h5>
                    <p class="text-muted"><%= user.email %></p>
                    <p class="badge bg-info"><%= user.role === 'admin' ? 'Quản Trị Viên' : 'Khách Hàng' %></p>
                </div>
            </div>
        </div>

        <div class="col-md-9">
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">Thông Tin Cá Nhân</h5>
                </div>
                <div class="card-body">
                    <p><strong>Tên Đăng Nhập:</strong> <%= user.username %></p>
                    <p><strong>Email:</strong> <%= user.email %></p>
                    <p><strong>Số Điện Thoại:</strong> <%= user.phone || 'Chưa cập nhật' %></p>
                    <p><strong>Địa Chỉ:</strong> <%= user.address || 'Chưa cập nhật' %></p>
                    <p><strong>Tham Gia Từ:</strong> <%= new Date(user.createdAt).toLocaleDateString('vi-VN') %></p>

                    <a href="/change-password" class="btn btn-warning">Đổi Mật Khẩu</a>
                    <a href="/api/users/auth/logout" class="btn btn-danger">Đăng Xuất</a>
                </div>
            </div>
        </div>
    </div>
</div>

<%- include('partials/footer') %>
```

---

## 8️⃣ **TẠO: views/admin/products-list.ejs**

```html
<%- include('../partials/header') %>

<div class="container-fluid mt-5">
    <h2 class="mb-4">📦 Quản Lý Sản Phẩm</h2>

    <!-- Search -->
    <form method="GET" class="mb-4">
        <div class="row">
            <div class="col-md-6">
                <input type="text" name="search" class="form-control" placeholder="Tìm kiếm sản phẩm..." value="<%= search %>">
            </div>
            <div class="col-md-6">
                <button type="submit" class="btn btn-primary">Tìm</button>
                <a href="/admin/products/add" class="btn btn-success">➕ Thêm Sản Phẩm</a>
            </div>
        </div>
    </form>

    <!-- Products Table -->
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>SKU</th>
                    <th>Tên</th>
                    <th>Giá</th>
                    <th>Stock</th>
                    <th>Danh Mục</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <% products.forEach(product => { %>
                    <tr>
                        <td><%= product.sku || '-' %></td>
                        <td><%= product.name %></td>
                        <td><%= product.price.toLocaleString('vi-VN') %> VNĐ</td>
                        <td><span class="badge bg-info"><%= product.stock %></span></td>
                        <td><%= product.category || '-' %></td>
                        <td>
                            <a href="/admin/products/edit/<%= product._id %>" class="btn btn-sm btn-warning">✏️ Sửa</a>
                            <form action="/admin/products/delete/<%= product._id %>" method="POST" style="display: inline;" onsubmit="return confirm('Bạn chắc chắn?')">
                                <button type="submit" class="btn btn-sm btn-danger">🗑️ Xóa</button>
                            </form>
                        </td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-4">
        <ul class="pagination">
            <% for (let i = 1; i <= totalPages; i++) { %>
                <li class="page-item <%= i === currentPage ? 'active' : '' %>">
                    <a class="page-link" href="/admin/products?page=<%= i %>&search=<%= search %>"><%= i %></a>
                </li>
            <% } %>
        </ul>
    </nav>
</div>

<%- include('../partials/footer') %>
```

---

## 9️⃣ **TẠO: views/admin/edit-product.ejs**

```html
<%- include('../partials/header') %>

<div class="container mt-5">
    <h2 class="mb-4">✏️ Chỉnh Sửa Sản Phẩm</h2>

    <div class="card">
        <div class="card-body">
            <form action="/admin/products/edit/<%= product._id %>" method="POST" enctype="multipart/form-data" id="editProductForm">
                <div class="row">
                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="name" class="form-label">Tên Sản Phẩm</label>
                            <input type="text" class="form-control" id="name" name="name" value="<%= product.name %>" required>
                        </div>

                        <div class="mb-3">
                            <label for="price" class="form-label">Giá (VNĐ)</label>
                            <input type="number" class="form-control" id="price" name="price" value="<%= product.price %>" required>
                        </div>

                        <div class="mb-3">
                            <label for="stock" class="form-label">Stock</label>
                            <input type="number" class="form-control" id="stock" name="stock" value="<%= product.stock %>" required>
                        </div>

                        <div class="mb-3">
                            <label for="category" class="form-label">Danh Mục</label>
                            <input type="text" class="form-control" id="category" name="category" value="<%= product.category %>" required>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="mb-3">
                            <label for="description" class="form-label">Mô Tả</label>
                            <textarea class="form-control" id="description" name="description" rows="5"><%= product.description || '' %></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="image" class="form-label">Ảnh Sản Phẩm</label>
                            <input type="file" class="form-control" id="image" name="image" accept="image/*">
                            <% if (product.imageUrl) { %>
                                <img src="<%= product.imageUrl %>" alt="Product" style="width: 200px; margin-top: 10px;">
                            <% } %>
                        </div>
                    </div>
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary">💾 Lưu Thay Đổi</button>
                    <a href="/admin/products" class="btn btn-secondary">❌ Hủy</a>
                </div>
            </form>
        </div>
    </div>
</div>

<%- include('../partials/footer') %>
```

---

## 🔟 **TẠO: views/admin/orders-list.ejs**

```html
<%- include('../partials/header') %>

<div class="container-fluid mt-5">
    <h2 class="mb-4">📋 Quản Lý Đơn Hàng</h2>

    <!-- Filter by Status -->
    <div class="mb-4">
        <a href="/admin/orders" class="btn <%= status === '' ? 'btn-primary' : 'btn-outline-primary' %>">Tất Cả</a>
        <a href="/admin/orders?status=pending" class="btn <%= status === 'pending' ? 'btn-warning' : 'btn-outline-warning' %>">Chờ Xác Nhận</a>
        <a href="/admin/orders?status=confirmed" class="btn <%= status === 'confirmed' ? 'btn-info' : 'btn-outline-info' %>">Đã Xác Nhận</a>
        <a href="/admin/orders?status=shipped" class="btn <%= status === 'shipped' ? 'btn-primary' : 'btn-outline-primary' %>">Đang Giao</a>
        <a href="/admin/orders?status=delivered" class="btn <%= status === 'delivered' ? 'btn-success' : 'btn-outline-success' %>">Đã Giao</a>
        <a href="/admin/orders?status=cancelled" class="btn <%= status === 'cancelled' ? 'btn-danger' : 'btn-outline-danger' %>">Đã Hủy</a>
    </div>

    <!-- Orders Table -->
    <div class="table-responsive">
        <table class="table table-striped table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID Đơn Hàng</th>
                    <th>Khách Hàng</th>
                    <th>Tổng Tiền</th>
                    <th>Trạng Thái</th>
                    <th>Thanh Toán</th>
                    <th>Ngày Tạo</th>
                    <th>Hành Động</th>
                </tr>
            </thead>
            <tbody>
                <% orders.forEach(order => { %>
                    <tr>
                        <td><%= order._id.toString().slice(-8).toUpperCase() %></td>
                        <td><%= order.userId?.username || 'N/A' %></td>
                        <td><strong><%= order.totalPrice.toLocaleString('vi-VN') %> VNĐ</strong></td>
                        <td>
                            <span class="badge 
                                <%= order.status === 'pending' ? 'bg-warning' : 
                                    order.status === 'confirmed' ? 'bg-info' :
                                    order.status === 'shipped' ? 'bg-primary' :
                                    order.status === 'delivered' ? 'bg-success' :
                                    'bg-danger' %>">
                                <%= order.status %>
                            </span>
                        </td>
                        <td>
                            <span class="badge <%= order.paymentStatus === 'paid' ? 'bg-success' : 'bg-danger' %>">
                                <%= order.paymentStatus %>
                            </span>
                        </td>
                        <td><%= new Date(order.createdAt).toLocaleDateString('vi-VN') %></td>
                        <td>
                            <a href="/admin/orders/<%= order._id %>" class="btn btn-sm btn-info">👁️ Xem</a>
                        </td>
                    </tr>
                <% }); %>
            </tbody>
        </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-4">
        <ul class="pagination">
            <% for (let i = 1; i <= totalPages; i++) { %>
                <li class="page-item <%= i === currentPage ? 'active' : '' %>">
                    <a class="page-link" href="/admin/orders?page=<%= i %>&status=<%= status %>"><%= i %></a>
                </li>
            <% } %>
        </ul>
    </nav>
</div>

<%- include('../partials/footer') %>
```

---

## 1️⃣1️⃣ **TẠO: views/admin/order-detail.ejs**

```html
<%- include('../partials/header') %>

<div class="container mt-5">
    <h2 class="mb-4">📌 Chi Tiết Đơn Hàng: <%= order._id.toString().slice(-8).toUpperCase() %></h2>

    <div class="row">
        <!-- Thông tin Khách Hàng -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">👤 Thông Tin Khách Hàng</h5>
                </div>
                <div class="card-body">
                    <p><strong>Tên:</strong> <%= order.userId?.username %></p>
                    <p><strong>Email:</strong> <%= order.userId?.email %></p>
                    <p><strong>Điện Thoại:</strong> <%= order.userId?.phone || 'N/A' %></p>
                </div>
            </div>
        </div>

        <!-- Thông tin Giao Hàng -->
        <div class="col-md-6">
            <div class="card mb-4">
                <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">🚚 Địa Chỉ Giao Hàng</h5>
                </div>
                <div class="card-body">
                    <p><strong>Tên Người Nhận:</strong> <%= order.shippingAddress?.name %></p>
                    <p><strong>Điện Thoại:</strong> <%= order.shippingAddress?.phone %></p>
                    <p><strong>Địa Chỉ:</strong> <%= order.shippingAddress?.address %></p>
                    <p><strong>Quận/Huyện:</strong> <%= order.shippingAddress?.district || 'N/A' %></p>
                    <p><strong>Thành Phố:</strong> <%= order.shippingAddress?.city || 'N/A' %></p>
                </div>
            </div>
        </div>
    </div>

    <!-- Chi Tiết Sản Phẩm -->
    <div class="card mb-4">
        <div class="card-header bg-info text-white">
            <h5 class="mb-0">📦 Sản Phẩm</h5>
        </div>
        <div class="card-body">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Tên Sản Phẩm</th>
                            <th>Số Lượng</th>
                            <th>Giá</th>
                            <th>Thành Tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        <% order.items.forEach(item => { %>
                            <tr>
                                <td><%= item.productName %></td>
                                <td><%= item.quantity %></td>
                                <td><%= item.price.toLocaleString('vi-VN') %> VNĐ</td>
                                <td><strong><%= (item.price * item.quantity).toLocaleString('vi-VN') %> VNĐ</strong></td>
                            </tr>
                        <% }); %>
                        <tr class="table-success">
                            <td colspan="3" class="text-end"><strong>Tổng Tiền:</strong></td>
                            <td><strong><%= order.totalPrice.toLocaleString('vi-VN') %> VNĐ</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Cập Nhật Trạng Thái -->
    <div class="card mb-4">
        <div class="card-header bg-warning text-dark">
            <h5 class="mb-0">⚙️ Cập Nhật Trạng Thái</h5>
        </div>
        <div class="card-body">
            <form action="/admin/orders/<%= order._id %>/update-status" method="POST">
                <div class="row">
                    <div class="col-md-4">
                        <label class="form-label">Trạng Thái Đơn</label>
                        <select name="status" class="form-select">
                            <option value="pending" <%= order.status === 'pending' ? 'selected' : '' %>>Chờ Xác Nhận</option>
                            <option value="confirmed" <%= order.status === 'confirmed' ? 'selected' : '' %>>Đã Xác Nhận</option>
                            <option value="shipped" <%= order.status === 'shipped' ? 'selected' : '' %>>Đang Giao</option>
                            <option value="delivered" <%= order.status === 'delivered' ? 'selected' : '' %>>Đã Giao</option>
                            <option value="cancelled" <%= order.status === 'cancelled' ? 'selected' : '' %>>Đã Hủy</option>
                        </select>
                    </div>

                    <div class="col-md-4">
                        <label class="form-label">Trạng Thái Thanh Toán</label>
                        <select name="paymentStatus" class="form-select">
                            <option value="pending" <%= order.paymentStatus === 'pending' ? 'selected' : '' %>>Chưa Thanh Toán</option>
                            <option value="paid" <%= order.paymentStatus === 'paid' ? 'selected' : '' %>>Đã Thanh Toán</option>
                            <option value="failed" <%= order.paymentStatus === 'failed' ? 'selected' : '' %>>Thanh Toán Thất Bại</option>
                        </select>
                    </div>

                    <div class="col-md-4 mt-4">
                        <button type="submit" class="btn btn-primary w-100">💾 Lưu Thay Đổi</button>
                    </div>
                </div>

                <div class="mt-3">
                    <label class="form-label">Ghi Chú</label>
                    <textarea name="notes" class="form-control" rows="3" placeholder="Nhập ghi chú..."><%= order.notes || '' %></textarea>
                </div>
            </form>
        </div>
    </div>

    <a href="/admin/orders" class="btn btn-secondary">← Quay Lại</a>
</div>

<%- include('../partials/footer') %>
```

---

## 📝 **HƯỚNG DẪN TRIỂN KHAI**

### **Bước 1: Copy & Paste Code**
1. Mở `/controllers/userController.js` → Thêm các method render pages vào cuối file
2. Mở `/controllers/adminController.js` → Thêm các method CRUD & render vào cuối file
3. Mở `/routes/userRoutes.js` → Thêm routes render pages
4. Mở `/routes/adminRoutes.js` → Replace toàn bộ bằng code mới

### **Bước 2: Tạo Views (EJS)**
1. Tạo `/views/login.ejs` → Copy đoạn code login
2. Tạo `/views/register.ejs` → Copy đoạn code register
3. Tạo `/views/profile.ejs` → Copy đoạn code profile
4. Tạo `/views/admin/products-list.ejs`
5. Tạo `/views/admin/edit-product.ejs`
6. Tạo `/views/admin/orders-list.ejs`
7. Tạo `/views/admin/order-detail.ejs`

### **Bước 3: Khởi Động Server**
```bash
cd /home/asus/Van_Phong_Pham_Shop
npm start
```

### **Bước 4: Test**
- Vào http://localhost:3000 → Xem Trang Chủ ✅
- Click "Đăng Ký" → /register ✅
- Click "Đăng Nhập" → /login ✅
- Đăng nhập Admin → Vào /admin ✅
- Quản Lý Sản Phẩm → /admin/products ✅
- Quản Lý Đơn Hàng → /admin/orders ✅

---

**Tài liệu này chứa mã bổ sung hoàn chỉnh. Hãy tuân theo từng bước để hoàn thành project!** 🚀
