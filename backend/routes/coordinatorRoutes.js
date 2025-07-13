// routes/coordinatorRoutes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
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

// fetchCoordinatorDetails - Takes coordinator id and returns coordinator details
router.get('/coordinator/:coordinatorId', [
  param('coordinatorId').isMongoId().withMessage('Invalid coordinator ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { coordinatorId } = req.params;

    const coordinator = await User.findById(coordinatorId)
      .select('name email role score isActive')
      .where('role').equals('coordinator')
      .where('isActive').equals(true);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found or inactive'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        id: coordinator._id,
        name: coordinator.name,
        email: coordinator.email,
        role: coordinator.role,
        score: coordinator.score
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get all coordinators
router.get('/coordinators', async (req, res, next) => {
  try {
    const coordinators = await User.find({
      role: 'coordinator',
      isActive: true
    }).select('name email score');

    res.status(200).json({
      success: true,
      count: coordinators.length,
      data: coordinators
    });
  } catch (error) {
    next(error);
  }
});

// Get volunteers by coordinator
router.get('/volunteers/by-coordinator/:coordinatorId', [
  param('coordinatorId').isMongoId().withMessage('Invalid coordinator ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { coordinatorId } = req.params;

    // First verify the coordinator exists
    const coordinator = await User.findById(coordinatorId)
      .where('role').equals('coordinator')
      .where('isActive').equals(true);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    // Get volunteers (for now, return all volunteers since we don't have coordinator-volunteer mapping)
    const volunteers = await User.find({
      role: 'volunteer',
      isActive: true
    }).select('name email phone address score');

    res.status(200).json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    next(error);
  }
});

// Get campaigns by coordinator
router.get('/campaigns/by-coordinator/:coordinatorId', [
  param('coordinatorId').isMongoId().withMessage('Invalid coordinator ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { coordinatorId } = req.params;

    // First verify the coordinator exists
    const coordinator = await User.findById(coordinatorId)
      .where('role').equals('coordinator')
      .where('isActive').equals(true);

    if (!coordinator) {
      return res.status(404).json({
        success: false,
        message: 'Coordinator not found'
      });
    }

    // Get campaigns for this coordinator
    const campaigns = await Campaign.find({
      coordinatorId: coordinatorId
    }).populate('wardId', 'wardName location');

    res.status(200).json({
      success: true,
      data: campaigns
    });
  } catch (error) {
    next(error);
  }
});

// Create new coordinator
router.post('/coordinator', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('passHash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('address').optional().isString().withMessage('Address must be a string')
], validateRequest, async (req, res, next) => {
  try {
    const { name, email, passHash, address } = req.body;

    // Check if coordinator already exists
    const existingCoordinator = await User.findOne({ email });
    if (existingCoordinator) {
      return res.status(400).json({
        success: false,
        message: 'Coordinator with this email already exists'
      });
    }

    const coordinator = new User({
      name,
      email,
      passHash,
      address,
      role: 'coordinator'
    });

    await coordinator.save();

    res.status(201).json({
      success: true,
      message: 'Coordinator created successfully',
      data: coordinator
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;