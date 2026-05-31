if (!global.crypto) {
    global.crypto = require('crypto');
}

const mongoose = require('mongoose');
const User = require('./models/User');

async function seedAdmin() {
    await mongoose.connect('mongodb://127.0.0.1:27017/shop_db');

    // Xóa admin cũ (nếu có)
    await User.deleteMany({ role: 'admin' });

    // Tạo admin mới
    const admin = new User({
        username: 'admin',
        email: 'admin@edustore.com',
        password: '123456', // Will be hashed by pre-save hook
        role: 'admin',
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam'
    });

    await admin.save();

    console.log('Admin user created:');
    console.log('   Username: admin');
    console.log('   Email: admin@edustore.com');
    console.log('   Password: 123456');

    await mongoose.connection.close();
}

seedAdmin().catch(err => {
    console.error('Seed lỗi:', err);
    process.exit(1);
});
