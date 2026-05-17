const Product = require('../models/Product');

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

exports.getCart = async (req, res) => {
    try {
        const { items, subtotal, totalQty } = await loadCart(req);
        res.render('cart', { cartItems: items, subtotal, totalQty });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server!');
    }
};

exports.addToCart = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại');
        }

        req.session.cart = req.session.cart || {};
        req.session.cart[productId] = (req.session.cart[productId] || 0) + 1;

        const redirectUrl = req.get('referer') || '/shop';
        res.redirect(redirectUrl);
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server!');
    }
};

exports.removeFromCart = async (req, res) => {
    const productId = req.params.id;
    const cart = req.session.cart || {};
    if (cart[productId]) {
        delete cart[productId];
        req.session.cart = cart;
    }
    const redirectUrl = req.get('referer') || '/cart';
    res.redirect(redirectUrl);
};

exports.updateCart = async (req, res) => {
    const productId = req.params.id;
    const quantity = parseInt(req.query.quantity, 10);
    const cart = req.session.cart || {};

    if (!Number.isFinite(quantity) || quantity < 1) {
        delete cart[productId];
    } else {
        cart[productId] = quantity;
    }

    req.session.cart = cart;
    const redirectUrl = req.get('referer') || '/cart';
    res.redirect(redirectUrl);
};
