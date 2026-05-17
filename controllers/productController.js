const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('index', { products });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server!');
    }
};

exports.getShop = async (req, res) => {
    try {
        const categoryFilter = req.query.category || '';
        const categories = await Product.distinct('category');
        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);
        const countMap = counts.reduce((acc, item) => {
            acc[item._id] = item.count;
            return acc;
        }, {});

        const filter = categoryFilter ? { category: categoryFilter } : {};
        const products = await Product.find(filter).sort({ createdAt: -1 });

        res.render('shop', {
            products,
            categories,
            counts: countMap,
            selectedCategory: categoryFilter
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server!');
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).send('Sản phẩm không tồn tại');
        }
        res.render('product-detail', { product });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi Server!');
    }
};
