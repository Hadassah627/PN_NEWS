const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Reporter = require('../models/Reporter');
const Admin = require('../models/Admin');
const { validateReporterId, extractPlaceName } = require('../middleware/reporterValidator');
const logActivity = require('../utils/logger');

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user._id, 
      role: user.role,
      email: user.email,
      reporterId: user.reporterId || null
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/register/user
// @desc    Register a new user
// @access  Public
router.post('/register/user', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    // Log activity
    await logActivity(
      'User Registration',
      {
        userId: user._id,
        userType: 'User',
        name: user.name,
        email: user.email
      },
      {},
      `User ${user.name} registered`,
      req.ip
    );

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/register/reporter
// @desc    Register a new reporter
// @access  Public
router.post('/register/reporter', [
  body('reporterId').trim().notEmpty().withMessage('Reporter ID is required'),
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('placeName').trim().notEmpty().withMessage('Place name is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reporterId, name, email, password, placeName } = req.body;

    // Validate reporter ID format
    if (!validateReporterId(reporterId)) {
      return res.status(400).json({ 
        message: 'Invalid Reporter ID format. Use format: {PlaceName}PN{Number} (e.g., HydPN101)' 
      });
    }

    // Check if reporter ID already exists
    let reporter = await Reporter.findOne({ reporterId });
    if (reporter) {
      return res.status(400).json({ message: 'Reporter ID already exists' });
    }

    // Check if email already exists
    reporter = await Reporter.findOne({ email });
    if (reporter) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create reporter
    reporter = new Reporter({
      reporterId,
      name,
      email,
      password: hashedPassword,
      placeName
    });

    await reporter.save();

    // Log activity
    await logActivity(
      'Reporter Registration',
      {
        userId: reporter._id,
        userType: 'Reporter',
        name: reporter.name,
        email: reporter.email,
        reporterId: reporter.reporterId
      },
      {},
      `Reporter ${reporter.reporterId} registered`,
      req.ip
    );

    // Generate token
    const token = generateToken(reporter);

    res.status(201).json({
      message: 'Reporter registered successfully',
      token,
      reporter: {
        id: reporter._id,
        reporterId: reporter.reporterId,
        name: reporter.name,
        email: reporter.email,
        placeName: reporter.placeName,
        role: reporter.role,
        isActive: reporter.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login/user
// @desc    Login user
// @access  Public
router.post('/login/user', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log activity
    await logActivity(
      'User Login',
      {
        userId: user._id,
        userType: 'User',
        name: user.name,
        email: user.email
      },
      {},
      `User ${user.name} logged in`,
      req.ip
    );

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login/reporter
// @desc    Login reporter
// @access  Public
router.post('/login/reporter', [
  body('reporterId').trim().notEmpty().withMessage('Reporter ID is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reporterId, password } = req.body;

    // Validate reporter ID format
    if (!validateReporterId(reporterId)) {
      return res.status(400).json({ 
        message: 'Invalid Reporter ID format' 
      });
    }

    // Find reporter
    const reporter = await Reporter.findOne({ reporterId });
    if (!reporter) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if reporter is active
    if (!reporter.isActive) {
      return res.status(403).json({ message: 'Your account has been deactivated. Please contact administrator.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, reporter.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log activity
    await logActivity(
      'Reporter Login',
      {
        userId: reporter._id,
        userType: 'Reporter',
        name: reporter.name,
        email: reporter.email,
        reporterId: reporter.reporterId
      },
      {},
      `Reporter ${reporter.reporterId} logged in`,
      req.ip
    );

    // Generate token
    const token = generateToken(reporter);

    res.json({
      message: 'Login successful',
      token,
      reporter: {
        id: reporter._id,
        reporterId: reporter.reporterId,
        name: reporter.name,
        email: reporter.email,
        placeName: reporter.placeName,
        role: reporter.role,
        isActive: reporter.isActive
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/auth/login/admin
// @desc    Login admin
// @access  Public
router.post('/login/admin', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find admin
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Log activity
    await logActivity(
      'Admin Login',
      {
        userId: admin._id,
        userType: 'Admin',
        email: admin.email
      },
      {},
      `Admin logged in`,
      req.ip
    );

    // Generate token
    const token = generateToken(admin);

    res.json({
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
