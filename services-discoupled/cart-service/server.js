const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Points directly to cart.js in the same folder
app.use('/api/cart', require('./cart.js'));

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => console.log(`Cart Service running on port ${PORT}`));
