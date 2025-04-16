const express = require('express');
const cors = require('cors');
const app = express();
const mapRoutes = require('./routes/maps.routes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/maps', mapRoutes);

module.exports = app;
