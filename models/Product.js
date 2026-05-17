const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    imageUrl: { type: String, required: true }, // Sẽ lưu đường dẫn như: /img/pen_01.png
    category: String,
    description: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);