const mongoose = require('mongoose');
const Product = require('./models/Products');

async function seed() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shop_db');

    const products = [
        { sku: 'BD001', name: 'Băng keo điện 01', description: 'Băng keo điện trong suốt, chịu nhiệt và cách điện tốt.', price: 12000, imageUrl: '/img/bang-keo-dien-01.jpg', category: 'Băng keo điện' },
        { sku: 'BD002', name: 'Băng keo điện 02', description: 'Băng keo điện chất lượng cao, bám dính tốt cho hệ thống điện.', price: 14000, imageUrl: '/img/bang-keo-dien-02.jpg', category: 'Băng keo điện' },
        { sku: 'BD003', name: 'Băng keo điện 03', description: 'Băng keo điện dày, an toàn và bền cho mọi công việc lắp đặt.', price: 16000, imageUrl: '/img/bang-keo-dien-03.jpg', category: 'Băng keo điện' },

        { sku: 'BG001', name: 'Băng keo giấy 01', description: 'Băng keo giấy dính nhẹ, dễ xé và dễ trang trí.', price: 9000, imageUrl: '/img/bang-keo-giay-01.jpg', category: 'Băng keo giấy' },
        { sku: 'BG002', name: 'Băng keo giấy 02', description: 'Băng keo giấy màu sắc nhẹ nhàng, phù hợp với văn phòng.', price: 11000, imageUrl: '/img/bang-keo-giay-02.jpg', category: 'Băng keo giấy' },
        { sku: 'BG003', name: 'Băng keo giấy 03', description: 'Băng keo giấy chuyên dụng cho ghi chú và đóng gói nhẹ.', price: 10000, imageUrl: '/img/bang-keo-giay-03.jpg', category: 'Băng keo giấy' },

        { sku: 'BV001', name: 'Băng keo vải 01', description: 'Băng keo vải dẻo dai, dùng cho sửa chữa và dán giấy.', price: 18000, imageUrl: '/img/bang-keo-vai-01.jpg', category: 'Băng keo vải' },
        { sku: 'BV002', name: 'Băng keo vải 02', description: 'Băng keo vải màu đen, độ bám cao, phù hợp nhiều mục đích.', price: 19000, imageUrl: '/img/bang-keo-vai-02.jpg', category: 'Băng keo vải' },
        { sku: 'BV003', name: 'Băng keo vải 03', description: 'Băng keo vải đa năng, dễ sử dụng khi cần cố định các bề mặt.', price: 21000, imageUrl: '/img/bang-keo-vai-03.jpg', category: 'Băng keo vải' },

        { sku: 'GGC001', name: 'Giấy ghi chú 01', description: 'Giấy ghi chú nhỏ gọn, dùng để nhớ việc và nhắc nhở.', price: 15000, imageUrl: '/img/giay-ghi-chu-01.jpg', category: 'Giấy ghi chú' },
        { sku: 'GGC002', name: 'Giấy ghi chú 02', description: 'Giấy ghi chú khổ lớn, dễ dán lên sách vở và máy tính.', price: 16000, imageUrl: '/img/giay-ghi-chu-02.jpg', category: 'Giấy ghi chú' },
        { sku: 'GGC003', name: 'Giấy ghi chú 03', description: 'Giấy ghi chú màu sắc, giữ vị trí và thông tin gọn gàng.', price: 17000, imageUrl: '/img/giay-ghi-chu-03.jpg', category: 'Giấy ghi chú' },

        { sku: 'GI001', name: 'Giấy in 01', description: 'Giấy in A4 chất lượng cao, phù hợp với máy in phun và laser.', price: 32000, imageUrl: '/img/giay-in-01.jpg', category: 'Giấy in' },
        { sku: 'GI002', name: 'Giấy in 02', description: 'Giấy in đa năng, trắng sáng, phù hợp in ấn văn phòng hồ sơ.', price: 34000, imageUrl: '/img/giay-in-02.jpg', category: 'Giấy in' },
        { sku: 'GI003', name: 'Giấy in 03', description: 'Giấy in tiêu chuẩn, mực in đều và không bị mờ.', price: 35000, imageUrl: '/img/giay-in-03.jpg', category: 'Giấy in' },

        { sku: 'TB001', name: 'Thước bộ 01', description: 'Thước bộ bao gồm thước thẳng, thước tam giác và êke.', price: 45000, imageUrl: '/img/thuoc-bo-01.jpg', category: 'Thước bộ' },
        { sku: 'TB002', name: 'Thước bộ 02', description: 'Bộ thước đầy đủ cho học sinh và dân văn phòng, dễ đo đạc chính xác.', price: 48000, imageUrl: '/img/thuoc-bo-02.jpg', category: 'Thước bộ' },
        { sku: 'TB003', name: 'Thước bộ 03', description: 'Bộ thước tiện dụng, vật liệu nhựa chịu lực tốt.', price: 52000, imageUrl: '/img/thuoc-bo-03.jpg', category: 'Thước bộ' },

        { sku: 'TG001', name: 'Thước gỗ 01', description: 'Thước gỗ tự nhiên, bền và dễ sử dụng.', price: 18000, imageUrl: '/img/thuoc-go-01.jpg', category: 'Thước gỗ' },
        { sku: 'TG002', name: 'Thước gỗ 02', description: 'Thước gỗ chuẩn, thích hợp dùng trong lớp học và văn phòng.', price: 19000, imageUrl: '/img/thuoc-go-02.jpg', category: 'Thước gỗ' },
        { sku: 'TG003', name: 'Thước gỗ 03', description: 'Thước gỗ dày, dễ cầm và chống cong vênh.', price: 20000, imageUrl: '/img/thuoc-go-03.jpg', category: 'Thước gỗ' },

        { sku: 'TN001', name: 'Thước nhựa 01', description: 'Thước nhựa trong, dễ đọc số và đường kẻ.', price: 15000, imageUrl: '/img/thuoc-nhua-01.jpg', category: 'Thước nhựa' },
        { sku: 'TN002', name: 'Thước nhựa 02', description: 'Thước nhựa chịu lực, phù hợp chuyên dùng học tập.', price: 16000, imageUrl: '/img/thuoc-nhua-02.jpg', category: 'Thước nhựa' },
        { sku: 'TN003', name: 'Thước nhựa 03', description: 'Thước nhựa màu sắc với các kích thước đo đa dạng.', price: 17000, imageUrl: '/img/thuoc-nhua-03.jpg', category: 'Thước nhựa' },

        { sku: 'MT1', name: 'Máy tính cầm tay MT1', description: 'Máy tính cầm tay tiện lợi, dành cho học sinh và kỹ sư.', price: 320000, imageUrl: '/img/MT1.jpg', category: 'Máy tính' },
        { sku: 'MT2', name: 'Máy tính cầm tay MT2', description: 'Máy tính bỏ túi độ bền cao, hỗ trợ chức năng cơ bản và khoa học.', price: 330000, imageUrl: '/img/MT2.jpg', category: 'Máy tính' },
        { sku: 'MT3', name: 'Máy tính cầm tay MT3', description: 'Máy tính nhỏ gọn, pin lâu và dễ mang theo.', price: 340000, imageUrl: '/img/MT3.jpg', category: 'Máy tính' },
        { sku: 'MT4', name: 'Máy tính cầm tay MT4', description: 'Máy tính độ tin cậy cao, dùng cho học sinh, sinh viên.', price: 350000, imageUrl: '/img/MT4.jpg', category: 'Máy tính' },

        { sku: 'PEN1', name: 'Bút máy pen1', description: 'Bút máy đen mực chuẩn, viết êm tay.', price: 24000, imageUrl: '/img/pen1.jpg', category: 'Bút máy' },
        { sku: 'PEN2', name: 'Bút máy pen2', description: 'Bút máy thiết kế nhỏ gọn, phù hợp văn phòng và học tập.', price: 25000, imageUrl: '/img/pen2.jpg', category: 'Bút máy' },
        { sku: 'PEN3', name: 'Bút máy pen3', description: 'Bút máy thân nhẹ, mực đều, dễ sử dụng.', price: 26000, imageUrl: '/img/pen3.jpg', category: 'Bút máy' },
        { sku: 'PEN4', name: 'Bút máy pen4', description: 'Bút máy thời trang, giữ chữ đều và đẹp.', price: 28000, imageUrl: '/img/pen4.jpg', category: 'Bút máy' },

        { sku: 'PCL1', name: 'Bút chì pencil1', description: 'Bút chì mềm 2B, viết đậm và dễ tẩy.', price: 12000, imageUrl: '/img/pencil1.jpg', category: 'Bút chì' },
        { sku: 'PCL2', name: 'Bút chì pencil2', description: 'Bút chì gỗ chất lượng, phù hợp vẽ và viết.', price: 13000, imageUrl: '/img/pencil2.jpg', category: 'Bút chì' },
        { sku: 'PCL3', name: 'Bút chì pencil3', description: 'Bút chì 2B thân cứng, không bị gãy đầu dễ dàng.', price: 14000, imageUrl: '/img/pencil3.jpg', category: 'Bút chì' },
        { sku: 'PCL4', name: 'Bút chì pencil4', description: 'Bút chì bút chì chất lượng cao, cho nét viết đều.', price: 15000, imageUrl: '/img/pencil4.jpg', category: 'Bút chì' }
    ];

    await Product.deleteMany({});
    await Product.insertMany(products);

    console.log(`✅ Seed ${products.length} sản phẩm vào MongoDB thành công.`);
    await mongoose.connection.close();
}

seed().catch(err => {
    console.error('❌ Seed lỗi:', err);
    process.exit(1);
});
