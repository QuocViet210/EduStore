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
 * ✅ RENDER: Trang Dashboard Admin
 */
exports.getDashboard = async (req, res) => {
    try {
        // Lấy thống kê
        const totalProducts = await Product.countDocuments({ isActive: true });
        const totalUsers = await User.countDocuments({ isActive: true });
        const totalOrders = await Order.countDocuments();

        const totalRevenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = totalRevenueResult[0]?.total || 0;

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
            stats: {
                totalProducts,
                totalUsers,
                totalOrders,
                totalRevenue
            },
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
            imageUrl: req.file ? `/uploads/products/${req.file.filename}` : '/img/default-product.png'
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
            deleteOldImage(product.imageUrl);
            product.imageUrl = `/uploads/products/${req.file.filename}`;
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