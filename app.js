if (!global.crypto) {
    global.crypto = require('crypto');
}

const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

// Import config
const connectDB = require('./config/database');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

// Import models
const Product = require('./models/Product');

const app = express();

// ✅ 1. CẤU HÌNH VIEW ENGINE (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ 2. MIDDLEWARE XỬ LÝ REQUEST
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ 3. CẤU HÌNH SESSION
app.use(session({
    secret: process.env.SESSION_SECRET || 'vanphongpham_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60,  // 1 giờ
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
    }
}));

// ✅ 4. MIDDLEWARE CUSTOM
app.use((req, res, next) => {
    const cart = req.session.cart || {};
    res.locals.cartItemCount = Object.values(cart).reduce((count, quantity) => count + quantity, 0);
    res.locals.user = req.session.user || null;
    next();
});

// ✅ 5. KẾT NỐI MONGODB
connectDB();

// ✅ 6. IMPORT ROUTES
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');

// ✅ 7. SỬ DỤNG ROUTES (API & Backend)
app.use('/', productRoutes);
app.use('/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// ✅ 8. MIDDLEWARE XỬ LÝ 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Trang không tồn tại'
    });
});

// ✅ 9. MIDDLEWARE XỬ LÝ LỖI TOÀN CỤC
app.use(errorHandler);

// ✅ 10. KHỞI CHẠY SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server đang chạy tại http://localhost:${PORT}`);
});