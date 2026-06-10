const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Points directly to products.js in the same folder
app.use('/api/products', require('./products.js'));

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Products Service running on port ${PORT}`));
