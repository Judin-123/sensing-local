// routes/userRoutes.js
const express = require('express');
const { body, param, validationResult } = require('express-validator');
const User = require('../models/User');
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

// Get users by role
router.get('/users', async (req, res, next) => {
  try {
    const { role, limit = 50 } = req.query;

    const query = { isActive: true };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('name email role score phone address')
      .sort({ score: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
});

// SetScore - Takes user id and increments score by specified points
router.post('/set-score', [
  body('userId').isMongoId().withMessage('Invalid user ID format'),
  body('points').optional().isInt({ min: 1 }).withMessage('Points must be a positive integer')
], validateRequest, async (req, res, next) => {
  try {
    const { userId, points = 1 } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { score: points } },
      { new: true }
    ).select('name email score role');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Score incremented by ${points} successfully`,
      data: {
        user: updatedUser,
        pointsAdded: points
      }
    });
  } catch (error) {
    next(error);
  }
});

// SetPenalty - FIXED VERSION - Takes user id and decrements score by specified penalty
router.post('/set-penalty', [
  body('userId').isMongoId().withMessage('Invalid user ID format'),
  body('penalty').optional().isInt({ min: 1 }).withMessage('Penalty must be a positive integer'),
  body('reason').optional().isString().withMessage('Reason must be a string')
], validateRequest, async (req, res, next) => {
  try {
    const { userId, penalty = 2, reason } = req.body;

    // First, get the current user to check the score
    const currentUser = await User.findById(userId).select('score');

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate new score and ensure it doesn't go below 0
    const currentScore = currentUser.score || 0;
    const newScore = Math.max(0, currentScore - penalty);

    // Update with the calculated score
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { score: newScore },
      { new: true }
    ).select('name email score role');

    res.status(200).json({
      success: true,
      message: `Penalty of ${penalty} points applied successfully`,
      data: {
        user: updatedUser,
        penaltyApplied: penalty,
        actualDeduction: currentScore - newScore,
        reason: reason || 'No reason provided'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get user profile
router.get('/user/:userId', [
  param('userId').isMongoId().withMessage('Invalid user ID format')
], validateRequest, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .select('-passHash')
      .where('isActive').equals(true);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found or inactive'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res, next) => {
  try {
    const { limit = 10, role } = req.query;

    const query = { isActive: true };
    if (role) {
      query.role = role;
    }

    const users = await User.find(query)
      .select('name email role score')
      .sort({ score: -1 })
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: users.length,
      data: users.map((user, index) => ({
        rank: index + 1,
        ...user.toObject()
      }))
    });
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/user/:userId', [
  param('userId').isMongoId().withMessage('Invalid user ID format'),
  body('name').optional().isString().trim().withMessage('Name must be a string'),
  body('address').optional().isString().trim().withMessage('Address must be a string'),
  body('phone').optional().isString().trim().withMessage('Phone must be a string'),
  body('learningComplete').optional().isBoolean().withMessage('Learning complete must be a boolean')
], validateRequest, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated via this route
    delete updates.email;
    delete updates.passHash;
    delete updates.role;
    delete updates.score;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-passHash');

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User profile updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
});

// Create new user (kept for backward compatibility)
router.post('/user', [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('passHash').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['volunteer', 'admin', 'coordinator']).withMessage('Invalid role'),
  body('address').optional().isString().withMessage('Address must be a string')
], validateRequest, async (req, res, next) => {
  try {
    const { name, email, passHash, role = 'volunteer', address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    const user = new User({
      name,
      email,
      passHash,
      role,
      address
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;