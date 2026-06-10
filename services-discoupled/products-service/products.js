const express = require('express');
const router = express.Router();
const Product = require('./Product');
const { protect, adminOnly } = require('./middleware/authMiddleware');

// 1. VIEW ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
    try {
        // Find ke sath lean() lagane se pure JSON data milta hai
        const products = await Product.find({}).lean(); 
        
        // Hamesha check karo agar products array hai, nahi toh khali array bhejo
        if (!products) {
            return res.json([]);
        }
        
        res.json(products);
    } catch (err) {
        // Agar crash ho toh server terminal par print karega error
        console.error("Backend GET Products Error:", err.message);
        res.status(500).json([]); // Status 500 ke sath empty array bhej do taaki frontend crash na ho
    }
});

// 2. ADD PRODUCT (Secure - Sirf Admin)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, price, description, image, stock } = req.body;
        
        const newProduct = new Product({ name, price, description, image, stock });
        await newProduct.save();
        
        res.status(201).json({ message: 'Product added successfully! 📦', product: newProduct });
    } catch (err) {
        console.error("Backend POST Product Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;