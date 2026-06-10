const jwt = require('jsonwebtoken');

// Yeh check karega ki user ke paas valid token hai ya nahi
const protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Header se token nikalna
    
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied!' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Token se user id aur role request mein add ho jayega
        next(); // Agle step par bhejo
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid!' });
    }
};

// Yeh check karega ki user Admin hai ya nahi
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied! Admins only.' });
    }
};

module.exports = { protect, adminOnly };