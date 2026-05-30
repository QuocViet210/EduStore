const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * Xóa ảnh cũ từ server
 */
const deleteOldImage = (imagePath) => {
    if (!imagePath || imagePath === '/img/default-product.png') return;

    const fullPath = path.join(__dirname, '../public', imagePath);
    if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`✅ Xóa ảnh cũ: ${imagePath}`);
    }
};

/**
 *  RENDER: Trang Dashboard Admin
 */
exports.getDashboard = async (req, res) => {
    try {
        // 1. Lấy số lượng sản phẩm và khách hàng thực tế từ DB
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ role: 'user' });

        // 2. Lấy số lượng đơn hàng và tổng doanh thu
        let totalOrders = 0;
        let totalRevenue = 0;

        // Đặt trong khối try-catch nhỏ đề phòng trường hợp database của em chưa tạo bảng Orders
        try {
            const orders = await Order.find();
            totalOrders = orders.length;
            totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
        } catch (orderErr) {
            console.log("⚠️ Cảnh báo: Chưa tìm thấy bảng Order trong DB hoặc chưa setup xong Order Model!");
        }

        // 3. 🌟 QUAN TRỌNG NHẤT: Đóng gói đầy đủ biến ném sang EJS
        res.render('admin/dashboard', {
            user: req.session.user,
            totalProducts,   // Đã truyền
            totalUsers,      // Đã truyền
            totalOrders,     // ĐÃ CÓ BIẾN NÀY (Sẽ sửa được lỗi totalOrders is not defined)
            totalRevenue     // Đã truyền
        });

    } catch (error) {
        console.error('❌ Lỗi xử lý tại getDashboard:', error);
        res.status(500).send('Lỗi máy chủ nội bộ!');
    }
};
/**
 *  RENDER: Trang danh sách sản phẩm
 */
exports.getProductsList = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', success = '', error = '' } = req.query;
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
            success: success || '',
            error: error || '',
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
    res.render('admin/add-product', {
        user: req.session.user,
        error: ''
    });
};

/**
 * ✅ POST: Thêm sản phẩm mới
 */
exports.postAddProduct = async (req, res) => {
    try {
        const { sku, name, price, stock, category, description } = req.body;

        // ✅ Validation
        if (!sku || !name || !price) {
            return res.status(400).render('admin/add-product', {
                error: '⚠️ Vui lòng điền các trường bắt buộc (SKU, Tên, Giá)',
                user: req.session.user
            });
        }

        // ✅ Kiểm tra SKU trùng
        const existingSku = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingSku) {
            return res.status(400).render('admin/add-product', {
                error: '❌ SKU "' + sku.toUpperCase() + '" đã tồn tại! Vui lòng chọn SKU khác.',
                user: req.session.user
            });
        }

        // ✅ Tạo sản phẩm mới
        const newProduct = new Product({
            sku: sku.toUpperCase(),
            name: name.trim(),
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            category: category || 'Khác',
            description: description || '',
            imageUrl: req.file ? `/uploads/products/${req.file.filename}` : '/img/default-product.png'
        });

        // ✅ Lưu vào database
        const savedProduct = await newProduct.save();
        console.log('✅ Sản phẩm mới được thêm:', name, '(SKU:', savedProduct.sku + ')');

        res.redirect('/admin/products?success=Thêm sản phẩm thành công!');
    } catch (error) {
        console.error('❌ Error in postAddProduct:', error);

        // Xóa file upload nếu có lỗi
        if (req.file) {
            const fs = require('fs');
            const filePath = path.join(__dirname, '../public', `/uploads/products/${req.file.filename}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        // Xử lý các lỗi validation
        let errorMessage = 'Lỗi khi thêm sản phẩm!';
        if (error.errors && error.errors.name) {
            errorMessage = '❌ Tên sản phẩm phải có ít nhất 3 ký tự';
        } else if (error.errors && error.errors.price) {
            errorMessage = '❌ Giá sản phẩm không hợp lệ';
        } else if (error.message.includes('duplicate key')) {
            errorMessage = '❌ SKU đã tồn tại!';
        }

        res.status(400).render('admin/add-product', {
            error: errorMessage,
            user: req.session.user
        });
    }
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
            user: req.session.user,
            error: ''
        });
    } catch (error) {
        console.error('❌ Error in getEditProductPage:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * ✅ POST: Cập nhật sản phẩm
 */
exports.postUpdateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, category, description } = req.body;

        // ✅ Validation
        if (!name || !price) {
            const product = await Product.findById(id);
            return res.status(400).render('admin/edit-product', {
                product,
                error: '⚠️ Vui lòng điền các trường bắt buộc (Tên, Giá)',
                user: req.session.user
            });
        }

        // ✅ Tìm sản phẩm
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).render('admin/products-list', {
                error: '❌ Sản phẩm không tồn tại!',
                user: req.session.user
            });
        }

        // ✅ Cập nhật thông tin
        product.name = name.trim();
        product.price = parseFloat(price);
        product.stock = parseInt(stock) || 0;
        product.category = category || 'Khác';
        product.description = description || '';

        // ✅ Nếu có upload ảnh mới
        if (req.file) {
            deleteOldImage(product.imageUrl);
            product.imageUrl = `/uploads/products/${req.file.filename}`;
        }

        // ✅ Lưu thay đổi
        await product.save();
        console.log('✅ Sản phẩm được cập nhật:', name);

        res.redirect(`/admin/products?success=Cập nhật sản phẩm thành công!`);
    } catch (error) {
        console.error('❌ Error in postUpdateProduct:', error);

        // Xóa file upload nếu có lỗi
        if (req.file) {
            const fs = require('fs');
            const filePath = path.join(__dirname, '../public', `/uploads/products/${req.file.filename}`);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        const product = await Product.findById(req.params.id);
        let errorMessage = 'Lỗi khi cập nhật sản phẩm!';
        if (error.errors && error.errors.name) {
            errorMessage = '❌ Tên sản phẩm phải có ít nhất 3 ký tự';
        } else if (error.errors && error.errors.price) {
            errorMessage = '❌ Giá sản phẩm không hợp lệ';
        }

        res.status(400).render('admin/edit-product', {
            product,
            error: errorMessage,
            user: req.session.user
        });
    }
};

/**
 * ✅ POST: Xóa sản phẩm (Soft delete)
 */
exports.postDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Tìm sản phẩm trước khi xóa
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).redirect('/admin/products');
        }

        // ✅ Xóa ảnh nếu không phải ảnh mặc định
        deleteOldImage(product.imageUrl);

        // ✅ Soft delete: chỉ đánh dấu là không hoạt động
        await Product.findByIdAndUpdate(id, { isActive: false });
        console.log('✅ Sản phẩm đã bị ẩn:', product.name);

        res.redirect('/admin/products?success=Xóa sản phẩm thành công!');
    } catch (error) {
        console.error('❌ Error in postDeleteProduct:', error);
        res.status(500).redirect('/admin/products?error=Lỗi khi xóa sản phẩm!');
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
// API: Lật trạng thái Khóa / Mở khóa người dùng
exports.toggleUserStatus = async (req, res) => {
    try {
        const userId = req.params.id;

        // 1. Tìm user trong Database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy người dùng' });
        }

        // 2. Không cho phép Admin tự khóa chính mình
        if (user.role === 'admin' && user._id.toString() === req.session.user._id.toString()) {
            return res.status(400).json({ success: false, message: 'Không thể tự khóa tài khoản của chính mình!' });
        }

        // 3. Lật trạng thái (Nếu đang true thì thành false, và ngược lại)
        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            message: `Đã ${user.isActive ? 'mở khóa' : 'khóa'} tài khoản thành công!`,
            isActive: user.isActive // Trả về trạng thái mới để giao diện tự cập nhật
        });

    } catch (error) {
        console.error('❌ Lỗi khi khóa tài khoản:', error);
        res.status(500).json({ success: false, message: 'Lỗi Server' });
    }
};

/**
 * 💬 RENDER: Trang trực Chat của Admin
 * GET /admin/chat
 */
exports.getChatPage = (req, res) => {
    res.render('admin/chat', { user: req.session.user });
};