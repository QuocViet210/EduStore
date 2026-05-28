const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');

// Hàm bổ trợ load chi tiết giỏ hàng từ session
async function loadCart(req) {
    const cart = req.session.cart || {};
    const productIds = Object.keys(cart);

    if (!productIds.length) {
        return { items: [], subtotal: 0, totalQty: 0 };
    }

    const products = await Product.find({ _id: { $in: productIds } });
    const items = products.map(product => {
        const quantity = cart[product._id.toString()] || 0;
        return {
            _id: product._id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            price: product.price,
            imageUrl: product.imageUrl,
            quantity,
            subtotal: product.price * quantity
        };
    });

    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, subtotal, totalQty };
}

// Render giao diện giỏ hàng
exports.getCart = async (req, res) => {
    try {
        const { items, subtotal, totalQty } = await loadCart(req);
        // Render trang cart, các biến user, cartItemCount đã được middleware app.js tự lo toàn cục
        res.render('cart', { cartItems: items, subtotal, totalQty });
    } catch (error) {
        console.error('Error in getCart:', error);
        res.status(500).send('Lỗi Server!');
    }
};

// Thêm sản phẩm vào giỏ
exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại');
        }

        req.session.cart = req.session.cart || {};
        req.session.cart[productId] = (req.session.cart[productId] || 0) + 1;

        // Quay lại trang trước đó hoặc về trang shop
        res.redirect(req.get('referer') || '/shop');
    } catch (error) {
        console.error('Error in addToCart:', error);
        res.status(500).send('Lỗi Server!');
    }
};

// Xóa sản phẩm khỏi giỏ
exports.removeFromCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const cart = req.session.cart || {};
        if (cart[productId]) {
            delete cart[productId];
            req.session.cart = cart;
        }
        res.redirect('/cart');
    } catch (error) {
        console.error('Error in removeFromCart:', error);
        res.status(500).send('Lỗi Server!');
    }
};

// Cập nhật số lượng mặt hàng (Tăng / Giảm)
exports.updateCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const quantity = parseInt(req.query.quantity, 10);
        const cart = req.session.cart || {};

        if (!Number.isFinite(quantity) || quantity < 1) {
            delete cart[productId];
        } else {
            cart[productId] = quantity;
        }

        req.session.cart = cart;
        res.redirect('/cart');
    } catch (error) {
        console.error('Error in updateCart:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * Hiển thị trang Thanh toán (Checkout)
 */
exports.getCheckoutPage = async (req, res) => {
    try {
        // Sử dụng lại hàm loadCart em đã viết để lấy dữ liệu giỏ hàng
        const { items, subtotal } = await loadCart(req);

        // Nếu giỏ hàng trống, đá về trang giỏ hàng
        if (items.length === 0) {
            return res.redirect('/cart');
        }

        // Truyền thông tin user để tự động điền form (nếu có)
        const user = await User.findById(req.session.user._id);

        res.render('checkout', {
            cartItems: items,
            subtotal,
            user // Biến user này lấy từ DB để có phone, address
        });
    } catch (error) {
        console.error(' Lỗi tải trang thanh toán:', error);
        res.status(500).send('Lỗi Server!');
    }
};

/**
 * Xử lý Đặt hàng: Lưu DB, Trừ Kho, Xóa Giỏ hàng
 */
exports.processCheckout = async (req, res) => {
    try {
        // 1. Lấy thêm paymentMethod từ form gửi lên
        const { name, phone, address, district, city, notes, paymentMethod } = req.body;
        const { items, subtotal } = await loadCart(req);

        if (items.length === 0) {
            return res.redirect('/cart');
        }

        const shippingFee = 30000;
        const totalPrice = subtotal + shippingFee;

        const orderItems = items.map(item => ({
            productId: item._id,
            productName: item.name,
            quantity: item.quantity,
            price: item.price
        }));

        // 2. Tạo đơn hàng (Lưu thêm phương thức thanh toán)
        const newOrder = new Order({
            userId: req.session.user._id,
            items: orderItems,
            totalPrice: totalPrice,
            shippingAddress: { name, phone, address, district, city },
            notes: notes || '',
            paymentMethod: paymentMethod, // 'COD' hoặc 'Bank Transfer'
            status: 'pending',
            paymentStatus: 'pending' // Chờ thanh toán
        });

        await newOrder.save();

        // 3. Trừ số lượng tồn kho
        for (let item of items) {
            await Product.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.quantity }
            });
        }

        // 4. Xóa giỏ hàng
        req.session.cart = {};

        // 5. THAY ĐỔI Ở ĐÂY: Chuyển hướng sang trang báo thành công kèm ID đơn hàng
        res.redirect(`/order-success/${newOrder._id}`);

    } catch (error) {
        console.error('Lỗi xử lý đặt hàng:', error);
        res.status(500).send('Lỗi trong quá trình đặt hàng!');
    }
};

// 6. THÊM HÀM MỚI NÀY XUỐNG DƯỚI CÙNG ĐỂ HIỂN THỊ TRANG THÀNH CÔNG
exports.getOrderSuccessPage = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.redirect('/');

        res.render('order-success', {
            order: order,
            user: req.session.user
        });
    } catch (error) {
        res.redirect('/');
    }
};

/**
 * API: Cập nhật giỏ hàng bằng AJAX (Không load lại trang)
 */
exports.updateCartAPI = async (req, res) => {
    try {
        const { productId, action } = req.body;
        const cart = req.session.cart || {};

        if (!cart[productId]) {
            return res.status(400).json({ success: false, message: 'Sản phẩm không có trong giỏ' });
        }

        // Tăng hoặc Giảm số lượng
        if (action === 'increase') {
            cart[productId]++;
        } else if (action === 'decrease') {
            if (cart[productId] > 1) {
                cart[productId]--;
            } else {
                delete cart[productId]; // Xóa nếu tụt về 0
            }
        }

        req.session.cart = cart; // Lưu lại session

        // Dùng lại hàm loadCart của em để tính toán tổng tiền mới
        const { items, subtotal, totalQty } = await loadCart(req);

        // Tìm sản phẩm vừa được cập nhật để lấy thành tiền mới của nó
        const updatedItem = items.find(item => item._id.toString() === productId);

        res.json({
            success: true,
            newQuantity: updatedItem ? updatedItem.quantity : 0,
            newSubtotal: updatedItem ? updatedItem.subtotal : 0,
            cartTotal: subtotal,
            totalQty: totalQty
        });

    } catch (error) {
        console.error('Lỗi API update giỏ hàng:', error);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
};