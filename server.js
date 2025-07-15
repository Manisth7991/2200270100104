require('dotenv').config(); // Always load env first
const express = require('express');
const mongoose = require('mongoose');
const logger = require('./middleware/logger');
const urlRoutes = require('./routes/urlRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(logger);

// Routes
app.use('/', urlRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(process.env.PORT || 3000, () =>
      console.log(`🚀 Server running on port ${process.env.PORT || 3000}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

