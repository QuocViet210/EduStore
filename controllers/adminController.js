exports.getDashboard = (req, res) => {
    // Render file dashboard.ejs nằm trong thư mục views/admin/
    res.render('admin/dashboard');
};

const Product = require('../models/Product');

exports.postAddProduct = async (req, res) => {
    try {
        // 1. Lấy thông tin từ form (req.body)
        const { name, price } = req.body;

        // 2. Lấy tên file ảnh đã upload (multer xử lý lưu vào thư mục public/img)
        // Lưu ý: imageUrl sẽ lưu đường dẫn để thẻ <img> ở index.ejs đọc được
        const imageUrl = '/img/' + req.file.filename;

        // 3. Tạo Object và lưu vào MongoDB
        const newProduct = new Product({
            name: name,
            price: price,
            imageUrl: imageUrl
        });

        await newProduct.save();
        res.redirect('/'); // Lưu xong quay về trang chủ xem thành quả
    } catch (err) {
        console.log(err);
        res.send("Có lỗi xảy ra khi lưu dữ liệu!");
    }
};