const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    image: { type: String, default: 'https://via.placeholder.com/150' },
    stock: { type: Number, required: true, default: 10 }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema); // Dhyan dein 'Product' (P capital) hai