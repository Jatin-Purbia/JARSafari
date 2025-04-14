const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.header('Authorization');
    
    if (!authHeader) {
      return res.status(401).json({ 
        success: false,
        message: 'No authentication token provided' 
      });
    }

    // Check if it's a Bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token format. Use Bearer token' 
      });
    }

    const token = authHeader.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'Authentication required' 
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);
      
      // Find user
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return res.status(401).json({ 
          success: false,
          message: 'User not found' 
        });
      }

      // Add user to request
      req.user = user;
      req.token = token;
      next();
    } catch (jwtError) {
      console.error('JWT Verification Error:', jwtError);
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token',
        error: jwtError.message
      });
    }
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Authentication error',
      error: error.message 
    });
  }
};

module.exports = auth;