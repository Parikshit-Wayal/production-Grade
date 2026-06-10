const express = require('express');
const router = express.Router();
const Cart = require('./Cart');
const { protect } = require('./middleware/authMiddleware');

// 1. GET USER CART (Sirf logged-in user apni cart dekh sake)
router.get('/', protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('items.productId');
        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
            await cart.save();
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. ADD ITEM TO CART (Ya quantity badhane ke liye)
router.post('/add', protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ userId: req.user.id, items: [] });
        }

        // Check karo agar item pehle se cart mein hai
        const itemIndex = cart.items.findIndex(item => item.productId.toString() === productId);

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity || 1;
        } else {
            cart.items.push({ productId, quantity: quantity || 1 });
        }

        await cart.save();
        res.status(200).json({ message: 'Item added to cart! 🛒', cart });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;