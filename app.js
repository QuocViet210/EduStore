// File: app.js
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = 3000;

// 1. Cấu hình View Engine (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'vanphongpham_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }
}));
app.use((req, res, next) => {
    const cart = req.session.cart || {};
    res.locals.cartItemCount = Object.values(cart).reduce((count, quantity) => count + quantity, 0);
    next();
});

// 2. Import Routes (MỚI THÊM)
const productRoutes = require('./routes/productRoutes');

// 3. Kết nối Cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://localhost:27017/shop_db')
    .then(() => console.log('✅ Kết nối MongoDB thành công!'))
    .catch(err => console.error('❌ Lỗi kết nối MongoDB:', err));

// 4. Sử dụng Routes (THAY THẾ ĐOẠN ROUTE CŨ)
app.use('/', productRoutes);

// 5. Khởi chạy Server
app.listen(PORT, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});