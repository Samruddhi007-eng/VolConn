const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. Middleware FIRST
app.use(cors());
app.use(express.json());

// 2. Routes SECOND
// Verify these files exist and have module.exports = router
app.use('/api/auth', require('./routes/auth')); 
const postRoutes = require('./routes/posts'); // Import the file
app.use('/api/posts', postRoutes);
// 3. Database Connection LAST
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));