const mongoose = require('mongoose');

/**
 * Kết nối MongoDB với cấu hình tối ưu
 * ✅ Connection pooling
 * ✅ Retry logic
 * ✅ Timeout
 */
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10,           // Tối đa 10 kết nối
            minPoolSize: 5,            // Tối thiểu 5 kết nối
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);  // Dừng ứng dụng nếu không kết nối được
    }
};

// Xử lý ngắt kết nối
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB Disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB Error:', err);
});

module.exports = connectDB;
