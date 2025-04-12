const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route
router.get('/verify', auth, verifyToken);

module.exports = router; 