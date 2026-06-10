const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Load the auth routes directly from its folder
app.use('/api/auth', require('./auth.js'));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Auth Service running on port ${PORT}`));
