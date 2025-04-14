const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { 
      firstname: req.body.firstname ? 'provided' : 'missing',
      lastname: req.body.lastname ? 'provided' : 'missing',
      email: req.body.email ? 'provided' : 'missing',
      password: req.body.password ? 'provided' : 'missing'
    });
    
    const { firstname, lastname, email, password } = req.body;

    // Validate required fields
    if (!firstname || !lastname || !email || !password) {
      console.log('Registration failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(`Registration failed: User with email ${email} already exists`);
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Create new user - password will be hashed by the pre-save middleware
    const user = new User({
      firstname,
      lastname,
      email,
      password
    });

    await user.save();
    console.log(`User registered successfully: ${user._id}`);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login request received:', { 
      email: req.body.email ? 'provided' : 'missing',
      password: req.body.password ? 'provided' : 'missing'
    });
    
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log(`Login failed: User with email ${email} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password using the comparePassword method from the user model
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      console.log(`Login failed: Invalid password for user ${email}`);
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(`User logged in successfully: ${user._id}`);
    
    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

exports.verifyToken = async (req, res) => {
  try {
    console.log('Token verification request received');
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      console.log('Token verification failed: No token provided');
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    console.log(`Token verified for user ID: ${decoded.userId}`);
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log(`Token verification failed: User with ID ${decoded.userId} not found`);
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    console.log(`Token verification successful for user: ${user._id}`);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
}; 