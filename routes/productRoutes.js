const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const cartController = require('../controllers/cartController');

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

module.exports = router;
