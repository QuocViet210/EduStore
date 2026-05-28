const Product = require('../models/Product');
const { sendSuccess, sendError, getPagination } = require('../utils/responseHandler');
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
 * Lấy tất cả sản phẩm - Render trang chủ
 */
exports.getAllProducts = async (req, res) => {
    try {
        // 1. Lấy danh sách sản phẩm
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });

        // 2. Lấy số lượng giỏ hàng từ Session
        const cart = req.session.cart || {};
        const cartItemCount = Object.values(cart).reduce((count, quantity) => count + quantity, 0);

        // 3. Truyền cả 2 biến ra giao diện EJS
        res.render('index', {
            products,
            cartItemCount
        });
    } catch (error) {
        console.error('❌ Error in getAllProducts:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * Lấy tất cả sản phẩm - API (JSON)
 */
exports.getProductsAPI = async (req, res) => {
    try {
        const { page = 1, limit = 10, category = '', search = '' } = req.query;
        const { skip } = getPagination(page, limit);

        let filter = { isActive: true };

        if (category) {
            filter.category = category;
        }

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(filter)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const total = await Product.countDocuments(filter);

        sendSuccess(res, {
            products,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalItems: total
            }
        }, 'Lấy danh sách sản phẩm thành công');
    } catch (error) {
        console.error('❌ Error in getProductsAPI:', error);
        sendError(res, 'Lỗi khi lấy danh sách sản phẩm', 500);
    }
};

/**
 * Lấy sản phẩm theo danh mục - Render trang shop
 */
exports.getShop = async (req, res) => {
    try {
        const categoryFilter = req.query.category || '';
        const categories = await Product.distinct('category', { isActive: true });
        const counts = await Product.aggregate([
            { $match: { isActive: true } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        const countMap = counts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const filter = categoryFilter ? { category: categoryFilter, isActive: true } : { isActive: true };
        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.render('shop', {
            products,
            categories,
            counts: countMap,
            selectedCategory: categoryFilter
        });
    } catch (error) {
        console.error('❌ Error in getShop:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * Lấy chi tiết sản phẩm - Render trang chi tiết
 */
exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại');
        }
        res.render('product-detail', { product });
    } catch (error) {
        console.error('❌ Error in getProductDetail:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * Lấy chi tiết sản phẩm - API (JSON)
 */
exports.getProductDetailAPI = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return sendError(res, 'Sản phẩm không tồn tại', 404);
        }
        sendSuccess(res, product, 'Lấy thông tin sản phẩm thành công');
    } catch (error) {
        console.error('❌ Error in getProductDetailAPI:', error);
        sendError(res, 'Lỗi khi lấy chi tiết sản phẩm', 500);
    }
};

/**
 * ✅ CREATE: Tạo sản phẩm mới - Admin API (với upload ảnh)
 * 
 * POST /api/products
 * Body: {sku, name, price, stock, category, description}
 * File: image
 */
exports.createProduct = async (req, res) => {
    try {
        const { sku, name, price, stock, category, description } = req.body;

        // 1️⃣ Kiểm tra dữ liệu bắt buộc
        if (!sku || !name || !price || !category) {
            return sendError(res, 'SKU, tên, giá và danh mục không được để trống', 400);
        }

        // 2️⃣ Kiểm tra SKU trùng
        const existingSKU = await Product.findOne({ sku: sku.toUpperCase() });
        if (existingSKU) {
            return sendError(res, `SKU "${sku}" đã tồn tại`, 400);
        }

        // 3️⃣ Xử lý ảnh upload
        let imageUrl = '/img/default-product.png';
        if (req.file) {
            imageUrl = `/uploads/products/${req.file.filename}`;
        }

        // 4️⃣ Tạo sản phẩm mới
        const product = new Product({
            sku: sku.toUpperCase(),
            name: name.trim(),
            price: parseFloat(price),
            stock: parseInt(stock) || 0,
            category,
            description: description?.trim() || '',
            imageUrl,
            isActive: true
        });

        await product.save();

        console.log(`✅ Tạo sản phẩm thành công: ${name} (SKU: ${sku})`);
        sendSuccess(res, product, 'Tạo sản phẩm thành công', 201);

    } catch (error) {
        // Xóa ảnh nếu lỗi khi lưu
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('❌ Error in createProduct:', error);
        sendError(res, error.message || 'Lỗi khi tạo sản phẩm', 500);
    }
};

/**
 * ✅ UPDATE: Cập nhật sản phẩm - Admin API (với xử lý ảnh)
 * 
 * PUT /api/products/:id
 * Body: {name, price, stock, category, description}
 * File: image (tuỳ chọn)
 */
exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, stock, category, description } = req.body;

        // 1️⃣ Tìm sản phẩm cũ
        const product = await Product.findById(id);
        if (!product) {
            if (req.file) fs.unlinkSync(req.file.path);
            return sendError(res, 'Sản phẩm không tồn tại', 404);
        }

        // 2️⃣ Chuẩn bị dữ liệu cập nhật
        const updateData = {};

        if (name) updateData.name = name.trim();
        if (price !== undefined) updateData.price = parseFloat(price);
        if (stock !== undefined) updateData.stock = parseInt(stock);
        if (category) updateData.category = category;
        if (description !== undefined) updateData.description = description.trim();

        // 3️⃣ Xử lý ảnh mới
        if (req.file) {
            // Xóa ảnh cũ nếu có
            deleteOldImage(product.imageUrl);
            updateData.imageUrl = `/uploads/products/${req.file.filename}`;
        }

        // 4️⃣ Cập nhật sản phẩm
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

        console.log(`✅ Cập nhật sản phẩm thành công: ${updatedProduct.name}`);
        sendSuccess(res, updatedProduct, 'Cập nhật sản phẩm thành công');

    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('❌ Error in updateProduct:', error);
        sendError(res, 'Lỗi khi cập nhật sản phẩm', 500);
    }
};

/**
 * ✅ DELETE: Xóa sản phẩm - Admin API (Soft delete)
 * 
 * DELETE /api/products/:id
 * Chỉ đánh dấu isActive = false (không xóa vĩnh viễn)
 */
exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return sendError(res, 'Sản phẩm không tồn tại', 404);
        }

        // Soft delete - chỉ đánh dấu
        product.isActive = false;
        await product.save();

        console.log(`✅ Xóa sản phẩm (ẩn): ${product.name}`);
        sendSuccess(res, product, 'Xóa sản phẩm thành công');

    } catch (error) {
        console.error('❌ Error in deleteProduct:', error);
        sendError(res, 'Lỗi khi xóa sản phẩm', 500);
    }
};

/**
 * BONUS: Khôi phục sản phẩm đã xóa - Admin API
 * 
 * PATCH /api/products/:id/restore
 */
exports.restoreProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return sendError(res, 'Sản phẩm không tồn tại', 404);
        }

        product.isActive = true;
        await product.save();

        console.log(`✅ Khôi phục sản phẩm: ${product.name}`);
        sendSuccess(res, product, 'Khôi phục sản phẩm thành công');

    } catch (error) {
        console.error('❌ Error in restoreProduct:', error);
        sendError(res, 'Lỗi khi khôi phục sản phẩm', 500);
    }
};

/**
 * BONUS: Xóa vĩnh viễn sản phẩm + ảnh - Admin API
 * 
 * DELETE /api/products/:id/permanent
 * ⚠️ Không thể khôi phục!
 */
exports.hardDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);
        if (!product) {
            return sendError(res, 'Sản phẩm không tồn tại', 404);
        }

        // Xóa ảnh khỏi server
        deleteOldImage(product.imageUrl);

        // Xóa vĩnh viễn từ DB
        await Product.findByIdAndDelete(id);

        console.log(`✅ Xóa vĩnh viễn sản phẩm: ${product.name}`);
        sendSuccess(res, null, 'Xóa sản phẩm vĩnh viễn thành công');

    } catch (error) {
        console.error('❌ Error in hardDeleteProduct:', error);
        sendError(res, 'Lỗi khi xóa sản phẩm vĩnh viễn', 500);
    }
};
