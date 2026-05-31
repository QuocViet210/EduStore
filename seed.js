if (!global.crypto) {
    global.crypto = require('crypto');
}

const mongoose = require('mongoose');
const Product = require('./models/Product');

async function seed() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shop_db');

    const products = [
        // Danh mục: Bút
        { sku: 'BUT001', name: 'Bút máy Thiên Long', description: 'Bút máy đen mực chuẩn, viết êm tay.', price: 24000, stock: 50, imageUrl: '/img/default-product.png', category: 'Bút' },
        { sku: 'BUT002', name: 'Bút máy Pilot', description: 'Bút máy thiết kế nhỏ gọn, phù hợp văn phòng và học tập.', price: 25000, stock: 45, imageUrl: '/img/default-product.png', category: 'Bút' },
        { sku: 'BUT003', name: 'Bút chì 2B', description: 'Bút chì mềm 2B, viết đậm và dễ tẩy.', price: 12000, stock: 100, imageUrl: '/img/default-product.png', category: 'Bút' },
        { sku: 'BUT004', name: 'Bút chì gỗ', description: 'Bút chì gỗ chất lượng, phù hợp vẽ và viết.', price: 13000, stock: 80, imageUrl: '/img/default-product.png', category: 'Bút' },
        { sku: 'BUT005', name: 'Bút mực gel', description: 'Bút mực gel viết mượt, màu sắc rực rỡ.', price: 8000, stock: 120, imageUrl: '/img/default-product.png', category: 'Bút' },
        { sku: 'BUT006', name: 'Bút bi xanh đen', description: 'Bút bi dùng hàng ngày, bền và rẻ.', price: 5000, stock: 200, imageUrl: '/img/default-product.png', category: 'Bút' },

        // Danh mục: Sổ (Vở)
        { sku: 'VOB001', name: 'Vở kẻ ngang 100 trang', description: 'Vở kẻ ngang chất lượng cao, giấy trắng sáng.', price: 15000, stock: 60, imageUrl: '/img/default-product.png', category: 'Sổ' },
        { sku: 'VOB002', name: 'Vở ô li 80 trang', description: 'Vở ô li phù hợp toán học, ô vuông chuẩn.', price: 12000, stock: 75, imageUrl: '/img/default-product.png', category: 'Sổ' },
        { sku: 'VOB003', name: 'Sổ ghi chú nhỏ', description: 'Sổ ghi chú nhỏ gọn, dễ mang theo.', price: 18000, stock: 40, imageUrl: '/img/default-product.png', category: 'Sổ' },
        { sku: 'VOB004', name: 'Sổ tay Da PU', description: 'Sổ tay da PU cao cấp, bền và đẹp.', price: 45000, stock: 25, imageUrl: '/img/default-product.png', category: 'Sổ' },
        { sku: 'VOB005', name: 'Giấy in A4', description: 'Giấy in A4 chất lượng cao, phù hợp máy in.', price: 32000, stock: 50, imageUrl: '/img/default-product.png', category: 'Sổ' },

        // Danh mục: Dấu
        { sku: 'DAU001', name: 'Đầu bút highlight', description: 'Bút highlight 4 màu, viết nổi bật trên giấy.', price: 22000, stock: 55, imageUrl: '/img/default-product.png', category: 'Dấu' },
        { sku: 'DAU002', name: 'Bộ bút màu 12 cây', description: 'Bộ bút màu 12 cây, màu sắc đa dạng và rực rỡ.', price: 28000, stock: 35, imageUrl: '/img/default-product.png', category: 'Dấu' },
        { sku: 'DAU003', name: 'Bảng dán kế hoạch', description: 'Bảng dán kế hoạch tuần, giúp quản lý thời gian.', price: 35000, stock: 30, imageUrl: '/img/default-product.png', category: 'Dấu' },
        { sku: 'DAU004', name: 'Dấu tròn điểm', description: 'Dấu tròn điểm giúp chấm điểm học sinh nhanh chóng.', price: 15000, stock: 50, imageUrl: '/img/default-product.png', category: 'Dấu' },

        // Danh mục: Khác
        { sku: 'KHA001', name: 'Balo học sinh', description: 'Balo học sinh chống nước, nhiều ngăn tiện dụng.', price: 85000, stock: 20, imageUrl: '/img/default-product.png', category: 'Khác' },
        { sku: 'KHA002', name: 'Túi giấy A4', description: 'Túi giấy A4 dùng để bảo vệ tài liệu và sổ vở.', price: 12000, stock: 100, imageUrl: '/img/default-product.png', category: 'Khác' },
        { sku: 'KHA003', name: 'Thước kẻ 30cm', description: 'Thước kẻ nhựa trong 30cm, dễ đọc số và đường kẻ.', price: 15000, stock: 80, imageUrl: '/img/default-product.png', category: 'Khác' },
        { sku: 'KHA004', name: 'Máy tính cầm tay', description: 'Máy tính cầm tay tiện lợi, dành cho học sinh.', price: 320000, stock: 10, imageUrl: '/img/default-product.png', category: 'Khác' },
        { sku: 'KHA005', name: 'Kẹp giấy đa màu', description: 'Kẹp giấy đa màu 10 cái, dễ phân loại tài liệu.', price: 18000, stock: 60, imageUrl: '/img/default-product.png', category: 'Khác' }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`Seed ${products.length} sản phẩm vào MongoDB thành công.`);
    await mongoose.connection.close();
}

seed().catch(err => {
    console.error('Seed lỗi:', err);
    process.exit(1);
});
