// routes/authRoutes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Task = require('../models/Task');
const Campaign = require('../models/Campaign');

const router = express.Router();

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// 1. Signup - FIXED VERSION
router.post('/signup', [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('role')
    .optional()
    .isIn(['volunteer', 'admin', 'coordinator'])
    .withMessage('Invalid role'),
  body('phone')
    .optional()
    .isString()
    .withMessage('Phone must be a string'),
  body('address')
    .optional()
    .isString()
    .withMessage('Address must be a string')
], validateRequest, async (req, res, next) => {
  try {
    const { email, name, password, role = 'volunteer', address, phone } = req.body;

    console.log('Signup attempt:', { email, name, role }); // Debug log

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user - password will be hashed by pre-save middleware
    const newUser = new User({
      email: email.toLowerCase(),
      name: name.trim(),
      passHash: password, // This will be hashed by pre-save middleware
      role,
      address: address?.trim(),
      phone: phone?.trim()
    });

    const savedUser = await newUser.save();
    console.log('User created successfully:', savedUser.email); // Debug log

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: savedUser // passHash will be removed by toJSON method
    });
  } catch (error) {
    console.error('Error in signup:', error);
    next(error);
  }
});

// 2. Login - FIXED VERSION
router.post('/login', [
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
], validateRequest, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email }); // Debug log (don't log password)
    
    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });
      
    if (!user) {
      console.log('User not found for email:', email); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }
    
    console.log('User found:', { 
      id: user._id, 
      email: user.email,
      hasStoredHash: !!user.passHash
    }); // Debug log
    
    // Compare password using the model method
    const isMatch = await user.comparePassword(password);
    console.log('Password comparison result:', isMatch); // Debug log
    
    if (!isMatch) {
      console.log('Password mismatch for user:', email); // Debug log
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    console.log('Login successful for user:', email); // Debug log
    
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          score: user.score,
          learningComplete: user.learningComplete,
          address: user.address
        }
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    next(error);
  }
});

// Rest of your routes remain the same...
// 3. hasCompletedLearning → PATCH /users/:id/learning
router.patch('/users/:id/learning', [
  param('id').isMongoId().withMessage('Invalid user ID format')
], validateRequest, async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      {
        learningComplete: true,
        updatedAt: new Date()
      },
      { new: true }
    ).select('-passHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Learning status updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Error in updating learning status:', error);
    next(error);
  }
});

// 4. fetchUpcomingTasks → GET /tasks/upcoming/:volunteerId
router.get('/tasks/upcoming/:volunteerId', [
  param('volunteerId').isMongoId().withMessage('Invalid volunteer ID format')
], validateRequest, async (req, res, next) => {
  try {
    const volunteerId = req.params.volunteerId;

    // Verify volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    const tasks = await Task.find({
      volunteerId: volunteerId,
      isCompleted: false,
      status: { $in: ['assigned', 'in-progress'] }
    })
    .populate('campaignId', 'title startDate endDate startTime endTime')
    .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      data: {
        volunteer: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email
        },
        upcomingTasks: tasks,
        totalTasks: tasks.length
      }
    });
  } catch (error) {
    console.error('Error in fetchUpcomingTasks:', error);
    next(error);
  }
});

// 5. isFinished → GET /tasks/completed
router.get('/tasks/completed', async (req, res, next) => {
  try {
    const { limit = 50, page = 1, volunteerId } = req.query;
    const query = { isCompleted: true };
    
    if (volunteerId) {
      query.volunteerId = volunteerId;
    }

    const tasks = await Task.find(query)
      .populate('volunteerId', 'name email')
      .populate('campaignId', 'title startDate endDate')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const totalCount = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        completedTasks: tasks,
        totalCount,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error in fetchCompletedTasks:', error);
    next(error);
  }
});

// 6. fetchCampaignsForVolunteer → GET /campaigns/by-volunteer/:id
router.get('/campaigns/by-volunteer/:id', [
  param('id').isMongoId().withMessage('Invalid volunteer ID format')
], validateRequest, async (req, res, next) => {
  try {
    const volunteerId = req.params.id;

    // Verify volunteer exists
    const volunteer = await User.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    const campaigns = await Campaign.find({
      volunteerIds: volunteerId
    })
    .populate('coordinatorId', 'name email')
    .populate('wardId', 'wardName location')
    .sort({ startDate: -1 });

    res.status(200).json({
      success: true,
      data: {
        volunteer: {
          id: volunteer._id,
          name: volunteer.name,
          email: volunteer.email
        },
        campaigns: campaigns,
        totalCampaigns: campaigns.length
      }
    });
  } catch (error) {
    console.error('Error in fetchCampaignsForVolunteer:', error);
    next(error);
  }
});

module.exports = router;