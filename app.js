if (!global.crypto) {
    global.crypto = require('crypto');
}

const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const path = require('path');

require('dotenv').config();

const Product = require('./models/Product');

const app = express();
//const PORT = 3000;

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

// 2. Import Routes 
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 3. Kết nối Cơ sở dữ liệu MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/EduStore')
    .then(async () => {
        console.log('✅ Kết nối Cơ sở dữ liệu EduStore thành công!');

        // --- BẮT ĐẦU KỊCH BẢN TEST BƠM DỮ LIỆU ---
        try {
            // Kiểm tra xem trong DB đã có sản phẩm nào chưa
            const count = await Product.countDocuments();
            if (count === 0) {
                // Nếu DB trống, tiến hành tạo thử 1 cây bút
                await Product.create({
                    sku: "BUT-001",           // Chuỗi mã không được trùng
                    name: "Bút bi Thiên Long",
                    category: "Bút",          // Phải gõ đúng chữ 'Bút' do em đã thiết lập Enum
                    price: 5000,              // Phải lớn hơn 0
                    stock: 100,               // Phải lớn hơn 0
                    description: "Bút mực xanh, ngòi 0.5mm êm ái"
                });
                console.log('🎉 Đã bơm 1 sản phẩm mẫu thành công! Hãy mở Compass để xem.');
            }
        } catch (error) {
            console.log('Lỗi khi bơm dữ liệu test:', error.message);
        }
        // --- KẾT THÚC KỊCH BẢN TEST ---

    })
    .catch((err) => {
        console.log('❌ Lỗi kết nối CSDL: ', err);
    });

// 4. Sử dụng Routes
app.use('/', productRoutes);
app.use('/admin', adminRoutes);


// 5. Khởi chạy Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});